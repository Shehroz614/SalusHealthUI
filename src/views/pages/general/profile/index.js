//#region imports
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet";
import { siteInfo } from "@src/constants";
//#endregion

// ** Third Party Components
import { useFormik } from "formik";
import CustomInput from "../../../../components/CustomInput";
import CustomSelect from "../../../../components/CustomSelect";
import CustomButton from "../../../../components/CustomButton";

// ** Reactstrap Imports
import {
  Row,
  Col,
  Form,
  Card,
  Input,
  Label,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
  FormFeedback,
  Spinner,
} from "reactstrap";
import FormikProvider from "../../../../context/formik";
import * as Yup from "yup";

import BlankAvatar from "../../../../assets/images/avatars/avatar-blank.png";
import {
  Edit,
  Edit2,
  RefreshCw,
  RotateCcw,
  Save,
  Trash2,
  User,
} from "react-feather";
import { FormCheck } from "react-bootstrap";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import momentTimeZone from "moment-timezone";
import {
  SweetAlert,
  SweetAlertWithValidation,
} from "../../../../components/SweetAlert";
import { userService } from "../../../../services/userService";
import { getMeAndSaveUserState } from "../../../../redux/authentication";
import { isString } from "lodash";
import { Switch } from "@mui/material";
import { motion } from "framer-motion";
//#region Constants
const timeZones = momentTimeZone.tz.names()?.map((item) => {
  return {
    label: item,
    value: item,
  };
});
//#endregion

function index() {
  //#region Redux
  const dispatch = useDispatch();
  const user = useSelector((store) => store.auth.user);
  //#endregion
  const [avatar, setAvatar] = useState(user.avatar_url || BlankAvatar);
  const avatarRef = useRef(null);
  const [imageUploading, setImageUploading] = useState(null);
  const [editMode, setEditMode] = useState(false);

  console.log(user);

  //#region formik
  const initialValues = {
    first_name: "",
    last_name: "",
    full_name: "",
    phone_number: "",
    email: "",
    password: "",
    confirm_password: "",
    current_password: "",
    timezoneID: "",
    change_password: false,
  };

  const validationSchema = Yup.object().shape({
    first_name: Yup.string()
      .required("First Name is required")
      .matches(/^[a-zA-Z\s]*$/, "Invalid characters in First Name"),

    last_name: Yup.string()
      .required("Last Name is required")
      .matches(/^[a-zA-Z\s]*$/, "Invalid characters in Last Name"),

    full_name: Yup.string()
      .required("Last Name is required")
      .matches(/^[a-zA-Z\s]*$/, "Invalid characters in Last Name"),

    phone_number: Yup.string()
      .nullable()
      .required("Phone Number is required")
      .matches(/^\d+$/, "Phone Number must contain only digits"),

    email: Yup.string()
      .required("Email is required")
      .email("Invalid email address"),

    change_password: Yup.boolean(),

    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .test(
        "password-not-equal-to-current",
        "New password cannot be the same as the current password",
        function (value) {
          if (value?.length > 0) {
            const currentPassword = this.parent.current_password;
            return value !== currentPassword;
          }
          return true;
        }
      ),

    current_password: Yup.string().when("password", {
      is: (val) => val && val.length > 0,
      then: Yup.string().required("Current Password is required"),
    }),
    confirm_password: Yup.string().when("password", {
      is: (val) => (val && val.length > 0 ? true : false),
      then: Yup.string()
        .required("Confirm Password is required")
        .oneOf([Yup.ref("password")], "Both password need to be the same"),
    }),

    timezoneID: Yup.string().required("Timezone is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (v) => {
      const payload = {
        first_name: v.first_name,
        last_name: v.last_name,
        full_name: v.full_name,
        phone_number: v.phone_number,
        timezone: v.timezoneID,
        password: v.password,
        password_confirmation: v.confirm_password,
        current_password: v.current_password,
        avatar_string: avatar,
      };

      if (!v.password) {
        delete payload.password;
        delete payload.password_confirmation;
        delete payload.current_password;
      }

      if (avatar == user.avatar_url) {
        delete payload.avatar_string;
      }

      updateProfile(payload);
    },
  });
  //#endregion

  //#region Event Handlers
  // API call for update profile
  const { mutate: updateProfile, isLoading: isUpdatingProfile } =
    userService.updateProfile({
      onSuccess: async (response) => {
        if (response?.data?.success == true) {
          SweetAlert("success", response?.data?.message);
          dispatch(getMeAndSaveUserState());
        } else {
          const errs = response?.data?.result;
          if (errs?.length > 0 && !isString(errs)) {
            SweetAlertWithValidation(errs);
            return;
          } else {
            const errMsg = response.data.message;
            SweetAlert("error", errMsg);
          }
        }
        setImageUploading(false);
      },
      onError: (error) => {
        SweetAlert(
          "error",
          error?.response?.data?.message ||
            error?.response?.data?.title ||
            error?.message
        );
        setImageUploading(false);
      },
      networkMode: "always",
    });

  const updateAvatar = (src) => {
    const reader = new FileReader();
    reader.onload = function () {
      setAvatar(reader.result);
      setImageUploading(true);
      updateProfile({ ...user, avatar_string: reader.result });
    };
    reader.readAsDataURL(src);
  };

  const createFileFromImageSource = (imageSrc, fileName, mimeType) => {
    return fetch(imageSrc)
      .then((response) => response.blob())
      .then((blob) => {
        // Create a File object from the Blob
        return new File([blob], fileName, { type: mimeType });
      })
      .catch((error) => {
        console.error("Error creating File from image source:", error);
      });
  };

  const handleImgReset = async () => {
    updateAvatar(
      await createFileFromImageSource(BlankAvatar, "blank", "image/jpeg")
    );
  };

  const onChange = (e) => {
    updateAvatar(e.target.files?.[0]);
  };
  //#endregion

  const initUser = () => {
    formik.resetForm();
    if (user) {
      formik.setValues({
        ...formik.values,
        first_name: user?.first_name,
        last_name: user?.last_name,
        full_name: user?.full_name,
        phone_number: user?.phone_number,
        email: user?.email,
        timezoneID: user?.timezone,
        avatar: user?.avatar_url,
        password: "",
        change_password: false,
        confirm_password: "",
        current_password: "",
      });

      setAvatar(user?.avatar_url);
    }
  };

  //#region UseEffects
  useEffect(() => {
    initUser();
  }, [user]);
  //#endregion

  const handleEditClick = () => {
    console.log("clicked", avatarRef?.current);
    avatarRef?.current?.click();
  };

  return (
    <Fragment>
      <Helmet>
        <title>Profile | {siteInfo.siteLongName}</title>
      </Helmet>
      <div className="mx-auto" style={{ width: "80%" }}>
        <Row>
          <Card
            color="white"
            className="border rounded"
            style={{ marginLeft: "12px" }}
          >
            <CardBody className="py-2 my-25">
              <div className="d-flex justify-content-between align-items-start">
                <div className="d-flex">
                  <div className="me-25">
                    <img
                      className="rounded me-50"
                      src={avatar}
                      alt="Generic placeholder image"
                      height="100"
                      width="100"
                    />
                  </div>
                  <div className="d-flex flex-column justify-content-center mt-75 ms-1">
                    <h4 className="m-0 p-0">
                      {user?.first_name + " " + user?.last_name}
                    </h4>
                    <span style={{ color: "gray" }}>{user?.email}</span>
                    <div
                      className="d-flex align-items-center gap-25"
                      style={{
                        position: "absolute",
                        right: "20px",
                        top: "20px",
                        backgroundColor: "#ccc",
                        borderRadius: "50%",
                        cursor: "pointer",
                        opacity:"0.5"
                      }}
                    >
                      {!imageUploading && (
                        <Edit2
                          tag={Label}
                          size="24px"
                          color="gray"
                          style={{ padding: "5px" }}
                          disabled={imageUploading || isUpdatingProfile}
                          onClick={handleEditClick}
                        />
                      )}
                      {imageUploading && (
                        <Spinner
                          style={{ backgroundColor: "white" }}
                          size={"sm"}
                        />
                      )}
                      <input
                        ref={avatarRef}
                        type="file"
                        onChange={onChange}
                        hidden
                        accept="image/*"
                      />
                    </div>
                    {/* <div className="d-flex align-items-center gap-25">
                  <Button
                    tag={Label}
                    className="mb-75 me-75 gap-50 d-flex align-items-center"
                    size="sm"
                    color="primary"
                    disabled={imageUploading || isUpdatingProfile}
                  >
                    {imageUploading ? (
                      <Spinner size={"sm"} />
                    ) : (
                      <RefreshCw size={16} />
                    )}{" "}
                    Change
                    <Input
                      ref={avatarRef}
                      type="file"
                      onChange={onChange}
                      hidden
                      accept="image/*"
                    />
                  </Button>
                  <Button
                    className="mb-75 me-75 gap-50 d-flex align-items-center"
                    color="secondary"
                    size="sm"
                    disabled={imageUploading || isUpdatingProfile}
                    outline
                    onClick={handleImgReset}
                  >
                    <RotateCcw size={16} />
                    Reset
                  </Button>
                </div> */}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Row>
        <FormikProvider formik={formik}>
          <Form className="mt-2 pt-50">
            <Row>
              <Card color="white mx-1" className="border rounded">
                <CardBody className="py-2 my-25">
                  <Col sm="6" className="mb-1 d-flex gap-1">
                    <Label htmlFor="full_name" className="label-cs w-50 wmin">
                      Full Name
                      <span className="ms-25 text-danger">*</span>
                    </Label>
                    <CustomInput
                      name="full_name"
                      // label="Full Name"
                      placeholder="John Allen"
                      disabled={editMode}
                      // className="w-100"
                    style={{width:"225px"}}

                    />
                  </Col>
                  <Col sm="6" className="mb-1 d-flex gap-1">
                    <Label htmlFor="email" className="label-cs w-50 wmin">
                      Email
                      <span className="ms-25 text-danger">*</span>
                    </Label>
                    <CustomInput
                      name="email"
                      // label="Email"
                      placeholder="john@example.com"
                      // className="w-100"
                      disabled={true}
                      requiredField
                      style={{width:"225px"}}

                    />
                  </Col>
                  <Col sm="6" className="mb-1 d-flex gap-1">
                    <Label htmlFor="phone_number" className="label-cs w-100 wmin">
                      Phone Number <span className="ms-25 text-danger">*</span>
                    </Label>
                    <PhoneInput
                      international
                      name="phone_number"
                      className={` input-group myInput ${
                        formik.touched.phone_number &&
                        formik.errors.phone_number
                          ? "border-danger"
                          : ""
                      } ${editMode ? "bg-disabled" : ""} ${
                        formik.touched.phone_number &&
                        formik.errors.phone_number
                          ? "is-invalid"
                          : ""
                      } ${
                        formik.touched.phone_number &&
                        !formik.errors.phone_number
                          ? "is-valid"
                          : ""
                      } w-225`}
                      type="tel"
                      specialLabel=""
                      copyNumbersOnly={false}
                      value={"+" + formik.values.phone_number}
                      onChange={(phone) => {
                        formik.setValues({
                          ...formik?.values,
                          phone_number: phone?.replace(/\+/g, ""),
                        });
                        formik.setFieldTouched("phone_number", true);
                      }}
                      onBlur={formik.handleBlur}
                      placeholder="xxxxxxxx"
                      disabled={editMode}
                      disableInitialCountryGuess={false}
                    style={{width:"225px"}}
                    />
                    {formik.errors.phone_number &&
                      formik.touched.phone_number && (
                        <div
                          style={{ display: "block" }}
                          className="invalid-feedback"
                        >
                          {formik.errors.phone_number}
                        </div>
                      )}
                  </Col>
                  <Col sm="6" className="mb-1 d-flex gap-1">
                    <Label htmlFor="timezoneID" className="label-cs w-100 wmin">
                      Timezone <span className="ms-25 text-danger">*</span>
                    </Label>
                    <CustomSelect
                      name="timezoneID"
                      placeholder="Select Timezone"
                      className="w-225"
                    style={{width:"225px"}}
                      value={timeZones?.find(
                        (obj) => obj?.value == formik?.values?.timezoneID
                      )}
                      onChange={(obj) => {
                        formik.setFieldValue("timezoneID", obj?.value);
                      }}
                      onBlur={() => {
                        formik.setFieldTouched("timezoneID", true);
                      }}
                      options={timeZones}
                      disabled={editMode}
                      requiredField
                      isClearable
                    />
                    {formik.errors.timezoneID && formik.touched.timezoneID && (
                      <div
                        style={{ display: "block" }}
                        className="invalid-feedback"
                      >
                        {formik.errors.timezoneID}
                      </div>
                    )}
                  </Col>
                </CardBody>
              </Card>
              <Card color="white mx-1" className="border rounded">
                <CardBody className="py-2 my-25">
                  <Col sm="12" className="mb-1">
                    <Switch
                      id="change_password_switch"
                      name="change_password"
                      checked={formik.values.change_password}
                      onChange={(e) => {
                        if (!e.target.checked) {
                          formik.setFieldValue("current_password", "");
                          formik.setFieldValue("confirm_password", "");
                          formik.setFieldValue("password", "");
                          formik.setFieldTouched("current_password", false);
                          formik.setFieldTouched("confirm_password", false);
                          formik.setFieldTouched("password", false);
                          formik.setFieldError("current_password", "");
                          formik.setFieldError("confirm_password", "");
                          formik.setFieldError("password", "");
                        }
                        formik.setFieldValue(
                          "change_password",
                          e.target.checked
                        );
                      }}
                    />
                    <Label for="change_password_switch">Change password</Label>
                  </Col>
                  {formik?.values?.change_password && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }} // Initial state (hidden and above)
                      animate={{ opacity: 1, y: 0 }} // Animation state (visible and at its original position)
                      exit={{ opacity: 0, y: -20 }} // Exit state (hidden and above)
                      transition={{ duration: 0.3 }} // Animation duration
                    >
                      <Col sm="12">
                        <Row>
                          <Col sm="4" className="mb-1">
                            <CustomInput
                              name="password"
                              label="New Password"
                              placeholder="********"
                              type="password"
                              autoFocus
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val == "") {
                                  formik.setValues({
                                    ...formik?.values,
                                    password: "",
                                    confirm_password: "",
                                    current_password: "",
                                  });

                                  formik.setFieldTouched(
                                    "confirm_password",
                                    false
                                  );
                                  formik.setFieldTouched(
                                    "current_password",
                                    false
                                  );
                                } else {
                                  formik.setValues({
                                    ...formik?.values,
                                    password: val,
                                  });
                                }
                              }}
                              visible={false}
                              isInputGroup={!editMode}
                              disabled={editMode}
                              requiredField
                            />
                          </Col>
                          <Col sm="4" className="mb-1">
                            <CustomInput
                              name="confirm_password"
                              label="Confirm Password"
                              placeholder="********"
                              type="password"
                              visible={false}
                              isInputGroup={!editMode}
                              disabled={editMode}
                              requiredField
                            />
                          </Col>
                          <Col sm="4" className="mb-1">
                            <CustomInput
                              name="current_password"
                              label="Current Password"
                              placeholder="********"
                              type="password"
                              visible={false}
                              isInputGroup={!editMode}
                              disabled={editMode}
                              requiredField
                            />
                          </Col>
                        </Row>
                      </Col>
                    </motion.div>
                  )}
                </CardBody>
              </Card>
              <Col
                    sm="12"
                    hidden={editMode}
                    className="mt-2 d-flex align-items-center"
                  >
                    <CustomButton
                      type="button"
                      color="primary"
                      className="me-1"
                      onClick={(e) => {
                        e.preventDefault();
                        formik.handleSubmit();
                      }}
                      disabled={isUpdatingProfile || imageUploading}
                      loading={isUpdatingProfile && !imageUploading}
                      style={{marginLeft:"auto"}}
                    >
                      Save Changes
                    </CustomButton>
                    <Button
                      color="secondary"
                      className="gap-50 d-flex align-items-center"
                      disabled={isUpdatingProfile || imageUploading}
                      outline
                      onClick={() => initUser()}
                    >
                      <Trash2 size={16} />
                      Discard
                    </Button>
                  </Col>
            </Row>
          </Form>
        </FormikProvider>
      </div>
    </Fragment>
  );
}

export default index;
