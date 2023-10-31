import React, { Fragment, useState } from "react";
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
  Label,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import { ArrowLeft, ArrowRight } from "react-feather";
import { Helmet } from "react-helmet";
import { siteInfo } from "@src/constants";
import CustomSelect from "../../../../../../components/CustomSelect";
import CustomButton from "@src/components/CustomButton";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Avatar from "@components/avatar";
import { Bookmark } from "react-feather";
import { getUserData } from "@utils";
import { appointmentService } from "../../../../../../services/appointmentService";
import { useEffect } from "react";
import {
  SweetAlert,
  SweetAlertWithValidation,
} from "../../../../../../components/SweetAlert";
import avatar_blank from "../../../../../../assets/images/avatars/avatar-blank.png";
import salus_logo from "../../../../../../assets/images/logo/logo.svg";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import no_result from "../../../../../../assets/images/svg/no-result.svg";
import {
  formatDateToYYYYMMDD,
  formatDatetoTime,
  addMinutesToTimeSlot,
} from "../../../../../../utility/Utils";
import getImageUrl from "../../../../../../utility/getCategoryImage"

function ListItemCard({
  imgSrc,
  name,
  description,
  onClick,
  itemId,
  selected: selectedItem,
  setSelected: setSelectedItem,
  availabilityText,
  className,
  credits,
}) {
  const clickHandler = () => {
    setSelectedItem?.((prevId) => (prevId == itemId ? -1 : itemId));
    onClick?.();
  };

  return (
    <Card
      style={{ overflow: "hidden" }}
      className={`${className} customCard rounded border ${
        itemId > -1 && itemId == selectedItem
          ? "bg-primary text-white--important"
          : "bg-white"
      }  hoverEffect`}
      onClick={clickHandler}
    >
      <div className="d-flex align-items-center gap-1">
        {imgSrc && (
          <img
            src={imgSrc}
            style={{
              minHeight: 100,
              minWidth: 100,
              maxHeight: 100,
              maxWidth: 100,
              marginLeft: "10px",
            }}
          />
        )}
        <div className="d-flex flex-column" style={{ paddingLeft: "20px" }}>
          <h4 className="fw-600">{name}</h4>
          <small className="text-default">{description}</small>
          {credits && (
            <small className="text-default">
              {credits || "0"} credits available
            </small>
          )}
          {availabilityText && (
            <small className="available-tag text-default">
              {availabilityText}
            </small>
          )}
        </div>
      </div>
    </Card>
  );
}

function ListItemSlot({
  onClick,
  itemId,
  selected: selectedItem,
  setSelected: setSelectedItem,
  availabilityText,
  className,
  date,
  is_fully_booked,
}) {
  const clickHandler = () => {
    setSelectedItem?.((prevId) => (prevId == itemId ? -1 : itemId));
    onClick?.();
  };

  return (
    <div
      className={`${className} slotCard border ${
        itemId > -1 && itemId == selectedItem
          ? "bg-primary text-white--important"
          : "bg-white"
      }`}
      onClick={clickHandler}
    >
      <div className="d-flex align-items-center gap-1">
        <div className="d-flex flex-column">
          <h4 className="fw-600" style={{ marginBottom: "0" }}>
            {formatDatetoTime(date)}
          </h4>
          <small className="text-default">
            {is_fully_booked ? "Fully Booked" : "Available"}
          </small>
          {availabilityText && (
            <small className="available-tag text-default">
              {availabilityText}
            </small>
          )}
        </div>
      </div>
    </div>
  );
}

function ListSessions({
  imgSrc,
  onClick,
  itemId,
  selected: selectedItem,
  setSelected: setSelectedItem,
  availabilityText,
  className,
  date,
  is_fully_booked,
  credits,
  selectedCatName,
  selectedCat,
  selectedCatType,
  selectedInstructor,
}) {
  const clickHandler = () => {
    setSelectedItem?.((prevId) => (prevId == itemId ? -1 : itemId));
    onClick?.();
  };
  return (
    <Card
      style={{ width: "97%", margin: "12px 10px", position: "relative" }}
      className={`${className} customCard rounded border ${
        itemId > -1 && itemId == selectedItem
          ? "bg-primary text-white--important"
          : "bg-white"
      }  hoverEffect`}
      onClick={clickHandler}
    >
      <div className="d-flex align-items-center gap-1">
        {imgSrc && (
          <img
            src={imgSrc}
            style={{
              height: 80,
              width: 80,
              margin: "10px",
              borderRadius: "10px",
            }}
          />
        )}
        <div className="d-flex flex-column" style={{ paddingLeft: "20px" }}>
          <h4 className="fw-600 m-0">{selectedCatName + " " + selectedCatType}</h4>
          <span>{selectedInstructor.full_name}</span>
          <small className="text-default">
            {addMinutesToTimeSlot(formatDatetoTime(date), selectedCat.length)}
          </small>
          <small
            className="text-default"
            style={{
              position: "absolute",
              right: "20px",
              bottom: "20px",
              color: "gray",
            }}
          >
            {selectedCat?.credits} credits available
          </small>
          {availabilityText && (
            <small className="available-tag text-default">
              {availabilityText}
            </small>
          )}
        </div>
      </div>
    </Card>
  );
}

function JoinSessionPage() {
  const user = useSelector((store) => store.auth.user);
  const [selectedSession, setSelectedSession] = useState(-1);
  const [step, setStep] = useState(0);
  const [sessionConfirmationModal, setSessionConfirmationModal] =
    useState(false);
  const [confirmationModal, setConfirmationModal] = useState(0);
  const [categories, setCategories] = useState({});
  const [selectedType, setSelectedType] = useState();
  const [selectedCatName, setSelectedCatName] = useState({});
  const [selectedCatType, setSelectedCatType] = useState("");
  const [selectedCat, setSelectedCat] = useState({});
  const catTypeOptions =
    selectedType &&
    selectedCatName &&
    categories.types &&
    categories.types[selectedType] &&
    categories.types[selectedType][selectedCatName]
      ? categories.types[selectedType][selectedCatName]
      : [];
  const [instructors, setInstructors] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [days, setDays] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [maxStep, setMaxStep] = useState(0);
  const [prevStep, setPrevStep] = useState(-1);
  const [loadingSlot, setLoadingSlot] = useState(false);
  const [aptRes, setAptres] = useState({});
  const navigate = useNavigate();
  const [progress, setProgress] = useState(100);

  //progress bar
  useEffect(() => {
    const animationDuration = 7000; // Animation duration in milliseconds
    const interval = 10; // Interval in milliseconds
    const steps = animationDuration / interval;
    const stepSize = 100 / steps;
    const updateProgress = () => {
      setProgress((prevProgress) => {
        if (prevProgress <= 0) {
          clearInterval(progressInterval);
          navigate("/sessions");
          return 0;
        }
        return prevProgress - stepSize;
      });
    };
    let progressInterval;
    if (confirmationModal) {
      progressInterval = setInterval(updateProgress, interval);
    }

    return () => {
      clearInterval(progressInterval);
    };
  }, [confirmationModal]);

  // Function to get credits for a specific appointment type
  const getCreditsForAppointmentType = (user, appointmentTypeId) => {
    const credits = user.appointment_type_credits || [];
    const credit = credits.find(
      (credit) => credit.appointment_type_id === appointmentTypeId
    );
    return credit ? parseInt(credit.quantity, 10) : 0;
  };

  // Function to get data arranged for categories
  const processAppointmentTypes = (data) => {
    const uniqueGrouped = [];
    const uniqueUngrouped = [];
    const notUniqueGrouped = [];
    const notUniqueUngrouped = [];
    const groupedTypes = {};
    const ungroupedTypes = {};

    data.forEach((appointmentType) => {
      const [namePart, typePart] = appointmentType.name.split(" - ");
      const type = typePart ? typePart.replace(/\([^)]*\)/g, "").trim() : "";
      const name = namePart ? namePart.replace(/\([^)]*\)/g, "").trim() : "";

      const typeObject = {
        label: type !== "" ? type : "Default",
        value: appointmentType.id,
        category: appointmentType,
      };

      if (appointmentType.is_group) {
        const credits = getCreditsForAppointmentType(user, appointmentType.id);
        notUniqueGrouped.push({
          ...appointmentType,
          name,
          type,
          id: appointmentType.id,
          credits,
        });

        if (!groupedTypes[name]) {
          groupedTypes[name] = [];
        }
        typeObject.category = { ...typeObject.category, credits, type };
        groupedTypes[name].push(typeObject);

        const existingUniqueGroupedIndex = uniqueGrouped.findIndex(
          (t) => t.name === name
        );
        if (existingUniqueGroupedIndex !== -1) {
          // Update credits for the existing unique item
          uniqueGrouped[existingUniqueGroupedIndex].credits += credits;
        } else {
          uniqueGrouped.push({
            ...appointmentType,
            name,
            type,
            id: appointmentType.id,
            credits,
          });
        }
      } else {
        const credits = getCreditsForAppointmentType(user, appointmentType.id);
        notUniqueUngrouped.push({
          ...appointmentType,
          name,
          type,
          id: appointmentType.id,
          credits,
        });

        if (!ungroupedTypes[name]) {
          ungroupedTypes[name] = [];
        }
        typeObject.category = { ...typeObject.category, credits, type };
        ungroupedTypes[name].push(typeObject);

        const existingUniqueUngroupedIndex = uniqueUngrouped.findIndex(
          (t) => t.name === name
        );
        if (existingUniqueUngroupedIndex !== -1) {
          // Update credits for the existing unique item
          uniqueUngrouped[existingUniqueUngroupedIndex].credits += credits;
        } else {
          uniqueUngrouped.push({
            ...appointmentType,
            name,
            type,
            id: appointmentType.id,
            credits,
          });
        }
      }
    });

    const types = {
      grouped: groupedTypes,
      ungrouped: ungroupedTypes,
    };

    return {
      unique: {
        grouped: uniqueGrouped,
        ungrouped: uniqueUngrouped,
      },
      notUnique: {
        grouped: notUniqueGrouped,
        ungrouped: notUniqueUngrouped,
      },
      types,
    };
  };

  //Types
  const types = [
    {
      name: "1-on-1 Session",
      description: "Schedule one on one session",
      type: "ungrouped",
    },
    {
      name: "Group Session",
      description: "Schedule group session",
      type: "grouped",
    },
  ];

  // Function to check if a date should be disabled
  const tileDisabled = ({ date, view }) => {
    if (view === "month") {
      return !days?.some(
        (enabledDay) => formatDateToYYYYMMDD(date) === enabledDay
      );
    }
    return false;
  };

  // Function to handle month or year change when clicking the navigation arrows
  const handleViewChange = (action, activeStartDate, value, view) => {
    getDays();
  };

  //when a date is clicked on calender
  const handleDayClick = (e) => {
    setSelectedDay(formatDateToYYYYMMDD(e));
  };

  const handleCategoryClick = (cat) => {
    if (cat.credits && cat.credits > 0) {
      setStep(2);
      setSelectedCatName(cat.name);
      setSelectedInstructor(null);
      setSelectedCat(null);
      setSelectedDay(null);
    } else {
      SweetAlert(
        "error",
        "You need credits to create an appointment in " + cat.name
      );
    }
  };

  //get categoties
  const { data: categoriesData, isLoading: isLoadingCategories } =
    appointmentService.getAppointmentTypes(
      {
        clients_can_book: true,
        org_level: false,
        provider_id: user?.providers[0]?.id,
      },
      {
        onSuccess: async (response) => {
          if (response?.data?.success == true) {
            const data = processAppointmentTypes(
              response.data.result.appointmentTypes
            );
            console.log(data);
            setCategories(data);
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

  //get instructors
  const { data: instructorsData, isLoading: isLoadingInstructors } =
    appointmentService.getOrganizationInstructors(
      {
        id: import.meta.env.VITE_API_ORGANIZATION_ID,
      },
      {
        onSuccess: async (response) => {
          if (response?.data?.success == true) {
            // console.log(response)
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

  //get Days
  const { mutate: getDays, isLoading: isLoadingDays } =
    appointmentService.getDaysAvailable(
      {
        // appt_type_id: "331837",
        // clients_can_join_waitlist: true,
        // contact_type: "Healthie Video Call",
        // date_from_month: formatDateToYYYYMMDD(),
        // licensed_in_state: "",
        // org_level: false,
        // provider_id: "1793018",
        // provider_ids: null,
        // timezone: "Asia/Karachi",

        appt_type_id: selectedCat?.id,
        clients_can_join_waitlist: true,
        contact_type: "Healthie Video Call",
        date_from_month: formatDateToYYYYMMDD(),
        licensed_in_state: "",
        org_level: false,
        provider_id: selectedInstructor?.id,
        provider_ids: null,
        timezone: user.timezone,
      },
      {
        onSuccess: async (response) => {
          if (response?.data?.success == true) {
            // console.log(response);
            setDays(response?.data?.result?.daysAvailableForRange);
            if (response?.data?.result?.daysAvailableForRange?.length === 0) {
              SweetAlert(
                "error",
                "No session dates available for the selected instructor for this category at the moment "
              );
            }
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

  //get Slot
  const { mutate: getDaySlots, isLoading: isLoadingSlots } =
    appointmentService.getDaysAvailableSlot(
      {
        // appointment_type_id: "331837",
        // appt_type_id: "331837",
        // clients_can_join_waitlist: true,
        // contact_type: "Healthie Video Call",
        // end_date: selectedDay,
        // licensed_in_state: "",
        // org_level: false,
        // provider_id: "1793018",
        // provider_ids: null,
        // selected_day: {},
        // start_date: selectedDay,
        // timezone: "Asia/Karachi",

        appointment_type_id: selectedCat?.id,
        appt_type_id: selectedCat?.id,
        clients_can_join_waitlist: true,
        contact_type: "Healthie Video Call",
        end_date: selectedDay,
        licensed_in_state: "",
        org_level: false,
        provider_id: selectedInstructor?.id,
        provider_ids: null,
        selected_day: {},
        start_date: selectedDay,
        timezone: user?.timezone,
      },
      {
        onSuccess: async (response) => {
          // console.log(response);
          if (response?.data?.success == true) {
            setSessions(response?.data?.result?.availableSlotsForRange);
            setLoadingSlot(false);
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

  //create Appointment
  const { mutate: createAppointment, isLoading: isCreatingAppointment } =
    appointmentService.createAppointment(
      {
        // date: selectedSlot?.date,
        // appt_type_id: "331837",
        // appointment_type_id: "331837",
        // provider_id: "1793018",
        // first_name: user?.first_name,
        // last_name: user?.last_name,
        // email: user?.email,
        // timezone: user?.timezone,
        // is_joining_waitlist: false,
        // phone_number: user?.phone_number,

        date: selectedSlot?.date,
        appt_type_id: selectedCat?.id,
        appointment_type_id: selectedCat?.id,
        provider_id: selectedInstructor?.id,
        first_name: user?.first_name,
        last_name: user?.last_name,
        email: user?.email,
        timezone: user?.timezone,
        is_joining_waitlist: false,
        phone_number: user?.phone_number,
      },
      {
        onSuccess: async (response) => {
          // console.log(response);
          setAptres(response?.data?.result?.completeCheckout?.appointment);
          setSessionConfirmationModal(false)
          setConfirmationModal(true);
          if (response?.data?.success == true) {
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

  //get days once instructor and type gets selectyed
  useEffect(() => {
    if (selectedInstructor?.id && selectedCat?.id) {
      setSelectedDay(null)
      setSessions([])
      getDays();
    }
  }, [selectedInstructor, selectedCat]);

  //getting slots once a day is selected
  useEffect(() => {
    if (selectedDay) {
      getDaySlots();
    }
  }, [selectedDay]);

  useEffect(() => {
    if (categories.unique) {
      setLoading(false);
    }
  }, [categories]);

  //handle  max step
  useEffect(() => {
    if (maxStep < step) {
      setMaxStep(step);
    }
  }, [step]);

  return (
    <Fragment>
      <Helmet>
        <title>Schedule new Session | {siteInfo.siteLongName}</title>
      </Helmet>
      <Row>
        <Col md="12">
          <Card color="white">
            <CardHeader>
              <CardTitle>
                <span className="page-title">
                  {/* <Bookmark size={28} /> */}
                  <h3 className="text">Schedule New Session</h3>
                </span>
              </CardTitle>
              <motion.span
                whileTap={
                  step !== 0 ? { scale: 0.9, backgroundColor: "#dedede" } : {}
                }
                onClick={() => {
                  if (step !== 0) {
                    setPrevStep(step);
                    setStep((step) => (step === 0 ? step : step - 1));
                  }
                }}
                style={{
                  padding: "5px",
                  marginTop: "-30px",
                  cursor: step === 0 ? "" : "pointer",
                  color: "gray",
                  marginLeft: "auto",
                  marginRight: "10px",
                  opacity: step === 0 ? 0.3 : 1,
                  borderRadius: "50%",
                }}
              >
                <ArrowLeft />
              </motion.span>
              <motion.span
                whileTap={
                  maxStep > step
                    ? { scale: 0.9, backgroundColor: "#dedede" }
                    : {}
                }
                onClick={() => {
                  if (maxStep > step) {
                    setPrevStep(step);
                    setStep((step) => (step === 2 ? step : step + 1));
                  }
                }}
                style={{
                  padding: "5px",
                  marginTop: "-30px",
                  cursor: maxStep > step ? "pointer" : "",
                  color: "gray",
                  opacity: maxStep > step ? 1 : 0.3,
                  borderRadius: "50%",
                }}
              >
                <ArrowRight />
              </motion.span>
            </CardHeader>

            <AnimatePresence>
              <CardBody>
                <Row className="w-100 justify-content-center">
                  <Col {...{ lg: 9, md: 6, sm: 12 }} xs="12">
                    {step == 0 ? (
                      <Card color="white">
                        <CardHeader className="d-flex justify-content-center">
                          <CardTitle>Select Session Type</CardTitle>
                        </CardHeader>
                        <CardBody>
                          <motion.div
                            key="step-1"
                            initial={
                              prevStep < step
                                ? { x: 200, opacity: 0 }
                                : { x: -200, opacity: 0 }
                            }
                            animate={{ x: 0, opacity: 1 }}
                            exit={
                              prevStep < step
                                ? { x: -200, opacity: 0 }
                                : { x: 200, opacity: 0 }
                            }
                            transition={{ duration: 0.3 }}
                          >
                            {types.map((type) => (
                              <ListItemCard
                                key={type.type}
                                {...type}
                                onClick={() => {
                                  setStep(1);
                                  setSelectedType(type.type);
                                  setSelectedCatName("");
                                }}
                                className={`p-2 ${
                                  selectedType === type.type ? "activeCard" : ""
                                }`}
                              />
                            ))}
                          </motion.div>
                        </CardBody>
                      </Card>
                    ) : step == 1 ? (
                      <Card color="white">
                        <CardHeader className="d-flex justify-content-center">
                          <CardTitle>Select Session Category</CardTitle>
                        </CardHeader>
                        <CardBody>
                          <motion.div
                            key="step-2"
                            initial={
                              prevStep < step
                                ? { x: 200, opacity: 0 }
                                : { x: -200, opacity: 0 }
                            }
                            animate={{ x: 0, opacity: 1 }}
                            exit={
                              prevStep < step
                                ? { x: -200, opacity: 0 }
                                : { x: 200, opacity: 0 }
                            }
                            transition={{ duration: 0.3 }}
                          >
                            {isLoadingCategories || loading ? (
                              <div
                                className="fallback-spinner app-loader"
                                style={{ height: "35vh" }}
                              >
                                <div
                                  className="loading"
                                  style={{ width: "30px", height: "30px" }}
                                >
                                  <div
                                    className="effect-1 effects"
                                    style={{ width: "30px", height: "30px" }}
                                  ></div>
                                  <div
                                    className="effect-2 effects"
                                    style={{ width: "30px", height: "30px" }}
                                  ></div>
                                  <div
                                    className="effect-3 effects"
                                    style={{ width: "30px", height: "30px" }}
                                  ></div>
                                </div>
                              </div>
                            ) : selectedType === "grouped" ? (
                              categories?.unique?.grouped?.map((c) => {
                                return (
                                  <ListItemCard
                                    {...c}
                                    // imgSrc={salus_logo}
                                    imgSrc={getImageUrl(c.type === "" ? c.name : c.type)}
                                    key={c.name}
                                    onClick={() => {
                                      handleCategoryClick(c);
                                    }}
                                    className={`${
                                      selectedCatName.trim() === c.name.trim()
                                        ? "activeCard"
                                        : ""
                                    }`}
                                  />
                                );
                              })
                            ) : (
                              categories?.unique?.ungrouped?.map((c) => {
                                return (
                                  <ListItemCard
                                    {...c}
                                    // imgSrc={salus_logo}
                                    imgSrc={getImageUrl(c.type === "" ? c.name : c.type)}
                                    key={c.name}
                                    onClick={() => {
                                      handleCategoryClick(c);
                                    }}
                                    className={`${
                                      selectedCatName.trim() === c.name.trim()
                                        ? "activeCard"
                                        : ""
                                    }`}
                                  />
                                );
                              })
                            )}
                          </motion.div>
                        </CardBody>
                      </Card>
                    ) : (
                      <></>
                    )}
                  </Col>
                </Row>
                {step == 2 && (
                  <motion.div
                    style={{ position: "relative" }}
                    key="step-2"
                    initial={
                      prevStep < step
                        ? { x: 200, opacity: 0 }
                        : { x: -200, opacity: 0 }
                    }
                    animate={{ x: 0, opacity: 1 }}
                    exit={
                      prevStep < step
                        ? { x: -200, opacity: 0 }
                        : { x: 200, opacity: 0 }
                    }
                    transition={{ duration: 0.3 }}
                  >
                    {isCreatingAppointment && (
                      <div className="step2Cover"></div>
                    )}
                    <Row>
                      <h4>Calender</h4>
                      <Col
                        md="4"
                        className="d-flex gap-1 flex-column"
                        style={{ paddingRight: "40px" }}
                      >
                        <Card color="white" style={{ position: "relative" }}>
                          <Calendar
                            className="rounded border w-100"
                            minDate={new Date()}
                            onChange={(e) => {
                              handleDayClick(e);
                            }}
                            tileDisabled={tileDisabled}
                            onViewChange={handleViewChange}
                            onActiveStartDateChange={handleViewChange}
                            tileContent={({ date, view }) => {
                              if (
                                view === "month" &&
                                selectedDay &&
                                date.getDate() === selectedDay
                              ) {
                                return (
                                  <div className="selected-date">
                                    {date.getDate()}
                                  </div>
                                );
                              }
                            }}
                          />
                          {(!(selectedInstructor?.id && selectedCat?.id) ||
                            isLoadingDays) && (
                            <div
                              className="roundedBorder border w-100 h-100"
                              style={{
                                top: "0",
                                position: "absolute",
                                textAlign: "center",
                                paddingTop: "30%",
                                backgroundColor: "#243070",
                                opacity: 0.8,
                                fontSize: "18px",
                                color: "white",
                              }}
                            >
                              {isLoadingDays ? (
                                <div
                                  className="fallback-spinner app-loader"
                                  style={{ height: "20vh" }}
                                >
                                  <div
                                    className="loading"
                                    style={{ width: "30px", height: "30px" }}
                                  >
                                    <div
                                      className="effect-1 effects"
                                      style={{ width: "30px", height: "30px" }}
                                    ></div>
                                    <div
                                      className="effect-2 effects"
                                      style={{ width: "30px", height: "30px" }}
                                    ></div>
                                    <div
                                      className="effect-3 effects"
                                      style={{ width: "30px", height: "30px" }}
                                    ></div>
                                  </div>
                                </div>
                              ) : (
                                <p style={{ paddingTop: "10%" }}>
                                  Please select Type and Instructor
                                </p>
                              )}
                            </div>
                          )}
                        </Card>
                        <Row className="d-flex">
                          <Col
                            md="2"
                            sm="2"
                            xs="12"
                            className="d-flex align-items-center"
                          >
                            <Label className="text-right">Instructor</Label>
                          </Col>
                          <Col md="10" sm="10" xs="12">
                            <CustomSelect
                              className="w-100"
                              placeholder={"Select Instructor"}
                              options={instructors.map((instructor) => {
                                return {
                                  label: instructor.full_name,
                                  value: instructor.id,
                                  obj: instructor,
                                };
                              })}
                              onChange={(e) => {
                                setSelectedInstructor(e.obj);
                              }}
                            />
                          </Col>
                        </Row>
                        <Row className="d-flex">
                          <Col
                            md="2"
                            sm="2"
                            xs="12"
                            className="d-flex align-items-center"
                          >
                            <Label className="text-right">Type</Label>
                          </Col>
                          <Col md="10" sm="10" xs="12">
                            <CustomSelect
                              className="w-100"
                              placeholder={"Select Class Type"}
                              options={catTypeOptions}
                              onChange={(e) => {
                                setSelectedCatType(e.label);
                                setSelectedCat(e.category);
                              }}
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col md="8">
                        <Card color="white" className="border">
                          <CardHeader>
                            <CardTitle>Available Sessions</CardTitle>
                          </CardHeader>
                          <CardBody>
                            {isLoadingSlots ? (
                              <div
                                className="fallback-spinner app-loader"
                                style={{ height: "350px" }}
                              >
                                <div
                                  className="loading"
                                  style={{ width: "30px", height: "30px" }}
                                >
                                  <div
                                    className="effect-1 effects"
                                    style={{ width: "30px", height: "30px" }}
                                  ></div>
                                  <div
                                    className="effect-2 effects"
                                    style={{ width: "30px", height: "30px" }}
                                  ></div>
                                  <div
                                    className="effect-3 effects"
                                    style={{ width: "30px", height: "30px" }}
                                  ></div>
                                </div>
                              </div>
                            ) : sessions.length > 0 && selectedDay ? (
                              <div
                                style={{
                                  overflowY: "scroll",
                                  overflowX: "scroll",
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "flex-start",
                                  height: "350px",
                                }}
                              >
                                {sessions.map((c, idx) => (
                                  <ListSessions
                                    {...c}
                                    selected={selectedSession}
                                    setSelected={setSelectedSession}
                                    item={c}
                                    itemId={idx}
                                    onClick={() => setSelectedSlot(c)}
                                    key={idx}
                                    imgSrc={getImageUrl(selectedCat.type === "" ? selectedCat.name : selectedCat.type)}
                                    selectedCatName={selectedCatName}
                                    selectedCat={selectedCat}
                                    selectedCatType={selectedCatType}
                                    selectedInstructor={selectedInstructor}
                                  />
                                ))}
                              </div>
                            ) : (
                              <div
                                style={{
                                  minHeight: "350px",
                                  textAlign: "center",
                                  paddingTop: "50px",
                                  color: "#bababa",
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
                                <br />
                                No Sessions Available for given criteria
                              </div>
                            )}
                          </CardBody>
                          <CardFooter className="justify-content-end d-flex border-0 pt-0">
                            <CustomButton
                              color="primary"
                              onClick={() =>
                                selectedSlot && setSessionConfirmationModal(true)
                              }
                              style={{ minWidth: "160px" }}
                              disabled={!selectedSlot}
                            >
                              Confirm
                            </CustomButton>
                          </CardFooter>
                        </Card>

                        {sessionConfirmationModal && (
                          <Modal isOpen centered style={{ width: "320px" }}>
                            <div
                              className="progress-timer-bar-inner"
                              style={{ width: `${progress}%`, height: "3px" }}
                            ></div>
                            <ModalHeader
                              toggle={() => {
                                setSessionConfirmationModal(!sessionConfirmationModal);
                              }}
                            ></ModalHeader>
                            <ModalBody>
                              <ArrowLeft
                                onClick={() => {
                                  setSessionConfirmationModal(!sessionConfirmationModal);
                                }}
                                size="22px"
                                className="background-secondary rounded"
                                style={{
                                  color: "white",
                                  marginTop: "-50px",
                                  padding: "2px 1px",
                                  width: "35px",
                                  cursor: "pointer",
                                }}
                              />
                              <h3 className="text-center mb-2 text-success">
                               Confirm Session
                              </h3>
                              <Row className="flex-column gap-1">
                                <Col
                                  xs={12}
                                  className="align-items-center d-flex flex-column gap-1"
                                >
                                  <Avatar
                                    img={
                                      selectedInstructor?.avatar_url ||
                                      avatar_blank
                                    }
                                    status="online"
                                    style={{ height: 160, width: 160 }}
                                    imgHeight="160"
                                    imgWidth="160"
                                  />
                                  <span className="text-center">
                                    <h3 className="m-0">
                                      {selectedInstructor?.full_name}
                                    </h3>
                                    {/* <small className="text-default">
                                  Registered Doc
                                </small> */}
                                  </span>
                                </Col>
                                <Col xs={12} className="text-center pb-1">
                                  <h2 className="text-success">
                                    {addMinutesToTimeSlot(
                                      formatDatetoTime(aptRes?.date),
                                      aptRes?.appointment_type?.length
                                    )}
                                  </h2>
                                  <h4 className="text-default">
                                    {new Date(aptRes?.date).toDateString({
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </h4>
                                  <CustomButton
                                    color="primary"
                                    className="mt-2 rounded border"
                                    style={{ width: "90%" }}
                                    onClick={() =>
                                      selectedSlot && createAppointment()
                                    }
                                    loading={isCreatingAppointment}
                                  >
                                    Schedule Session
                                  </CustomButton>
                                  <Button
                                    color="white"
                                    className="mt-2 rounded border"
                                    style={{ width: "90%" }}
                                    onClick={() => {
                                      setSessionConfirmationModal(!sessionConfirmationModal);
                                    }}
                                  >
                                    Try different Session
                                  </Button>
                                </Col>
                              </Row>
                            </ModalBody>
                          </Modal>
                        )}

                        {confirmationModal && (
                          <Modal isOpen centered style={{ width: "320px" }}>
                            <div
                              className="progress-timer-bar-inner"
                              style={{ width: `${progress}%`, height: "3px" }}
                            ></div>
                            <ModalHeader
                              toggle={() => {
                                setConfirmationModal(!confirmationModal);
                                navigate("/sessions");
                              }}
                            ></ModalHeader>
                            <ModalBody>
                              <ArrowLeft
                                onClick={() => {
                                  setConfirmationModal(!confirmationModal);
                                  navigate("/book-session");
                                }}
                                size="22px"
                                className="background-secondary rounded"
                                style={{
                                  color: "white",
                                  marginTop: "-50px",
                                  padding: "2px 1px",
                                  width: "35px",
                                  cursor: "pointer",
                                }}
                              />
                              <h3 className="text-center mb-2 text-success">
                                Session Confirmed
                              </h3>
                              <Row className="flex-column gap-1">
                                <Col
                                  xs={12}
                                  className="align-items-center d-flex flex-column gap-1"
                                >
                                  <Avatar
                                    img={
                                      selectedInstructor?.avatar_url ||
                                      avatar_blank
                                    }
                                    status="online"
                                    style={{ height: 160, width: 160 }}
                                    imgHeight="160"
                                    imgWidth="160"
                                  />
                                  <span className="text-center">
                                    <h3 className="m-0">
                                      {selectedInstructor?.full_name}
                                    </h3>
                                    {/* <small className="text-default">
                                  Registered Doc
                                </small> */}
                                  </span>
                                </Col>
                                <Col xs={12} className="text-center pb-1">
                                  <h2 className="text-success">
                                    {addMinutesToTimeSlot(
                                      formatDatetoTime(aptRes?.date),
                                      aptRes?.appointment_type?.length
                                    )}
                                  </h2>
                                  <h4 className="text-default">
                                    {new Date(aptRes?.date).toDateString({
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </h4>
                                  <Button
                                    color="primary"
                                    className="mt-2 rounded border"
                                    style={{ width: "90%" }}
                                    onClick={() => {
                                      setConfirmationModal(!confirmationModal);
                                      navigate("/book-session");
                                    }}
                                  >
                                    Schedule new Session
                                  </Button>
                                  <Button
                                    color="white"
                                    className="mt-2 rounded border"
                                    style={{ width: "90%" }}
                                    onClick={() => {
                                      setConfirmationModal(!confirmationModal);
                                      navigate("/sessions/" + aptRes?.id);
                                    }}
                                  >
                                    View Session
                                  </Button>
                                </Col>
                              </Row>
                            </ModalBody>
                          </Modal>
                        )}
                      </Col>
                    </Row>
                  </motion.div>
                )}
              </CardBody>
            </AnimatePresence>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
}

export default JoinSessionPage;
