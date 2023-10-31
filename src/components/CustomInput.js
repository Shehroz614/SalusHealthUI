import {
  Label,
  Input,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import classNames from "classnames";
import { forwardRef, useContext, useState } from "react";
import { FormikContext } from "../context/formik";
import { v4 as uuidv4 } from "uuid";
import { Eye, EyeOff } from "react-feather";
import Cleave from "cleave.js/react";
import "cleave.js/dist/addons/cleave-phone.au";

const CustomInput = forwardRef((props, ref) => {
  const uniqueId = uuidv4();
  const formik = useContext(FormikContext);
  const {
    label,
    name,
    className,
    type,
    requiredField,
    isInputGroup,
    error,
    touched,
    disabled,
    hideIcon,
    showIcon,
    iconSize,
    visible,
    placeholder,
    inputClassName,
    invalid,
    isPhone,
    phoneCode,
    onKeyDown,
    ...rest
  } = props;
  const [inputVisibility, setInputVisibility] = useState(visible);

  // ** Renders Icon Based On Visibility
  const renderIcon = () => {
    const size = iconSize ? iconSize : 14;

    if (inputVisibility === false) {
      return hideIcon ? hideIcon : <Eye size={size} />;
    } else {
      return showIcon ? showIcon : <EyeOff size={size} />;
    }
  };

  return !formik ? (
    <label className="text-danger">FormikProvider is required</label>
  ) : (
    <div>
      {label && (
        <Label for={uniqueId} className="label-cs">
          {label}
          {requiredField && <span className="ms-25 text-danger">*</span>}
        </Label>
      )}
      <InputGroup
        className={classNames({
          [className]: className,

          "is-invalid": formik.touched[name] && formik.errors[name],
          "is-valid": formik.touched[name] && !formik.errors[name],
        })}
      >
        {isPhone && (
          <>
            <InputGroupText className="cursor-pointer">
              {phoneCode}
            </InputGroupText>
            <Cleave
              id="phone-number"
              placeholder={placeholder}
              className={classNames("form-control", className)}
              options={{ phone: true, phoneRegionCode: "AU" }}
              ref={ref}
              value={formik.values[name]}
              disabled={disabled}
              {...formik.getFieldProps(name)}
            />
          </>
        )}
        {!isPhone && (
          <>
            <Input
              onKeyDown={onKeyDown}
              ref={ref}
              {...(label
                ? {
                    id: uniqueId,
                  }
                : {})}
              className={classNames(className)}
              type={inputVisibility === true ? "text" : type}
              placeholder={placeholder ? placeholder : ""}
              {...formik.getFieldProps(name)}
              value={formik.values[name]}
              valid={
                (!error && touched) ||
                (!formik.errors[name] && formik.touched[name])
              }
              invalid={
                (error && touched) ||
                (formik.errors[name] && formik.touched[name])
              }
              {...rest}
              disabled={disabled}
            >
              {props.children}
            </Input>
            {isInputGroup && (
              <InputGroupText
                className="cursor-pointer"
                onClick={() => setInputVisibility(!inputVisibility)}
              >
                {renderIcon()}
              </InputGroupText>
            )}
          </>
        )}
      </InputGroup>

      {formik.errors[name] && formik.touched[name] && (
        <div style={{ display: "block" }} className="invalid-feedback">
          {formik.errors[name]}
        </div>
      )}
    </div>
  );
});
export default CustomInput;
