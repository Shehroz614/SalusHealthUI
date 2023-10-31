import React from "react";
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
  import SkeletonComponent from "../../../components/SkeletonComponent";
  import { CircularProgress } from "@mui/material";
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
  import no_result from "../../../assets/images/svg/no-result.svg"



export default function Goals({ isLoading, goals, loading, handleGoalClick, type}) {
  return (
    <>
      {isLoading ? (
        <>
          {[0, 1, 2, 3].map((goal, idx) => (
            <Col lg="3" md="4" sm="12" key={idx} style={{ opacity: "0.2" }}>
              <Card>
                <SkeletonComponent />
              </Card>
            </Col>
          ))}
        </>
      ) : goals?.length > 0 ? (
        goals?.map((goal, idx) => (
          <Col lg="3" md="4" sm="12" key={idx}>
            <Card
              color="secondary"
              className={`text-white p-1 goal-card ${
                goal.is_completed_for_date === true && "complete"
              }`}
              onClick={() =>
                goal.is_completed_for_date === false &&
                loading.idx === -1 &&
                handleGoalClick(goal.id, idx, goal.repeat )
              }
            >
              <div className="d-flex justify-content-start pb-3">
                <h4 className="text-white fw-600 goal-title">{goal?.name}</h4>
              </div>
              <div className="d-flex justify-content-between">
                <span>{goal?.repeat}</span>
                {loading.idx == idx && loading.type===goal?.repeat ? (
                  <CircularProgress size={18} className="text-white" />
                ) : goal.is_completed_for_date === false ? (
                  <Target size={18} />
                ) : (
                  <CheckCircle size={18} />
                )}
              </div>
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
          <img src={no_result} style={{height:"150px", width:"150px", opacity:"0.5"}}></img><br />
          No {type} Goals
        </div>
      )}
    </>
  );
}
