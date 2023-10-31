import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { appointmentService } from "../../../../../../services/appointmentService";
import no_result from "../../../../../../assets/images/svg/no-result.svg";
import {
  addMinutesToTimeSlot,
  formatDateToYYYYMMDD,
  formatDatetoTime,
} from "../../../../../../utility/Utils";
import { motion } from "framer-motion";
import ZoomComponent from "./ZoomComponent";
import CustomButton from "@src/components/CustomButton";
import { ArrowLeft } from "react-feather";
import { useSelector, useDispatch } from "react-redux";
import { incRetry, setSessionData } from "../../../../../../redux/features/session/session";

function Session() {
  const { id } = useParams();
  const user = useSelector((store) => store.auth.user);
  const [session, setSession] = useState({});
  const [noSession, setNoSession] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeLeftText, setTimeLeftText] = useState("");
  const today = formatDateToYYYYMMDD !== formatDateToYYYYMMDD(session?.date);
  // const [joinMeeting, setJoinMeeting] = useState(false);
  const navigate = useNavigate()
  const location = useLocation();
  const returnPage = new URLSearchParams(location.search).get('return');
  const dispatch = useDispatch()
  const stateSession = useSelector((state) => state.session)
  const joining = stateSession.isLoading

  //get appointments
  const { data: appointmentData } = appointmentService.getAppointments(
    {
      userId: user.id,
    },
    {
      onSuccess: async (response) => {
        setLoading(false);
        if (response?.data?.success == true) {
          const apt = response?.data?.result?.appointments?.find(
            (session) => session?.id === id
          );
          if (apt) {
            // console.log(apt)
            setSession(apt);
          } else {
            setNoSession(true);
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
        setLoading(false);
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

  //time left timer
  useEffect(() => {
    const meetingStartTime = new Date(session?.date);
    const interval = setInterval(() => {
      const newTimeLeft = meetingStartTime - new Date();
      if (newTimeLeft <= 0) {
        clearInterval(interval);
        setTimeLeftText("Meeting has started");
        return;
      }

      const daysLeft = Math.floor(newTimeLeft / (1000 * 60 * 60 * 24));
      const monthsLeft = Math.floor(daysLeft / 30);
      const hoursLeft = Math.floor(
        (newTimeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutesLeft = Math.floor(
        (newTimeLeft % (1000 * 60 * 60)) / (1000 * 60)
      );
      const secondsLeft = Math.floor((newTimeLeft % (1000 * 60)) / 1000);
      if (monthsLeft > 0) {
        setTimeLeftText(
          `${monthsLeft} mon : ${
            daysLeft % 30
          } days : ${hoursLeft} hrs : ${minutesLeft} min : ${secondsLeft} sec`
        );
      } else if (daysLeft > 0) {
        setTimeLeftText(
          `${daysLeft} days : ${hoursLeft} hrs : ${minutesLeft} min : ${secondsLeft} sec`
        );
      } else {
        setTimeLeftText(
          `${hoursLeft} hrs : ${minutesLeft} min : ${secondsLeft} sec`
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [session]);

  // Helper function to parse time in 'hh:mm AM/PM' format
  function parseTime(timeString) {
    const [time, period] = timeString?.split(" ");
    const [hours, minutes] = time?.split(":");
    let parsedHours = parseInt(hours, 10);
    if (period === "PM" && parsedHours !== 12) {
      parsedHours += 12;
    } else if (period === "AM" && parsedHours === 12) {
      parsedHours = 0;
    }
    return parsedHours * 60 + parseInt(minutes, 10);
  }

  //handle meeting join 
  const handleJoinMeeting = () => {
    dispatch(setSessionData(session))
    dispatch(incRetry())
  }


  return (
    <div className="session-container">
      <motion.div className="session-card"
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4 }}
      >
        {loading ? (
          <div
            className="fallback-spinner app-loader"
            style={{ height: "70vh" }}
          >
            <div className="loading" style={{ width: "30px", height: "30px" }}>
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
        ) : noSession ? (
          <div
            style={{
              minHeight: "70vh",
              textAlign: "center",
              paddingTop: "102px",
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
            No Sessions Available
          </div>
        ) : (
          <>
          <motion.span whileTap={{scale:0.9, backgroundColor:"#dedede"}} className="SessionSpanBack" onClick={() => returnPage==="homePage" ? navigate("/home") : navigate("/sessions")}><ArrowLeft/></motion.span>
            <h1>Session Details</h1>
            <div className="session-info">
              <div className="property">
                <p className="bold">Session ID:</p>
                <p>{id}</p>
              </div>
              <div className="property">
                <p className="bold">Category:</p>
                <p>{session?.appointment_type?.name}</p>
              </div>
              <div className="property">
                <p className="bold">Instructor:</p>
                <p>{session?.provider?.full_name}</p>
              </div>
              <div className="property">
                <p className="bold">Location:</p>
                <p>{session?.location}</p>
              </div>
              <div className="property">
                <p className="bold">Type:</p>
                <p>{session?.is_group ? "Group Session" : "1-1 Session"}</p>
              </div>
              <div className="property">
                <p className="bold">Date:</p>
                <p>{formatDateToYYYYMMDD(session?.date)}</p>
              </div>
              <div className="property">
                <p className="bold">Time:</p>
                <p>
                  {addMinutesToTimeSlot(
                    formatDatetoTime(session?.date),
                    session?.length
                  )}
                </p>
              </div>
            </div>
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay:1 }}
            className="time-left">{timeLeftText}</motion.div>
            {/* {true && ( */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
                whileTap={today ? { scale: "0.99" } : {}}
                onClick={() => today && handleJoinMeeting()}
              > 
                <CustomButton loading={joining} disabled={!today} className="join-button">
                Join Session
                </CustomButton>
              </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default Session;
