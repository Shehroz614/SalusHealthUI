import React, { Fragment, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Col,
  Row,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import CustomButton from "@src/components/CustomButton";
import { Helmet } from "react-helmet";
import { siteInfo } from "@src/constants";
import {
  Bell,
  Calendar,
  Clock,
  MoreVertical,
  Save,
  Video,
  X,
  AlignCenter,
  ChevronLeft,
  ChevronRight,
} from "react-feather";
import {  Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { appointmentService } from "../../../../services/appointmentService";
import {
  SweetAlert,
  SweetAlertWithValidation,
} from "../../../../components/SweetAlert";
import no_result from "../../../../assets/images/svg/no-result.svg";
import SkeletonComponent from "../../../../components/SkeletonComponent";
import {
  addMinutesToTimeSlot,
  formatDatetoTime,
  getMonthNameFromDate,
  hasTimePassed,
  isDateInCurrentWeek,
  getCurrentWeekDateRange,
  formatDateToYYYYMMDD
} from "../../../../utility/Utils";
import { useEffect } from "react";
import { motion } from "framer-motion";
import Avatar from "@components/avatar";


//Pagination component
const Pagination = ({ currentPage, totalPageCount, paginate }) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPageCount;

  return (
    <div className="pagination">
      <ul className="pagination-list">
        <li className="pagination-item">
          <a
            onClick={(e) => {
              e.preventDefault();
              !isFirstPage && paginate(currentPage - 1);
            }}
            href="#"
            className={`pagination-link ${isFirstPage ? "disbaledLink" : ""}`}
          >
            <ChevronLeft />
          </a>
        </li>

        {Array.from({ length: totalPageCount }, (_, index) => {
          const pageNumber = index + 1;
          return (
            <li
              key={pageNumber}
              className={`pagination-item ${
                pageNumber === currentPage ? "active" : ""
              }`}
            >
              <a
                onClick={(e) => {
                  e.preventDefault();
                  paginate(pageNumber);
                }}
                href="#"
                className="pagination-link"
                style={pageNumber === currentPage ? { color: "white" } : {}}
              >
                {pageNumber}
              </a>
            </li>
          );
        })}

        <li className="pagination-item">
          <a
            onClick={(e) => {
              e.preventDefault();
              !isLastPage && paginate(currentPage + 1);
            }}
            href="#"
            className={`pagination-link ${isLastPage ? "disbaledLink" : ""}`}
          >
            <ChevronRight />
          </a>
        </li>
      </ul>
    </div>
  );
};

//Main Component
function SessionsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upcoming");
  const user = useSelector((store) => store.auth.user);
  const [sessions, setSessions] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ modal: false, id: "" });
  const [searchValue, setSearchValue] = useState("");
  const [instructors, setInstructors] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [currentMeeting, setCurrentMeeting] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sessionsPerPage] = useState(3);
  const showedLists = useRef({today:false, weekly:false,upcoming:false});

  // Calculate the index of the first and last session to display on the current page
  const totalPageCount = Math.ceil(
    sessions[activeTab].length / sessionsPerPage
  );
  const indexOfLastSession = currentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions = sessions[activeTab].slice(
    indexOfFirstSession,
    indexOfLastSession
  );

  // Function to handle page change
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleListScroll = () => {
    const menu = document.querySelector(".dropdown-menu.show");
    menu?.classList.remove(["show"]);
  };

  const handleChange = (e) => {
    setSelectedInstructor(e.target.value);
    let data = [...appointmentData?.data?.result?.appointments];
    if (e.target.value !== "All") {
      data = data.filter(
        (session) => session?.provider?.full_name === e.target.value
      );
    }
    setSessions({
      upcoming: data.filter((session) => !hasTimePassed(session.date)),
      past: data.filter((session) => hasTimePassed(session.date)),
    });
  };

  function isMeetingCurrentlyOngoing(meeting) {
    const currentDate = new Date();
    const meetingDate = new Date(meeting.date);
    const meetingLengthMinutes = meeting.length;
    const meetingEndTime = new Date(
      meetingDate.getTime() + meetingLengthMinutes * 60000
    );
    return currentDate >= meetingDate && currentDate <= meetingEndTime;
  }

  //get appointments
  const {
    data: appointmentData,
    isLoading: isLoadingAppointments,
    refetch,
  } = appointmentService.getAppointments(
    {
      userId: user.id,
    },
    {
      onSuccess: async (response) => {
        if (response?.data?.success == true) {
          const data = response?.data?.result?.appointments;
          setSessions({
            upcoming: data.filter((session) => !hasTimePassed(session.date)),
            past: data.filter((session) => hasTimePassed(session.date)),
          });
          const currentMet = data.find((session) =>
            isMeetingCurrentlyOngoing(session)
          );
          if (currentMet) {
            setCurrentMeeting(currentMet);
          }
          setLoading(false);
        } else {
          const errs = response.data.result;
          if (errs && Object.keys(errs)?.length > 0) {
            SweetAlertWithValidation(errs);
            return;
          } else {
            const errMsg = response.data.message.split(".")[0];
            SweetAlert("error", errMsg);
          }
        }
      },
      onError: (error) => {
        console.log(error);
        SweetAlert(
          "error",
          error?.response?.data?.message ||
            error?.response?.data?.title ||
            error?.message
        );
      },
      refetchOnWindowFocus: false,
      retry: false,
      networkMode: "always",
      enabled: !!user,
    }
  );

  //Delete Appointment
  const { mutate: deleteAppointment, isLoading: isDeleting } =
    appointmentService.deleteAppointment(
      {
        id: deleteModal.id,
      },
      {
        onSuccess: async (response) => {
          if (response?.data?.success == true) {
            const deletedId = deleteModal.id;
            setDeleteModal({ modal: false, id: "" });
            SweetAlert("success", "Appointment deleted Successfully");
            const apts = [...sessions[activeTab]];
            const filteredApts = apts.filter((apt) => apt.id !== deletedId);
            setSessions({ ...sessions, [activeTab]: filteredApts });
          } else {
            const errs = response.data.result;
            if (errs && Object.keys(errs)?.length > 0) {
              SweetAlertWithValidation(errs);
              return;
            } else {
              const errMsg = response.data.message.split(".")[0];
              SweetAlert("error", errMsg);
            }
          }
        },
        onError: (error) => {
          console.log(error);
          SweetAlert(
            "error",
            error?.response?.data?.message ||
              error?.response?.data?.title ||
              error?.message
          );
        },
        networkMode: "always",
      }
    );

  //get instructors
  const { data: instructorsData, isLoading: isLoadingInstructors } =
    appointmentService.getOrganizationInstructors(
      {
        id: import.meta.env.VITE_API_ORGANIZATION_ID,
      },
      {
        onSuccess: async (response) => {
          if (response?.data?.success == true) {
            //  console.log(response)
            setInstructors(
              response?.data?.result?.organization?.only_active_providers
            );
          } else {
            const errs = response.data.result;
            if (errs && Object.keys(errs)?.length > 0) {
              SweetAlertWithValidation(errs);
              return;
            } else {
              const errMsg = response.data.message.split(".")[0];
              SweetAlert("error", errMsg);
            }
          }
        },
        onError: (error) => {
          console.log(error);
          SweetAlert(
            "error",
            error?.response?.data?.message ||
              error?.response?.data?.title ||
              error?.message
          );
        },
        refetchOnWindowFocus: false,
        retry: false,
        networkMode: "always",
        enabled: !!user,
      }
    );

  const filterDataOnSearch = () => {
    if (
      !appointmentData ||
      !appointmentData.data ||
      !appointmentData.data.result
    ) {
      return;
    }
    let data = [...appointmentData?.data?.result?.appointments];
    const searchValueLower = searchValue?.toLowerCase();
    const instructorLower = selectedInstructor?.toLowerCase();

    if (searchValueLower !== "") {
      data = data.filter((session) => {
        const sessionDate = new Date(session?.date);
        const sessionMonth = String(
          sessionDate.toLocaleString("default", {
            month: "short",
          })
        ).toLowerCase();
        const sessionDateStr = String(sessionDate.getDate());
        const sessionTime = String(
          formatDatetoTime(session.date).toLowerCase()
        );
        const sessionLocation = session?.location?.toLowerCase();
        const providerFullName = session?.provider?.full_name?.toLowerCase();

        const isInMonth = sessionMonth.includes(searchValueLower);
        const isInDate = sessionDateStr.includes(searchValueLower);
        const isInTime = sessionTime.includes(searchValueLower);
        const isInLocation = sessionLocation?.includes(searchValueLower);
        const isInProviderName = providerFullName?.includes(searchValueLower);

        if (instructorLower === "all") {
          return (
            isInMonth ||
            isInDate ||
            isInTime ||
            isInLocation ||
            isInProviderName
          );
        } else {
          return (
            (isInMonth ||
              isInDate ||
              isInTime ||
              isInLocation ||
              isInProviderName) &&
            providerFullName === instructorLower
          );
        }
      });
    } else if (instructorLower !== "all") {
      data = data.filter((session) => {
        const providerFullName = session?.provider?.full_name?.toLowerCase();
        return providerFullName === instructorLower;
      });
    }

    setSessions({
      upcoming: data.filter((session) => !hasTimePassed(session.date)),
      past: data.filter((session) => hasTimePassed(session.date)),
    });
    // console.log(searchValue, data);
  };


  const setShowedId = (id, type) => {
      showedLists.current[type] = id
  }

  useEffect(() => {
    filterDataOnSearch();
  }, [searchValue, selectedInstructor]);

  const handleSessionClick = (id) => {
    navigate("/sessions/" + id);
  };

  // Function to generate session cards
  const renderSessionCards = (sessions, type) => {
    console.log(sessions.date,)
    return <>
    {
      sessions.filter((session) => session.date.split(" ")[0] === formatDateToYYYYMMDD())?.map((session,i) => (
        <>
        {i===0 && !showedLists.current.today && (setShowedId(session.id, "today"))}
        {i===0 && session.id===showedLists.current.today && <h4 style={{paddingLeft:"20px", fontSize:"16px"}}>Today</h4>}
        <Card
          key={session.id}
          className="bg-white border  hoverEffect mx-2 roundedBorder"
          onClick={() => type === "upcoming" && handleSessionClick(session?.id)}
        >
          <CardBody className="m-0 p-0 mx-1">
            <Row className="justify-content-between align-items-center">
              <Col
                lg="2"
                md="2"
                sm="3"
                className="px-0 d-flex position-relative  overflow-hidden roundedBorder"
              >
                <div
                  className="w-50 h-110px"
                  style={{
                    backgroundColor: "#cccccc",
                    height: "95px",
                  }}
                ></div>
                <div className="w-50 h-110px" style={{ height: "95px" }}></div>
                <div
                  className="d-flex flex-column m-auto mx-1 my-1 position-absolute bg-white roundedBorder overflow-hidden"
                  style={{ width: "80%" }}
                >
                  <span className="bg-primary text-center text-white font-weight-bold">
                    {getMonthNameFromDate(new Date(session?.date)) +
                      " " +
                      new Date(session?.date).getDate()}
                  </span>
                  <span className="pt-1 text-center" style={{ color: "gray" }}>
                    <pre>
                      {addMinutesToTimeSlot(
                        formatDatetoTime(session?.date),
                        session?.length
                      )}
                    </pre>
                  </span>
                </div>
              </Col>
              {/* Second Column */}
              <Col lg="3" md="3" sm="4">
                <div className="d-flex flex-column">
                  <h4
                    className="text-primary fw-600 appointmentHeading m-0"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      navigate(
                        `/sessions/${upcomingSession[0]?.id}?return=homePage`
                      )
                    }
                  >
                    {session?.appointment_type?.name
                      ?.split(" - ")[0]
                      ?.replace(/\([^)]*\)/g, "")
                      .trim()}{" "}
                    Consultation
                  </h4>
                  <span style={{ color: "#a1a1a1", fontSize: "13px" }}>
                    {session?.is_group ? "Group Session" : "1-on-1 Session"}
                  </span>
                  <span style={{ color: "#a1a1a1", fontSize: "13px" }}>
                    {session?.location}
                  </span>
                </div>
              </Col>
              {/* Third Column */}
              <Col lg="3" md="3" sm="3">
                <div className="d-flex flex-row align-items-center gap-1">
                  <div>
                  <Avatar 
                    img={session?.provider?.avatar_url}
                    imgHeight="50"
                    imgWidth="50"
                  />
                  </div>
                  <h4
                    className="fw-500 m-0"
                    style={{ cursor: "pointer", fontSize:"16px" }}
                    onClick={() =>
                      navigate(
                        `/sessions/${upcomingSession[0]?.id}?return=homePage`
                      )
                    }
                  >
                    {session?.provider?.full_name}
                  </h4>
                </div>
              </Col>
              {/* {forth column} */}
              <Col lg="3" md="3" sm="0" className="sm-none">
                <div className="d-flex flex-row  gap-1">
                  <div>
                   <Clock className="text-primary m-0"  size={18}/>
                  </div>
                  <h4
                    className="fw-500"
                    style={{fontSize:"15px", margin:"3px 0 0 0"}}
                  >
                    {session?.length} Minutes
                  </h4>
                </div>
              </Col>
              {/* fifth Column: Icon to show menu */}
              <Col className="session-menu" md="1" sm="2" color="">
                {/* Add your icon for menu here */}
  
                <UncontrolledDropdown onClick={(e) => e.stopPropagation()}>
                  <DropdownToggle size="sm" className="icon-btn" color="">
                    <MoreVertical size={18} />
                  </DropdownToggle>
                  <DropdownMenu
                    className="bg-white"
                    container={"body"}
                    style={{ zIndex: 100 }}
                  >
                    <DropdownItem
                      tag="span"
                      className="d-flex gap-1"
                      onClick={() =>
                        setDeleteModal({ modal: true, id: session.id })
                      }
                    >
                      <Clock size={18} className="mr-2" /> Delete
                    </DropdownItem>
                    <DropdownItem tag="span" className="d-flex gap-1">
                      <Clock size={18} className="mr-2" /> Reschedule
                    </DropdownItem>
                    <DropdownItem tag="span" className="d-flex gap-1">
                      <X size={18} /> Cancel
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
  
                {/* You can add menu options like "Reschedule" and "Cancel" here */}
              </Col>
            </Row>
          </CardBody>
        </Card>
        </>
      ))
    }
    {
      sessions.filter((session) => isDateInCurrentWeek(new Date(session.date)) && session.date.split(" ")[0] !== formatDateToYYYYMMDD())?.map((session,i) => (
        <>
        {i===0 && !showedLists.current.weekly && (setShowedId(session.id, "weekly"))}
        {i===0 && session.id===showedLists.current.weekly && <h4 style={{paddingLeft:"20px", fontSize:"16px"}}>This Week {getCurrentWeekDateRange()}</h4>}
        <Card
          key={session.id}
          className="bg-white border  hoverEffect mx-2 roundedBorder"
          onClick={() => type === "upcoming" && handleSessionClick(session?.id)}
        >
          <CardBody className="m-0 p-0 mx-1">
            <Row className="justify-content-between align-items-center">
              <Col
                lg="2"
                md="2"
                sm="3"
                className="px-0 d-flex position-relative  overflow-hidden roundedBorder"
              >
                <div
                  className="w-50 h-110px"
                  style={{
                    backgroundColor: "#cccccc",
                    height: "95px",
                  }}
                ></div>
                <div className="w-50 h-110px" style={{ height: "95px" }}></div>
                <div
                  className="d-flex flex-column m-auto mx-1 my-1 position-absolute bg-white roundedBorder overflow-hidden"
                  style={{ width: "80%" }}
                >
                  <span className="bg-primary text-center text-white font-weight-bold">
                    {getMonthNameFromDate(new Date(session?.date)) +
                      " " +
                      new Date(session?.date).getDate()}
                  </span>
                  <span className="pt-1 text-center" style={{ color: "gray" }}>
                    <pre>
                      {addMinutesToTimeSlot(
                        formatDatetoTime(session?.date),
                        session?.length
                      )}
                    </pre>
                  </span>
                </div>
              </Col>
              {/* Second Column */}
              <Col lg="3" md="3" sm="4">
                <div className="d-flex flex-column">
                  <h4
                    className="text-primary fw-600 appointmentHeading m-0"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      navigate(
                        `/sessions/${upcomingSession[0]?.id}?return=homePage`
                      )
                    }
                  >
                    {session?.appointment_type?.name
                      ?.split(" - ")[0]
                      ?.replace(/\([^)]*\)/g, "")
                      .trim()}{" "}
                    Consultation
                  </h4>
                  <span style={{ color: "#a1a1a1", fontSize: "13px" }}>
                    {session?.is_group ? "Group Session" : "1-on-1 Session"}
                  </span>
                  <span style={{ color: "#a1a1a1", fontSize: "13px" }}>
                    {session?.location}
                  </span>
                </div>
              </Col>
              {/* Third Column */}
              <Col lg="3" md="3" sm="3">
                <div className="d-flex flex-row align-items-center gap-1">
                  <div>
                  <Avatar 
                    img={session?.provider?.avatar_url}
                    imgHeight="50"
                    imgWidth="50"
                  />
                  </div>
                  <h4
                    className="fw-500 m-0"
                    style={{ cursor: "pointer", fontSize:"16px" }}
                    onClick={() =>
                      navigate(
                        `/sessions/${upcomingSession[0]?.id}?return=homePage`
                      )
                    }
                  >
                    {session?.provider?.full_name}
                  </h4>
                </div>
              </Col>
              {/* {forth column} */}
              <Col lg="3" md="3" sm="0" className="sm-none">
                <div className="d-flex flex-row  gap-1">
                  <div>
                   <Clock className="text-primary m-0"  size={18}/>
                  </div>
                  <h4
                    className="fw-500"
                    style={{fontSize:"15px", margin:"3px 0 0 0"}}
                  >
                    {session?.length} Minutes
                  </h4>
                </div>
              </Col>
              {/* fifth Column: Icon to show menu */}
              <Col className="session-menu" md="1" sm="2" color="">
                {/* Add your icon for menu here */}
  
                <UncontrolledDropdown onClick={(e) => e.stopPropagation()}>
                  <DropdownToggle size="sm" className="icon-btn" color="">
                    <MoreVertical size={18} />
                  </DropdownToggle>
                  <DropdownMenu
                    className="bg-white"
                    container={"body"}
                    style={{ zIndex: 100 }}
                  >
                    <DropdownItem
                      tag="span"
                      className="d-flex gap-1"
                      onClick={() =>
                        setDeleteModal({ modal: true, id: session.id })
                      }
                    >
                      <Clock size={18} className="mr-2" /> Delete
                    </DropdownItem>
                    <DropdownItem tag="span" className="d-flex gap-1">
                      <Clock size={18} className="mr-2" /> Reschedule
                    </DropdownItem>
                    <DropdownItem tag="span" className="d-flex gap-1">
                      <X size={18} /> Cancel
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
  
                {/* You can add menu options like "Reschedule" and "Cancel" here */}
              </Col>
            </Row>
          </CardBody>
        </Card>
        </>
      ))
    }
    {
      sessions.filter((session) => !isDateInCurrentWeek(new Date(session.date)))?.map((session,i) => (
        <>
        {i===0 && !showedLists.current.upcoming &&(setShowedId(session.id, "upcoming"))}
        {i===0 && session.id===showedLists.current.upcoming && <h4 style={{paddingLeft:"20px", fontSize:"16px"}}>Upcoming</h4>}
        <Card
          key={session.id}
          className="bg-white border  hoverEffect mx-2 roundedBorder"
          onClick={() => type === "upcoming" && handleSessionClick(session?.id)}
        >
          <CardBody className="m-0 p-0 mx-1">
            <Row className="justify-content-between align-items-center">
              <Col
                lg="2"
                md="2"
                sm="3"
                className="px-0 d-flex position-relative  overflow-hidden roundedBorder"
              >
                <div
                  className="w-50 h-110px"
                  style={{
                    backgroundColor: "#cccccc",
                    height: "95px",
                  }}
                ></div>
                <div className="w-50 h-110px" style={{ height: "95px" }}></div>
                <div
                  className="d-flex flex-column m-auto mx-1 my-1 position-absolute bg-white roundedBorder overflow-hidden"
                  style={{ width: "80%" }}
                >
                  <span className="bg-primary text-center text-white font-weight-bold">
                    {getMonthNameFromDate(new Date(session?.date)) +
                      " " +
                      new Date(session?.date).getDate()}
                  </span>
                  <span className="pt-1 text-center" style={{ color: "gray" }}>
                    <pre>
                      {addMinutesToTimeSlot(
                        formatDatetoTime(session?.date),
                        session?.length
                      )}
                    </pre>
                  </span>
                </div>
              </Col>
              {/* Second Column */}
              <Col lg="3" md="3" sm="4">
                <div className="d-flex flex-column">
                  <h4
                    className="text-primary fw-600 appointmentHeading m-0"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      navigate(
                        `/sessions/${upcomingSession[0]?.id}?return=homePage`
                      )
                    }
                  >
                    {session?.appointment_type?.name
                      ?.split(" - ")[0]
                      ?.replace(/\([^)]*\)/g, "")
                      .trim()}{" "}
                    Consultation
                  </h4>
                  <span style={{ color: "#a1a1a1", fontSize: "13px" }}>
                    {session?.is_group ? "Group Session" : "1-on-1 Session"}
                  </span>
                  <span style={{ color: "#a1a1a1", fontSize: "13px" }}>
                    {session?.location}
                  </span>
                </div>
              </Col>
              {/* Third Column */}
              <Col lg="3" md="3" sm="3">
                <div className="d-flex flex-row align-items-center gap-1">
                  <div>
                  <Avatar 
                    img={session?.provider?.avatar_url}
                    imgHeight="50"
                    imgWidth="50"
                  />
                  </div>
                  <h4
                    className="fw-500 m-0"
                    style={{ cursor: "pointer", fontSize:"16px" }}
                    onClick={() =>
                      navigate(
                        `/sessions/${upcomingSession[0]?.id}?return=homePage`
                      )
                    }
                  >
                    {session?.provider?.full_name}
                  </h4>
                </div>
              </Col>
              {/* {forth column} */}
              <Col lg="3" md="3" sm="0"  className="sm-none">
                <div className="d-flex flex-row  gap-1">
                  <div>
                   <Clock className="text-primary m-0"  size={18}/>
                  </div>
                  <h4
                    className="fw-500"
                    style={{fontSize:"15px", margin:"3px 0 0 0"}}
                  >
                    {session?.length} Minutes
                  </h4>
                </div>
              </Col>
              {/* fifth Column: Icon to show menu */}
              <Col className="session-menu" md="1" sm="2" color="">
                {/* Add your icon for menu here */}
  
                <UncontrolledDropdown onClick={(e) => e.stopPropagation()}>
                  <DropdownToggle size="sm" className="icon-btn" color="">
                    <MoreVertical size={18} />
                  </DropdownToggle>
                  <DropdownMenu
                    className="bg-white"
                    container={"body"}
                    style={{ zIndex: 100 }}
                  >
                    <DropdownItem
                      tag="span"
                      className="d-flex gap-1"
                      onClick={() =>
                        setDeleteModal({ modal: true, id: session.id })
                      }
                    >
                      <Clock size={18} className="mr-2" /> Delete
                    </DropdownItem>
                    <DropdownItem tag="span" className="d-flex gap-1">
                      <Clock size={18} className="mr-2" /> Reschedule
                    </DropdownItem>
                    <DropdownItem tag="span" className="d-flex gap-1">
                      <X size={18} /> Cancel
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
  
                {/* You can add menu options like "Reschedule" and "Cancel" here */}
              </Col>
            </Row>
          </CardBody>
        </Card>
        </>
      ))
    }
    </>
    
  };

  return (
    <Fragment>
      <Helmet>
        <title>Sessions | {siteInfo.siteLongName}</title>
      </Helmet>
      <Row>
        <Col md="12" >
          <Card color="white" style={{ minHeight: "550px" }}>
            <CardHeader>
              <CardTitle>
                <span className="page-title">
                  <Calendar size={28} />
                  <h3 className="text">My Sessions</h3>
                </span>
              </CardTitle>
              <div style={{ display: "flex", alignItems: "center" }}>
                <motion.div
                  whileTap={{
                    scale: 0.9,
                    backgroundColor: "#e1e1e166",
                    borderRadius: "50px",
                  }}
                  style={{ marginRight: "30px", cursor: "pointer" }}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <AlignCenter />
                </motion.div>
                <Button
                  size="sm"
                  color="primary"
                  className="d-flex align-items-center gap-25"
                  onClick={() => navigate("/book-session")}
                >
                  <Calendar size={20} /> Book New Session
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              {showFilters && (
                <motion.div
                  className="SessionFilters"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="goalSelect">
                    <span style={{ marginRight: "20px" }}>Instructor</span>
                    <select
                      id="progressSelect"
                      value={selectedInstructor}
                      onChange={handleChange}
                    >
                      <option value="All" className="optionIns">
                        All
                      </option>
                      {instructors.map((instructor) => {
                        return (
                          <option
                            key={instructor.full_name}
                            value={instructor.full_name}
                            className="optionIns"
                          >
                            {instructor.full_name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="search-bar">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchValue}
                      onChange={handleInputChange}
                    />
                  </div>
                </motion.div>
              )}

              <div className="sessionsTabsDiv">
                <Nav tabs>
                  <NavItem>
                    <NavLink
                      className={activeTab === "upcoming" ? "active" : ""}
                      onClick={() => setActiveTab("upcoming")}
                    >
                      <Bell size={18} />
                      Upcoming
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={activeTab === "past" ? "active" : ""}
                      onClick={() => setActiveTab("past")}
                    >
                      <Clock size={18} />
                      Past
                    </NavLink>
                  </NavItem>
                </Nav>
                {currentMeeting && (
                  <div className="session">
                    <Card
                      key={currentMeeting.id}
                      className="bg-white border rounded hoverEffect activeCurrentSession"
                      onClick={() => handleSessionClick(currentMeeting?.id)}
                    >
                      <CardBody className="m-0 p-0">
                        <Row className="justify-content-between align-items-center">
                          <Col
                            className="d-flex justify-content-center border-right align-items-center height-100"
                            md="4"
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                              }}
                            >
                              <h3 className="fw-600">
                                {new Date(currentMeeting.date).toLocaleString(
                                  "default",
                                  {
                                    month: "short",
                                  }
                                )}{" "}
                                {new Date(currentMeeting.date).getDate()}
                              </h3>
                              <span>
                                {formatDatetoTime(currentMeeting.date)}
                              </span>
                            </div>
                          </Col>
                          {/* Second Column: Display Session Mode and Title */}
                          <Col className="session-info d-flex flex-column gap-25">
                            <div className="d-flex align-items-base gap-50 text-default center">
                              <Video size={16} />{" "}
                              {currentMeeting.is_group ? "Group" : "In Person"}
                            </div>
                            <span className="pdb">
                              <h4 className="fw-600 m-0">
                                {currentMeeting?.provider?.full_name}
                              </h4>
                              <small className="text-default">
                                {currentMeeting.location}
                              </small>
                              <br />
                              <small className="text-default">
                                {currentMeeting.length + " "}min
                              </small>
                            </span>
                          </Col>
                          {/* Third Column: Icon to show menu */}
                          <Col className="session-menu" md="1" color="">
                            {/* Add your icon for menu here */}

                            {/* <UncontrolledDropdown
                            onClick={(e) => e.stopPropagation()}
                          >
                            <DropdownToggle
                              size="sm"
                              className="icon-btn"
                              color=""
                            >
                              <MoreVertical size={18} />
                            </DropdownToggle>
                            <DropdownMenu
                              className="bg-white"
                              container={"body"}
                              style={{ zIndex: 100 }}
                            >
                              <DropdownItem
                                tag="span"
                                className="d-flex gap-1"
                                onClick={() =>
                                  setDeleteModal({
                                    modal: true,
                                    id: session.id,
                                  })
                                }
                              >
                                <Clock size={18} className="mr-2" /> Delete
                              </DropdownItem>
                              <DropdownItem tag="span" className="d-flex gap-1">
                                <Clock size={18} className="mr-2" /> Reschedule
                              </DropdownItem>
                              <DropdownItem tag="span" className="d-flex gap-1">
                                <X size={18} /> Cancel
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown> */}

                            {/* You can add menu options like "Reschedule" and "Cancel" here */}
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </div>
                )}
              </div>

              <TabContent activeTab={activeTab} className="pt-1">
                <TabPane tabId="upcoming">
                  <Row>
                    <Col md="12" className="scrollable-container scrollX-none">
                      {isLoadingAppointments || loading ? (
                        [0, 1, 2].map((goal, idx) => (
                          <Col lg="12" key={idx} style={{ opacity: "0.2" }}>
                            <Card>
                              <SkeletonComponent />
                            </Card>
                          </Col>
                        ))
                      ) : currentSessions.length > 0 ? (
                        renderSessionCards(currentSessions, "upcoming")
                      ) : (
                        <div
                          style={{
                            height: "50vh",
                            textAlign: "center",
                            paddingTop: "5%",
                          }}
                        >
                          <img
                            src={no_result}
                            style={{
                              height: "150px",
                              width: "150px",
                              opacity: "0.5",
                            }}
                          ></img>
                          <span style={{ color: "gray" }}>
                            No Upcoming sessions at the moment
                          </span>
                        </div>
                      )}
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="past">
                  <Row>
                    <Col
                      md="12"
                      className="scrollable-container scrollX-none"
                      onScroll={handleListScroll}
                    >
                      {isLoadingAppointments || loading ? (
                        [0, 1, 2].map((goal, idx) => (
                          <Col lg="12" key={idx} style={{ opacity: "0.2" }}>
                            <Card>
                              <SkeletonComponent />
                            </Card>
                          </Col>
                        ))
                      ) : currentSessions.length > 0 ? (
                        renderSessionCards(currentSessions, "past")
                      ) : (
                        <div
                          style={{
                            height: "50vh",
                            textAlign: "center",
                            paddingTop: "5%",
                          }}
                        >
                          <img
                            src={no_result}
                            style={{
                              height: "150px",
                              width: "150px",
                              opacity: "0.5",
                            }}
                          ></img>
                          <div style={{ color: "gray" }}>
                            No past sessions data found
                          </div>
                        </div>
                      )}
                    </Col>
                  </Row>
                </TabPane>
              </TabContent>
              {deleteModal.modal && (
                <Modal isOpen centered>
                  <ModalHeader
                    toggle={() => {
                      setDeleteModal({ modal: false, id: "" });
                    }}
                  ></ModalHeader>
                  <ModalBody>
                    <h3 className="text-center mb-2 text-success">
                      Delete Session
                    </h3>
                    <Row className="flex-column gap-1">
                      <Col
                        xs={12}
                        className="align-items-center d-flex flex-column gap-1"
                      >
                        <span className="text-center">
                          <h3 className="m-0">
                            Are you sure you want to delete this session
                          </h3>
                        </span>
                      </Col>
                      <Col xs={12} className="text-center pb-1">
                        <div
                          style={{
                            display: "flex",
                            width: "100%",
                            justifyContent: "center",
                            gap: "50px",
                            margin: "40px 0",
                          }}
                        >
                          <CustomButton
                            className="deleteButton"
                            color="red"
                            onClick={() => deleteAppointment()}
                            loading={isDeleting}
                          >
                            Confirm
                          </CustomButton>
                          <Button
                            color="primary"
                            onClick={() =>
                              setDeleteModal({ modal: false, id: "" })
                            }
                          >
                            Cancel
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </ModalBody>
                </Modal>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
      {!(isLoadingAppointments || loading) &&
        sessions[activeTab].length > sessionsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPageCount={totalPageCount}
            paginate={paginate}
          />
        )}
    </Fragment>
  );
}

export default SessionsPage;
