import React, { Suspense } from "react";
import Router from "./router/Router";
import { authService } from "@src/services/authService";
import { useDispatch } from "react-redux";
import { handleLogin } from "./redux/authentication";
import SpinnerComponent from "./@core/components/spinner/Fallback-spinner";
import { AllEnums } from "./constants/enums";
import { SweetAlert, SweetAlertWithValidation } from "./components/SweetAlert";
import { useEffect } from "react";

const App = () => {
  //#region States
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  //#endregion States

  const { data: meData, isFetching: isLoading } = authService.me(["get-me"], {
    onSuccess: (data) => {
      if (data?.data?.success) {
        const { result } = data?.data;
        const payload = {
          user: result?.currentUser,
          login: true,
          role: {
            id: result?.currentUser?.is_patient ? AllEnums.userRole.Patient : AllEnums.userRole.Admin,
            roleName: result?.currentUser?.is_patient ? "Patient" : "Admin",
          },
        };
        dispatch(handleLogin(payload));
      } else {
        const errs = data?.data?.result;

          if (errs && Object.keys(errs)?.length > 0) {
            SweetAlertWithValidation(errs);
          } else {
            SweetAlert("error", data.data.message);
            if(data.data.message==="UnAuthorized"){
              setTimeout(() => {
                // location.reload() 
                location.replace("/login")
              },1000)
            }
          }
      }
    },
    onError: (error) => {
      const errs = error?.response?.data?.result?.referenceErrorCode ? null : error?.response?.data?.result;

          if (errs && Object.keys(errs)?.length > 0) {
            SweetAlertWithValidation(errs);
          } else {
            SweetAlert("error", (error?.response?.data?.message || error?.response?.data?.title) || error?.message);
            if(error?.response?.data?.message==="UnAuthorized" || error?.response?.data?.title==="UnAuthorized" || error?.message==="UnAuthorized"){
              setTimeout(() => {
                location.replace("/login")
              },1000)
            }
          }
    },
    refetchOnWindowFocus: false,
    retry: false,
    networkMode: "always",
    enabled: !!token,
  });


  return (
    <Suspense fallback={null}>
      {isLoading ? <SpinnerComponent /> : <Router />}
    </Suspense>
  );
};

export default App;
