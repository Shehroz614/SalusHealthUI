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
  Spinner,
} from "reactstrap";
import { Helmet } from "react-helmet";
import { siteInfo } from "@src/constants";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  Flag,
  Headphones,
  Phone,
  Plus,
  Target,
} from "react-feather";
import {
  formatDateToCustomString,
  formatDatetoTime,
  hasTimePassed,
  formatDateToYYYYMMDD,
  getMonthNameFromDate,
  addMinutesToTimeSlot,
} from "../../../../utility/Utils";
import { Link, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { goalService } from "../../../../services/goalService";
import { appointmentService } from "../../../../services/appointmentService";
import {
  SweetAlert,
  SweetAlertWithValidation,
} from "../../../../components/SweetAlert";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import SkeletonComponent from "../../../../components/SkeletonComponent";
import Empty from "../../../../components/Empty";
import no_result from "../../../../assets/images/svg/no-result.svg";
import no_appointment from "../../../../assets/images/misc/no-appointment.jpg";
import Avatar from "@components/avatar";

function HomePage() {
  const user = useSelector((store) => store.auth.user);
  const [loading, setLoading] = useState(-1);
  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();
  const [goals, setGoals] = useState([]);
  const [upcomingSession, setUpcomingSession] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const selGoalId = useRef(-1);
  const navigate = useNavigate();

  const handleGoalClick = (itemId, idx) => {
    setLoading(idx);
    selGoalId.current = idx;
    const data = {
      user_id: user?.id,
      goal_id: itemId,
      mark_parent_complete: false,
      completed_on: formatDateToYYYYMMDD(Date.now()),
    };
    markGoal(data);
  };

  // console.log("user: ", user);

  //Fetch Goals
  const { data: goalData, isFetching: isLoading } = goalService.getGoals(
    ["goals"],
    {
      onSuccess: (response) => {
        if (response?.data?.success) {
          setGoals(response?.data?.result?.goalsData?.goals);
        } else {
          const errs = response?.data?.result;
          if (errs && Object.keys(errs)?.length > 0) {
            SweetAlertWithValidation(errs);
          } else {
            SweetAlert("error", response.data.message);
          }
        }
      },
      onError: (error) => {
        const errs = error?.response?.data?.result?.referenceErrorCode
          ? null
          : error?.response?.data?.result;

        if (errs && Object.keys(errs)?.length > 0) {
          SweetAlertWithValidation(errs);
        } else {
          SweetAlert(
            "error",
            error?.response?.data?.message ||
              error?.response?.data?.title ||
              error?.message
          );
        }
      },
      refetchOnWindowFocus: false,
      retry: false,
      networkMode: "always",
      enabled: !!token,
    }
  );

  //get appointments
  const { data: appointmentData, isLoading: isLoadingAppointments } =
    appointmentService.getAppointments(
      {
        userId: user.id,
      },
      {
        onSuccess: (response) => {
          if (response?.data?.success == true) {
            const data = response?.data?.result?.appointments;
            setUpcomingSession(
              data?.filter((session) => !hasTimePassed(session.date))
            );
            setLoadingSessions(false);
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
        enabled: !!token,
      }
    );

  //Mark Goal
  const { mutate: markGoal, isLoading: isLoadingGoal } = goalService.updateGoal(
    {
      onSuccess: async (response) => {
        const selectedGoalId = selGoalId.current;
        setLoading(-1);
        // console.log(response);
        if (response?.data?.success == true) {
          SweetAlert("success", response?.data?.message);
          const tempGoals = [...goals];
          tempGoals[selectedGoalId] = {
            ...tempGoals[selectedGoalId],
            is_completed_for_date: true,
          };
          setGoals(tempGoals);
          // queryClient.invalidateQueries('goals');
        } else {
          const errs = response.data.result;
          if (errs?.length > 0 && !isString(errs)) {
            SweetAlertWithValidation(errs);
            return;
          } else {
            const errMsg = response.data.message.split(".")[0];
            SweetAlert("error", errMsg);
          }
        }
      },
      onError: (error) => {
        setLoading(-1);
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

  return (
    <Fragment>
      <Helmet>
        <title>Home | {siteInfo.siteLongName}</title>
      </Helmet>
      <Card color="white">
        <CardBody>
          <Row className="d-flex justify-content-between align-items-center">
            <Col>
              <Card color="white" >
                <CardBody>
                  <div className="d-flex sm-content-center">
                    <Avatar
                      img={user?.avatar_url}
                      imgHeight="150"
                      imgWidth="150"
                      status="online"
                      className="roundedImg"
                    />
                    <div style={{ margin: "auto 10px" }}>
                      <p className="headingWelcome m-0">Welcome Back!</p>
                      <h1 style={{ fontSize: "50px" }}>{user?.first_name}</h1>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col className="d-flex justify-content-end sm-content-center">
              <Card color="white">
                <CardBody>
                  <div className="d-flex flex-column gap-25">
                    <span className="d-flex align-items-center justify-center gap-50">
                      <h4 className="m-0 mx-auto text-center fw-600" style={{paddingTop:"30px"}}>
                        Contact Support
                      </h4>
                    </span>
                    <div className="d-flex align-items-center gap-50 text-default callSupport mx-auto">
                      <Phone size={21} />
                      <span className="fw-500">123-123-123</span>
                    </div>
                    <div>
                      <p
                        className="text-xs mx-auto text-center"
                        style={{
                          color: "gray",
                          width: "70%",
                          fontSize: "11px",
                        }}
                      >
                        Give us a call and we will help you whatever you need
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Row>
        <Col md="12" lg="6" style={{ height: "100%" }}>
          <Card color="white" style={{ height: "550px" }}>
            <CardHeader className="gap-1">
              <div className="d-flex align-items-center">
                <CardTitle>
                  <span className="page-title">
                    {/* <Clock size={28} /> */}
                    {<h3 className="text">Next Appointment</h3>}
                  </span>
                </CardTitle>

                <Link className="m-1" to="/sessions">
                  View all appointments <ArrowRight size={16} />
                </Link>
              </div>
            </CardHeader>
            <CardBody>
              {isLoadingAppointments || loadingSessions ? (
                <Row className="align-items-center mb-50" style={{}}>
                  <Col
                    lg="12"
                    md="12"
                    sm="12"
                    style={{ opacity: "0.2", height: "40px" }}
                  >
                    <SkeletonComponent count={4} />
                  </Col>
                  <div className="my-2 mt-5" style={{ color: "black" }}>
                    <h3>Upcoming Appointments</h3>
                  </div>
                  <Col lg="12" md="12" sm="12" style={{ opacity: "0.2" }}>
                    <SkeletonComponent count={4} />
                  </Col>
                  <div className="my-1"></div>
                  <Col lg="12" md="12" sm="12" style={{ opacity: "0.2" }}>
                    <SkeletonComponent count={4} />
                  </Col>
                </Row>
              ) : upcomingSession.length > 0 ? (
                <>
                  <Row className="align-items-center mb-50 appCard">
                    <Col
                      lg="4"
                      md="4"
                      sm="3"
                      className="px-0 d-flex position-relative  overflow-hidden roundedBorder"
                    >
                      <div
                        className="w-50 h-110px"
                        style={{ backgroundColor: "#cccccc", height: "95px" }}
                      ></div>
                      <div
                        className="w-50 h-110px"
                        style={{ height: "95px" }}
                      ></div>
                      <div
                        className="d-flex flex-column m-auto mx-1 my-1 position-absolute bg-white roundedBorder overflow-hidden"
                        style={{ width: "80%" }}
                      >
                        <span className="bg-primary text-center text-white font-weight-bold">
                          {getMonthNameFromDate(
                            new Date(upcomingSession[0].date)
                          ) +
                            " " +
                            new Date(upcomingSession[0].date).getDate()}
                        </span>
                        <span
                          className="pt-1 text-center"
                          style={{ color: "gray" }}
                        >
                          <pre>
                            {addMinutesToTimeSlot(
                              formatDatetoTime(upcomingSession[0]?.date),
                              upcomingSession[0]?.length
                            )}
                          </pre>
                        </span>
                      </div>
                    </Col>
                    <Col lg="7" md="7" sm="8">
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
                          {upcomingSession[0]?.appointment_type?.name
                            ?.split(" - ")[0]
                            ?.replace(/\([^)]*\)/g, "")
                            .trim()}{" "}
                          Consultation
                        </h4>
                        <span style={{ color: "#a1a1a1", fontSize: "13px" }}>
                          {upcomingSession[0]?.provider?.full_name}
                        </span>
                        <span style={{ color: "#a1a1a1", fontSize: "13px" }}>
                          {upcomingSession[0]?.location}
                        </span>
                      </div>
                    </Col>
                    <Col lg="1" md="1" sm="1">
                      <span
                        style={{ color: "#a1a1a1", cursor: "pointer" }}
                        onClick={() =>
                          navigate(
                            `/sessions/${upcomingSession[0]?.id}?return=homePage`
                          )
                        }
                      >
                        {">"}
                      </span>
                    </Col>
                  </Row>
                  <div className="my-2">
                    <h3>Upcoming Appointments</h3>
                  </div>
                  {upcomingSession?.slice(1, 3)?.map((session) => {
                    return (
                      <Row className="align-items-center mb-50 appCard">
                        <Col
                          lg="4"
                          md="4"
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
                          <div
                            className="w-50 h-110px"
                            style={{ height: "95px" }}
                          ></div>
                          <div
                            className="d-flex flex-column m-auto mx-1 my-1 position-absolute bg-white roundedBorder overflow-hidden"
                            style={{ width: "80%" }}
                          >
                            <span className="bg-primary text-center text-white font-weight-bold">
                              {getMonthNameFromDate(new Date(session?.date)) +
                                " " +
                                new Date(session?.date).getDate()}
                            </span>
                            <span
                              className="pt-1 text-center"
                              style={{ color: "gray" }}
                            >
                              <pre>
                                {addMinutesToTimeSlot(
                                  formatDatetoTime(session?.date),
                                  session?.length
                                )}
                              </pre>
                            </span>
                          </div>
                        </Col>
                        <Col lg="7" md="7" sm="8">
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
                            <span
                              style={{ color: "#a1a1a1", fontSize: "13px" }}
                            >
                              {session?.provider?.full_name}
                            </span>
                            <span
                              style={{ color: "#a1a1a1", fontSize: "13px" }}
                            >
                              {session?.location}
                            </span>
                          </div>
                        </Col>
                        <Col lg="1" md="1" sm="1">
                          <span
                            style={{ color: "#a1a1a1", cursor: "pointer" }}
                            onClick={() =>
                              navigate(
                                `/sessions/${session?.id}?return=homePage`
                              )
                            }
                          >
                            {">"}
                          </span>
                        </Col>
                      </Row>
                    );
                  })}
                </>
              ) : (
                <div style={{ display: "flex" }}>
                  <img
                    src={no_appointment}
                    style={{ height: "200px", width: "200px" }}
                  />
                  <h4
                    className="text-primary fw-700"
                    style={{ margin: "auto 0" }}
                  >
                    No Upcoming Appointment
                  </h4>
                </div>
              )}
              <div style={{ marginTop: "40px" }}>
                <Link to="/book-session" className="w-full">
                  <Button
                    size="sm"
                    color="primary"
                    className="d-flex align-items-center gap-25 m-auto"
                  >
                    <Plus size={20} /> Create new Appointment
                  </Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col md="12" lg="6" style={{ height: "100%" }}>
          <Card color="white" style={{ height: "550px" }}>
            <CardHeader>
              <div className="d-flex align-items-center mt-1">
                <CardTitle>
                  <span className="page-title">
                    {/* <Target size={28} /> */}
                    <h3 className="text">My Goals</h3>
                  </span>
                </CardTitle>
                <Link className="mx-1" to="/goals">
                  View all goals <ArrowRight size={16} />
                </Link>
              </div>
            </CardHeader>
            <CardBody className="p-1">
              <Row>
                {isLoading ? (
                  <>
                    {[0, 1, 2].map((goal, idx) => (
                      <Col
                        lg="12"
                        md="12"
                        sm="12"
                        key={idx}
                        style={{ opacity: "0.2" }}
                      >
                        <Card>
                          <SkeletonComponent count={4} />
                        </Card>
                      </Col>
                    ))}
                  </>
                ) : goals?.length > 0 ? (
                  goals?.slice(0, 3)?.map((goal, idx) => (
                    <Col lg="12" md="12" sm="12" key={idx}>
                      <Card
                        color="white"
                        className={` px-1 goal-card ${
                          goal.is_completed_for_date === true && "complete"
                        }`}
                        style={{
                          height: "100px",
                          boxShadow: "3px 3px 10px 2px #ededed",
                          borderRadius: "15px",
                          overflow: "hidden",
                        }}
                        onClick={() =>
                          goal.is_completed_for_date === false &&
                          loading === -1 &&
                          handleGoalClick(goal.id, idx)
                        }
                      >
                        <Row>
                          <Col
                            md="2"
                            sm="2"
                            style={{ height: "100px" }}
                            className="bg-secondary h-full p-0"
                          >
                            <div className="pt-3 text-white px-0 text-center">
                              <span className="">{goal?.repeat}</span>
                            </div>
                          </Col>
                          <Col md="10" sm="10" className="d-flex flex-column">
                            <div
                              className=" justify-content-start"
                              style={{ margin: "auto 0" }}
                            >
                              <div className="d-flex justify-content-between">
                                <h4 className=" fw-600 goal-title m-0">
                                  {goal?.name}
                                </h4>
                                {loading == idx ? (
                                  <CircularProgress size={18} />
                                ) : goal.is_completed_for_date === false ? (
                                  <Target size={18} />
                                ) : (
                                  <CheckCircle size={18} />
                                )}
                              </div>
                              <span>{goal?.description}</span>
                            </div>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      marginTop: "50px",
                      marginBottom: "50px",
                      color: "gray",
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
                    No Goals found
                  </div>
                )}
              </Row>
              <Link to="/goals" className="w-full">
                <Button
                  size="sm"
                  color="primary"
                  className="d-flex align-items-center gap-25 m-auto mt-1"
                >
                  <Plus size={20} /> Create new Goals
                </Button>
              </Link>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
}

export default HomePage;
