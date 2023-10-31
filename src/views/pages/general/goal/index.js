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
  AlignCenter,
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
import { CircularProgress } from "@mui/material";
import { goalService } from "../../../../services/goalService";
import {
  SweetAlert,
  SweetAlertWithValidation,
} from "../../../../components/SweetAlert";
import Goals from "../../../components/goals/goals";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { formatDateToYYYYMMDD } from "../../../../utility/Utils";

function GoalsPage() {
  const user = useSelector((store) => store.auth.user);
  const [loading, setLoading] = useState({ idx: -1 });
  const [selectedProgress, setSelectedProgress] = useState("All");
  const [activeType, setActiveType] = useState("All");
  const [activeFilter, setActiveFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(true);
  const token = localStorage.getItem("token");
  const [goals, setGoals] = useState({});
  const selGoalId = useRef(-1);
  const selGoalType = useRef("");


  const handleGoalsData = (data) => {
    const categorizedData = {
      once: [],
      daily: [],
      weekly: [],
    };
    data?.forEach((item) => {
      switch (item.repeat) {
        case "Once":
          categorizedData.once.push(item);
          break;
        case "Daily":
          categorizedData.daily.push(item);
          break;
        case "Weekly":
          categorizedData.weekly.push(item);
          break;
        default:
          break;
      }
    });
    return categorizedData;
  };

  const handleChange = (e) => {
    setActiveFilter(e.target.value);
    let data;
    switch (e.target.value) {
      case "All":
        data = goalData?.data?.result?.goalsData?.goals;
        break;
      case "Completed":
        data = goalData?.data?.result?.goalsData?.goals.filter(
          (goal) => goal.is_completed_for_date === true
        );
        break;
      case "In Progress":
        data = goalData?.data?.result?.goalsData?.goals.filter(
          (goal) => goal.is_completed_for_date === false
        );
        break;
      case "Not Completed":
        data = goalData?.data?.result?.goalsData?.goals.filter(
          (goal) => goal.is_completed_for_date === false
        );
        break;
      default:
        break;
    }
    setGoals(handleGoalsData(data));
  };

  const handleGoalClick = (itemId, idx, type) => {
    setLoading({ idx, type });
    selGoalId.current = idx;
    selGoalType.current = type;
    const data = {
      user_id: user?.id,
      goal_id: itemId,
      mark_parent_complete: false,
      completed_on: formatDateToYYYYMMDD(Date.now()),
    };
    markGoal(data);
  };

  //Fetch Goals
  const { data: goalData, isFetching: isLoading } = goalService.getGoals(
    ["goals"],
    {
      onSuccess: (response) => {
        if (response?.data?.success) {
          const data = handleGoalsData(
            response?.data?.result?.goalsData?.goals
          );
          // console.log(data);
          setGoals(data);
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

  //Mark Goal
  const { mutate: markGoal, isLoading: isLoadingGoal } = goalService.updateGoal(
    {
      onSuccess: async (response) => {
        const selectedGoalId = selGoalId.current;
        const selectedGoalType = selGoalType.current.toLowerCase();
        setLoading({ idx: -1 });
        // console.log(response);
        if (response?.data?.success == true) {
          SweetAlert("success", response?.data?.message);
          const tempGoals = [...goals[selectedGoalType]];
          tempGoals[selectedGoalId] = {
            ...tempGoals[selectedGoalId],
            is_completed_for_date: true,
          };
          setGoals({ ...goals, [selectedGoalType]: tempGoals });
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
        setLoading({ idx: -1 });
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

  useEffect(() => {
    let data;
    switch (activeFilter) {
      case "All":
        data = goalData?.data?.result?.goalsData?.goals;
        break;
      case "Completed":
        data = goalData?.data?.result?.goalsData?.goals.filter(
          (goal) => goal.is_completed_for_date === true
        );
        break;
      case "In Progress":
        data = goalData?.data?.result?.goalsData?.goals.filter(
          (goal) => goal.is_completed_for_date === false
        );
        break;
      case "Not Completed":
        data = goalData?.data?.result?.goalsData?.goals.filter(
          (goal) => goal.is_completed_for_date === false
        );
        break;
      default:
        break;
    }
    setGoals(handleGoalsData(data));
  }, [activeFilter]);

  return (
    <Fragment>
      <Helmet>
        <title>Goals | {siteInfo.siteLongName}</title>
      </Helmet>
      <Card color="white">
        <CardBody>
          <Row>
            <Col md="12">
              <Card color="white">
                <CardHeader>
                  <div
                    className="d-flex align-items-center"
                    style={{
                      display: "flex", 
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <CardTitle>
                      <div className="page-title">
                        <Target size={28} />
                        <h3 style={{ margin: "0 auto" }}>My Goals</h3>
                      </div>
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
                    <div className="goalSelect lg-none">
                      <select
                        id="progressSelect"
                        value={activeFilter}
                        onChange={handleChange}
                      >
                        <option value="All">All</option>
                        <option value="Completed">Completed</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Not Completed">Not Completed</option>
                      </select>
                    </div>
                    </div>
                  </div>
                  {/* <Button
                        size="sm"
                        color="primary"
                        className="d-flex align-items-center gap-25"
                        >
                        <Plus size={20} /> Create New Goal
                    </Button> */}
                </CardHeader>
                {
                showFilters &&
                <motion.div className="tabsContainerMain"
                  initial ={{y:-10,opacity:0, backgroundColor:"#e1e1e166"}}
                  animate={{y:0,opacity:1, backgroundColor:"transparent"}}
                  transition={{duration:0.2}}
                >
                  <div className="tab-container-box">
                    <div
                      onClick={() => setActiveType("All")}
                      className={`tab ${activeType === "All" ? "active" : ""}`}
                    >
                      All
                    </div>
                    <div
                      onClick={() => setActiveType("Daily")}
                      className={`tab ${
                        activeType === "Daily" ? "active" : ""
                      }`}
                    >
                      Daily
                    </div>
                    <div
                      onClick={() => setActiveType("Weekly")}
                      className={`tab ${
                        activeType === "Weekly" ? "active" : ""
                      }`}
                    >
                      Weekly
                    </div>
                    <div
                      onClick={() => setActiveType("Once")}
                      className={`tab ${activeType === "Once" ? "active" : ""}`}
                    >
                      One Time
                    </div>
                  </div>
                  <div className="tab-container-circular sm-none">
                    <div
                      onClick={() => setActiveFilter("All")}
                      className={`tab ${
                        activeFilter === "All" ? "active" : ""
                      }`}
                    >
                      All
                    </div>
                    <div
                      onClick={() => setActiveFilter("Completed")}
                      className={`tab ${
                        activeFilter === "Completed" ? "active" : ""
                      }`}
                    >
                      Completed
                    </div>
                    <div
                      onClick={() => setActiveFilter("In Progress")}
                      className={`tab ${
                        activeFilter === "In Progress" ? "active" : ""
                      }`}
                    >
                      In Progress
                    </div>
                    <div
                      onClick={() => setActiveFilter("Not Completed")}
                      className={`tab ${
                        activeFilter === "Not Completed" ? "active" : ""
                      }`}
                    >
                      Not Completed
                    </div>
                  </div>
                  <div className="bar"></div>
                </motion.div>
                }
                
                <CardBody className="p-1">
                  {(activeType === "Daily" || activeType === "All") && (
                    <>
                      <h3 style={{ margin: "20px 0px 15px 0px" }}>Daily</h3>
                      <Row>
                        <Goals
                          isLoading={isLoading}
                          goals={goals.daily}
                          loading={loading}
                          handleGoalClick={handleGoalClick}
                          type={"Daily"}
                        />
                      </Row>
                    </>
                  )}
                  {(activeType === "Weekly" || activeType === "All") && (
                    <>
                      <h3 style={{ margin: "30px 0px 15px 0px" }}>Weekly</h3>
                      <Row>
                        <Goals
                          isLoading={isLoading}
                          goals={goals.weekly}
                          loading={loading}
                          handleGoalClick={handleGoalClick}
                          type={"Weekly"}
                        />
                      </Row>
                    </>
                  )}
                  {(activeType === "Once" || activeType === "All") && (
                    <>
                      <h3 style={{ margin: "30px 0px 15px 0px" }}>One Time</h3>
                      <Row>
                        <Goals
                          isLoading={isLoading}
                          goals={goals.once}
                          loading={loading}
                          handleGoalClick={handleGoalClick}
                          type={"One Time"}
                        />
                      </Row>
                    </>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Fragment>
  );
}

export default GoalsPage;
