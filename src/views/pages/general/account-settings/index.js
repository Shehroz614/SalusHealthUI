//#region imports
import React, { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { siteInfo } from "@src/constants";
//#endregion

// ** Third Party Components
import {useFormik} from 'formik'
import CustomInput from '../../../../components/CustomInput'
import CustomButton from '../../../../components/CustomButton'
import ModalLoading from "../../../../components/ModalLoading";

// ** Reactstrap Imports
import { Row, Col, Form, Card, Input, Label, Button, CardBody, CardTitle, CardHeader, FormFeedback } from 'reactstrap'
import FormikProvider from "../../../../context/formik";
import * as Yup from 'yup'
import { SweetAlert, SweetAlertWithValidation } from "../../../../components/SweetAlert";
import { notificationSettingsService } from "../../../../services/notificationSettingsService";

function AccountSettings() {

  //#region Redux
  const user = useSelector((store) => store.auth.user);
  //#endregion
  
  //#region formik
  const initialValues = {
    id: 0,
    send_goal_reminder_email: false,
    send_email_on_appointment_book: false,
    send_email_on_appointment_cancel: false,
  }

  const validationSchema = Yup.object().shape({
    id: Yup.number(),
    send_goal_reminder_email: Yup.boolean(),
    send_email_on_appointment_book: Yup.boolean(),
    send_email_on_appointment_cancel: Yup.boolean(),
  });
  

  const formik = useFormik(
    {
      initialValues,
      validationSchema,
      onSubmit: (v) => {
        const payload = {
          id: user?.notification_setting?.id,
          send_goal_reminder_email: v?.send_goal_reminder_email,
          send_email_on_appointment_book: v?.send_email_on_appointment_book,
          send_email_on_appointment_cancel: v?.send_email_on_appointment_cancel,
        };

        updateSettings(payload);
      }
    }
  )
  //#endregion

  //#region Event Handlers
  //Api call to get the data of notification settings
  const { isFetching: gettingNotificationSettings } =
    notificationSettingsService.getNotificationSettingsByID(
      "get-notification-settings-by-id",
      user?.notification_setting?.id,
      {
        onSuccess: (response) => {
          if (response.data.success == true) {
            formik.setValues({
              ...formik.values,
              id: response.data.result.notificationSetting.id,
              send_goal_reminder_email: response.data.result.notificationSetting.send_goal_reminder_email,
              send_email_on_appointment_book: response.data.result.notificationSetting.send_email_on_appointment_book,
              send_email_on_appointment_cancel: response.data.result.notificationSetting.send_email_on_appointment_cancel,
            })
          } else {
            formik.setValues({
              ...formik.values,
              id: 0,
              send_goal_reminder_email: false,
              send_email_on_appointment_book: false,
              send_email_on_appointment_cancel: false,
            })
          }
        },
        onError: (error) => {
          formik.setValues({
            ...formik.values,
            id: 0,
            send_goal_reminder_email: false,
            send_email_on_appointment_book: false,
            send_email_on_appointment_cancel: false,
          })
        },
        enabled: !!user?.notification_setting?.id,
      }
    );

  // API call for update settings
  const { mutate: updateSettings, isLoading: isUpdatingSettings } = notificationSettingsService.updateNotificationSettings({
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
  //#endregion
  
  return (
    <Fragment>
      <Helmet>
        <title>Account Settings | {siteInfo.siteLongName}</title>
      </Helmet>
      <Card color="white">
        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>Reminder Settings</CardTitle>
        </CardHeader>
        <CardBody className='py-2 my-25'>
          {
            gettingNotificationSettings ?
            <ModalLoading height={300} />
            :
            <FormikProvider formik={formik}>
            <Form className='mt-2 pt-50' onSubmit={formik.handleSubmit}>
              <div className="row m-1">
                <div className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 mx-auto border rounded">
                  <div className="row">
                    <div className='col-12 mb-1 d-flex align-items-center justify-content-between p-1 border-bottom'>
                      <Label
                        className="form-check-label"
                        htmlFor={`icon-primary-send_email_on_appointment_book`}
                      >
                        Send Email on Appointment Book
                      </Label>
                      <div className="d-flex flex-start form-switch form-check-primary">
                        <Input
                          type="switch"
                          className="ms-1"
                          checked={formik?.values?.send_email_on_appointment_book}
                          id={`icon-primary-send_email_on_appointment_book`}
                          name={`icon-primary-send_email_on_appointment_book`}
                          onChange={(e) => {
                            formik.setValues({
                              ...formik.values,
                              send_email_on_appointment_book: e.target.checked
                            })
                          }}
                        />
                      </div>
                    </div>
                    <div className='col-12 mb-1 d-flex align-items-center justify-content-between p-1 border-bottom'>
                      <Label
                        className="form-check-label"
                        htmlFor={`icon-primary-send_email_on_appointment_cancel`}
                      >
                        Send Email on Appointment Cancel
                      </Label>
                      <div className="d-flex flex-start form-switch form-check-primary">
                        <Input
                          type="switch"
                          className="ms-1"
                          checked={formik?.values?.send_email_on_appointment_cancel}
                          id={`icon-primary-send_email_on_appointment_cancel`}
                          name={`icon-primary-send_email_on_appointment_cancel`}
                          onChange={(e) => {
                            formik.setValues({
                              ...formik.values,
                              send_email_on_appointment_cancel: e.target.checked
                            })
                          }}
                        />
                      </div>
                    </div>
                    <div className='col-12 mb-1 d-flex align-items-center justify-content-between p-1 border-bottom'>
                      <Label
                        className="form-check-label"
                        htmlFor={`icon-primary-send_goal_reminder_email`}
                      >
                        Send Goal Reminder Email
                      </Label>
                      <div className="d-flex flex-start form-switch form-check-primary">
                        <Input
                          type="switch"
                          className="ms-1"
                          checked={formik?.values?.send_goal_reminder_email}
                          id={`icon-primary-send_goal_reminder_email`}
                          name={`icon-primary-send_goal_reminder_email`}
                          onChange={(e) => {
                            formik.setValues({
                              ...formik.values,
                              send_goal_reminder_email: e.target.checked
                            })
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-12 mb-1">
                      <CustomButton
                        type="button"
                        color="primary"
                        block
                        onClick={(e) => {
                          e.preventDefault();
                          formik.handleSubmit();
                        }}
                        disabled={isUpdatingSettings}
                        loading={isUpdatingSettings}
                      >
                        Save Changes
                      </CustomButton>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </FormikProvider>
          }
        </CardBody>
      </Card>
    </Fragment>
  );
}

export default AccountSettings;
