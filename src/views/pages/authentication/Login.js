// ** React Imports
import { Link, useLocation } from "react-router-dom";

// ** Custom Hooks
import { useSkin } from "@hooks/useSkin";

// ** Third Party Components
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { HelpCircle, Coffee, X } from "react-feather";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Reactstrap Imports
import {
  Row,
  Col,
  Form,
  Alert,
  Button,
  CardText,
  CardTitle,
  UncontrolledTooltip,
} from "reactstrap";

// ** Illustrations Imports
import illustrationsLight from "@src/assets/images/banners/login-banner.png";
import illustrationsDark from "@src/assets/images/banners/login-banner.png";

// ** Styles
import "@styles/react/pages/page-authentication.scss";

import Swal from "sweetalert2";
import { authService } from "@src/services/authService";
import { useFormik } from "formik";
import * as Yup from "yup";
import CustomButton from "@src/components/CustomButton";
import CustomInput from "@src/components/CustomInput";
import FormikProvider from "@src/context/formik";
import {
  handleLogin,
  handleTokenExpiryTime,
} from "../../../redux/authentication";
import { tokenExpiryTime } from "../../../utility/Utils";
import { useTimer } from "react-timer-hook";
import {
  SweetAlert,
  SweetAlertWithValidation,
} from "../../../components/SweetAlert";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { siteInfo } from "@src/constants";
import themeConfig from "../../../configs/themeConfig";
import imageSms from "../../../assets/images/login/sms-tracking.png"
import imageLock from "../../../assets/images/login/lock.png"
import group from "../../../assets/images/login/group.png"



const ToastContent = ({ t, name, role }) => {
  return (
    <div className="d-flex">
      <div className="me-1">
        <Avatar size="sm" color="success" icon={<Coffee size={12} />} />
      </div>
      <div className="d-flex flex-column">
        <div className="d-flex justify-content-between">
          <h6>{name}</h6>
          <X
            size={12}
            className="cursor-pointer"
            onClick={() => toast.dismiss(t.id)}
          />
        </div>
        <span>
          You have successfully logged in as an {role} user to{" "}
          {siteInfo.siteLongName}. Now you can start to explore. Enjoy!
        </span>
      </div>
    </div>
  );
};

const Login = () => {
  //#region hooks
  const location = useLocation();
  const { skin } = useSkin();
  const dispatch = useDispatch();

  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .trim()
      .required("Email is required")
      .email("Invalid Email"),
    password: Yup.string().trim().required("Password is required"),
  });

  const loginFormik = useFormik({
    initialValues: {
      email: "farhanali@reporteq.com",
      password: "Pakistan@123!",
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      const payload = {
        email: values?.email?.trim(),
        password: values?.password?.trim(),
        generate_api_token: true,
      };

      login(payload);
    },
  });

  //#endregion

  //#region Event Handlers
  // API call for login
  const { mutate: login, isLoading: isLoggingIn } = authService.login({
    onSuccess: async (response) => {
      if (response?.data?.success == true) {
        // store the token received from response in redux store and local storage
        const token = response?.data?.result?.signIn?.api_key;

        dispatch(
          handleLogin({
            token: token,
          })
        );

        localStorage.setItem("token", token);

        window.location.href = location?.state?.prevPath
          ? location?.state?.prevPath
          : "/";
      } else {
        const errs = response.data.result;
        console.log(response);
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
  });

  const handleKeyPress = (e) => {
    if (e.key == "Enter") {
      e.preventDefault();
      loginFormik.handleSubmit();
    }
  };
  //#endregion

  return (
    <div className="auth-wrapper auth-cover">
      <Helmet>
        <title>Login | {siteInfo.siteLongName}</title>
      </Helmet>
      <Row className="auth-inner m-0">
        <Col className="d-none d-lg-flex align-items-start pt-1" lg="7" sm="12">
          <div className="login-custom-div d-flex flex-column">
            <div className="login-side-div position-relative">
              <div className="img-div">
                <img src={group}/>
              </div>
            </div>
          </div>
        </Col>
        <Col
          className="d-flex align-items-center auth-bg px-2 p-lg-5"
          lg="5"
          sm="12"
        >
          <Col className="px-xl-5 loginSide" sm="12" md="6" lg="12" style={{width:"80%"}}>
            <Link to="/">
              <img
                src={themeConfig.app.appLogoImage}
                className="img-fluid"
                width="100px"
                style={{ margin: "0 0 75px 0" }}
              />
            </Link>
            <Alert color="primary">
              <div className="alert-body font-small-2">
                <p>
                  <small className="me-50">
                    <span className="fw-bold">Patient:</span>{" "}
                    {import.meta.env.VITE_USER_USERNAME} |{" "}
                    {import.meta.env.VITE_USER_PASSWORD}
                  </small>
                </p>
              </div>
              <HelpCircle
                id="login-tip"
                className="position-absolute"
                size={18}
                style={{ top: "10px", right: "10px" }}
              />
              <UncontrolledTooltip target="login-tip" placement="left">
                This is just for ACL demo purpose.
              </UncontrolledTooltip>
            </Alert>
            <FormikProvider
              formik={{
                ...loginFormik,
                isLoading: isLoggingIn,
              }}
            >
              <Form className="auth-login-form mt-2">
                <div className="mb-1 position-relative">
                  <CustomInput
                    name="email"
                    label="Email"
                    placeholder="example@example.com"
                    onKeyDown={handleKeyPress}
                    img={imageSms}
                    icon={imageSms}
                    logo={imageSms}
                  >
                  <img src={imageSms} />
                  </CustomInput>
                </div>
                <div className="mb-1">
                  <CustomInput
                    type="password"
                    name="password"
                    label="Password"
                    onKeyDown={handleKeyPress}
                    isInputGroup={true}
                    placeholder="****"
                    visible={false}
                  />
                  <div className="d-flex justify-content-end">
                    <Link to={"/forgot-password"}>Forgot Password ?</Link>
                  </div>
                </div>
                <CustomButton
                  type="button"
                  color="secondary"
                  block
                  onClick={(e) => {
                    e.preventDefault();
                    loginFormik.handleSubmit();
                  }}
                  disabled={isLoggingIn}
                  loading={isLoggingIn}
                >
                  Log in
                </CustomButton>
              </Form>
            </FormikProvider>
            {/* <p className="text-center mt-2">
              <span className="me-25">New on our platform?</span>
              <Link to="/register">
                <span>Create an account</span>
              </Link>
            </p> */}
          </Col>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
