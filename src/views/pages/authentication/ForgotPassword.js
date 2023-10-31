// ** React Imports
import { Link, Navigate } from 'react-router-dom'

// ** Reactstrap Imports
import { Row, Col, CardTitle, CardText, Form, Label, Input, Button } from 'reactstrap'

// ** Utils
import { isUserLoggedIn } from '@utils'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'

// ** Icons Imports
import { ChevronLeft } from 'react-feather'

// ** Illustrations Imports
import illustrationsLight from '@src/assets/images/pages/forgot-password-v2.svg'
import illustrationsDark from '@src/assets/images/pages/forgot-password-v2-dark.svg'

// ** Styles
import '@styles/react/pages/page-authentication.scss'

import { siteInfo } from "@src/constants";
import themeConfig from "../../../configs/themeConfig";
import { authService } from "@src/services/authService";
import { useFormik } from "formik";
import * as Yup from "yup";
import CustomButton from "@src/components/CustomButton";
import CustomInput from "@src/components/CustomInput";
import FormikProvider from "@src/context/formik";
import {
  SweetAlert,
  SweetAlertWithValidation,
} from "../../../components/SweetAlert";
import { Helmet } from "react-helmet";

const ForgotPassword = () => {

  //#region Formik
  const schema = Yup.object().shape({
    email: Yup.string()
      .trim()
      .required("Email is required")
      .email("Invalid Email"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      const payload = {
        email: values?.email?.trim(),
      };

      forgotPassword(payload);
    },
  });
  //#endregion

  //#region Event Handlers
  // API call for forgot password
  const { mutate: forgotPassword, isLoading: isForgettingPassword } = authService.forgotPassword({
    onSuccess: async (response) => {
      if (response?.data?.success == true) {
        SweetAlert("success", response?.data?.message);
      } else {
        const errs = response.data.result;

        if (errs && Object.keys(errs)?.length > 0) {
          SweetAlertWithValidation(errs);
          return;
        } else {
          const errMsg = response.data.message;
          SweetAlert("error", errMsg);
        }
      }
    },
    onError: (error) => {
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
      formik.handleSubmit();
    }
  };
  //#endregion

  if (!isUserLoggedIn()) {
    return (
      <div className='auth-wrapper auth-cover'>
        <Helmet>
          <title>Forgot Password | {siteInfo.siteLongName}</title>
        </Helmet>
        <Row className='auth-inner m-0'>
          <Col className='d-none d-lg-flex align-items-start pt-1 login-banner-cs' lg='8' sm='12'>
            <Link to="/">
              <img src={themeConfig.app.appLogoImage} className="img-fluid" width="200px" />
            </Link>
          </Col>
          <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg='4' sm='12'>
            <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
              <CardTitle tag='h2' className='fw-bold mb-1'>
                Forgot Password? 🔒
              </CardTitle>
              <CardText className='mb-2'>
                Enter your email and we'll send you instructions to reset your password
              </CardText>
              <FormikProvider
              formik={{
                ...formik,
                isLoading: isForgettingPassword
              }}
            >
              <Form className='auth-forgot-password-form mt-2' onSubmit={e => e.preventDefault()}>
                <div className="mb-1 position-relative">
                  <CustomInput
                    name="email"
                    label="Email"
                    placeholder="example@example.com"
                    onKeyDown={handleKeyPress}
                  />
                </div>
                <CustomButton
                  type="button"
                  color="primary"
                  block
                  onClick={(e) => {
                    e.preventDefault();
                    formik.handleSubmit();
                  }}
                  disabled={isForgettingPassword}
                  loading={isForgettingPassword}
                >
                  Send Instructions
                </CustomButton>
              </Form>
            </FormikProvider>
              
              <p className='text-center mt-2'>
                <Link to='/login'>
                  <ChevronLeft className='rotate-rtl me-25' size={14} />
                  <span className='align-middle'>Back to login</span>
                </Link>
              </p>
            </Col>
          </Col>
        </Row>
      </div>
    )
  } else {
    return <Navigate to='/' />
  }
}

export default ForgotPassword
