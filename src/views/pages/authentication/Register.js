// ** React Imports
import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'
import useJwt from '@src/auth/jwt/useJwt'

// ** Store & Actions
import { useDispatch } from 'react-redux'
import { handleLogin } from '@store/authentication'

// ** Third Party Components
import { useForm, Controller } from 'react-hook-form'
import { Facebook, Twitter, Mail, GitHub } from 'react-feather'

// ** Context
import { AbilityContext } from '@src/utility/context/Can'

// ** Custom Components
import InputPasswordToggle from '@components/input-password-toggle'

// ** Reactstrap Imports
import { Row, Col, CardTitle, CardText, Label, Button, Form, Input, FormFeedback } from 'reactstrap'

// ** Illustrations Imports
import illustrationsLight from '@src/assets/images/pages/register-v2.svg'
import illustrationsDark from '@src/assets/images/pages/register-v2-dark.svg'
// ** Styles
import '@styles/react/pages/page-authentication.scss'

import { siteInfo } from "@src/constants";
import themeConfig from "../../../configs/themeConfig";

import { authService } from "@src/services/authService";
import CustomButton from '../../../components/CustomButton'
import {
  SweetAlert,
  SweetAlertWithValidation,
} from "../../../components/SweetAlert";
import { useState } from 'react'

const defaultValues = {
  email: '',
  terms: false,
  username: '',
  password: ''
}

const Register = () => {
  // ** Hooks
  const ability = useContext(AbilityContext)
  const { skin } = useSkin()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  const onSubmit = data => {
    register(data)
  }

  // API call for registration
  const { mutate: register, isLoading: isRegistering } = authService.registerUser({
    onSuccess: async (response) => {
      if (response?.data?.success == true) {
        // store the token received from response in redux store and local storage
        SweetAlert("Registration Successful");
        console.log(response)
        window.location.href = location?.state?.prevPath ? location?.state?.prevPath : "/login";
      } else {
        const errs = response.data.result;
        if (errs && Object.keys(errs)?.length > 0) {
          SweetAlertWithValidation(errs);
          return;
        } else {
          const errMsg = response.data.message.split('.')[0];
          SweetAlert("error", errMsg);
        }
      }
    },
    onError: (error) => {
      SweetAlert( "error",  error?.response?.data?.message ||
          error?.response?.data?.title ||
          error?.message );
    },
    networkMode: "always",
  });

  return (
    <div className='auth-wrapper auth-cover'>
      <Row className='auth-inner m-0'>
        <Col className='d-none d-lg-flex align-items-start pt-1 login-banner-cs' lg='8' sm='12'>
          <Link to="/">
            <img src={themeConfig.app.appLogoImage} className="img-fluid" width="200px" />
          </Link>
        </Col>
        <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg='4' sm='12'>
          <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
            <CardTitle tag='h2' className='fw-bold mb-1'>
              Adventure starts here 🚀
            </CardTitle>
            <CardText className='mb-2'>Make your app management easy and fun!</CardText>

            <Form action='/' className='auth-register-form mt-2' onSubmit={handleSubmit(onSubmit)}>
              <div className='mb-1'>
                <Label className='form-label' for='register-username'>
                  Username
                </Label>
                <Controller
                  id='username'
                  name='username'
                  control={control}
                  render={({ field }) => (
                    <Input autoFocus placeholder='johndoe' invalid={errors.username && true} {...field} />
                  )}
                />
                {errors.username ? <FormFeedback>{errors.username.message}</FormFeedback> : null}
              </div>
              <div className='mb-1'>
                <Label className='form-label' for='register-email'>
                  Email
                </Label>
                <Controller
                  id='email'
                  name='email'
                  control={control}
                  render={({ field }) => (
                    <Input type='email' placeholder='john@example.com' invalid={errors.email && true} {...field} />
                  )}
                />
                {errors.email ? <FormFeedback>{errors.email.message}</FormFeedback> : null}
              </div>
              <div className='mb-1'>
                <Label className='form-label' for='register-password'>
                  Password
                </Label>
                <Controller
                  id='password'
                  name='password'
                  control={control}
                  render={({ field }) => (
                    <InputPasswordToggle className='input-group-merge' invalid={errors.password && true} {...field} />
                  )}
                />
              </div>
              <div className='form-check mb-1'>
                <Controller
                  name='terms'
                  control={control}
                  render={({ field }) => (
                    <Input {...field} id='terms' type='checkbox' checked={field.value} invalid={errors.terms && true} />
                  )}
                />
                <Label className='form-check-label' for='terms'>
                  I agree to
                  <a className='ms-25' href='/' onClick={e => e.preventDefault()}>
                    privacy policy & terms
                  </a>
                </Label>
              </div>
              <CustomButton loading={isRegistering} type='submit' block color='primary'>
                Sign up
              </CustomButton>
            </Form>
            <p className='text-center mt-2'>
              <span className='me-25'>Already have an account?</span>
              <Link to='/login'>
                <span>Sign in instead</span>
              </Link>
            </p>
            <div className='divider my-2'>
              <div className='divider-text'>or</div>
            </div>
            <div className='auth-footer-btn d-flex justify-content-center'>
              <Button color='facebook'>
                <Facebook size={14} />
              </Button>
              <Button color='twitter'>
                <Twitter size={14} />
              </Button>
              <Button color='google'>
                <Mail size={14} />
              </Button>
              <Button className='me-0' color='github'>
                <GitHub size={14} />
              </Button>
            </div>
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default Register
