import React, { useEffect } from "react";
import ZoomMtgEmbedded from "@zoomus/websdk/embedded";
import KJUR from "jsrsasign";
import toast, { Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import {
  setLoading,
  removeLoading,
  removeSession,
} from "../../../../../../redux/features/session/session";

function ZoomComponent() {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.auth.user);
  const session = useSelector((state) => state.session);
  const meetingNumber = session?.sessionData?.zoom_meeting_id;
  const retry = session?.retry;
  const password = session?.sessionData?.zoom_join_url?.split("pwd=")[1];

  const joinMeeting = async () => {
    const apiKey = import.meta.env.VITE_API_CLIENT_KEY;
    const apiSecret = import.meta.env.VITE_API_CLIENT_SECRET;
    const signature = generateSignature(apiKey, apiSecret, meetingNumber, 0);
    const client = ZoomMtgEmbedded.createClient();
    let meetingSDKElement = document.getElementById("meetingSDKElement");
    try {
      await client.init({
        zoomAppRoot: meetingSDKElement,
        language: "en-US",
        customize: {
          video: {
            isResizable: true,
            viewSizes: {
              default: {
                width: 800,
                height: 500,
              },
              ribbon: {
                width: 300,
                height: 700,
              },
            },
          },
        },
      });
      await client.join({
        role: 0,
        leaveUrl: "https://zoom.us",
        meetingNumber: meetingNumber,
        sdkKey: apiKey,
        signature: signature,
        userName: user.first_name,
        password: password || "",
      });
      dispatch(removeLoading());
    } catch (error) {
      dispatch(removeLoading());
      ZoomMtgEmbedded.destroyClient();
      // console.error("Failed to join meeting", error);
      // toast(error.reason, {
      //   style: {
      //     backgroundColor: "#5d1921",
      //     color: "white",
      //   },
      // });
    }
  };

  function generateSignature(key, secret, meetingNumber, role) {
    const iat = Math.round(new Date().getTime() / 1000) - 30;
    const exp = iat + 60 * 60 * 2;
    const oHeader = { alg: "HS256", typ: "JWT" };
    const oPayload = {
      sdkKey: key,
      appKey: key,
      mn: meetingNumber,
      role: role,
      iat: iat,
      exp: exp,
      tokenExp: exp,
    };
    const sHeader = JSON.stringify(oHeader);
    const sPayload = JSON.stringify(oPayload);
    const sdkJWT = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, secret);
    return sdkJWT;
  }

  useEffect(() => {
    dispatch(setLoading());
    joinMeeting();
  }, [retry]);

  const handleButton = () => {
    dispatch(removeSession())
  }

  useEffect(() => {
    let intervalId;
    const checkElementAndAttachListener = () => {
      const element = document.querySelector('button[title="Leave"][tabindex="0"]');
      if (element) {
          element.addEventListener("click", handleButton);
          clearInterval(intervalId);
        }
    };
    intervalId = setInterval(checkElementAndAttachListener, 500);
  
    return () => {
      ZoomMtgEmbedded.destroyClient();
      clearInterval(intervalId);
      const element = document.querySelector('button[title="Leave"][tabindex="0"]');
      if (element) {
        element.removeEventListener("click", handleButton);
      }
    };
  }, []);



  return (
    <div
      style={{
        position: "absolute",
        zIndex: "10000",
        top: "200px",
        left: "47.5%",
      }}
    >
      <div id="meetingSDKElement"></div>
    </div>
  );
}

export default ZoomComponent;
