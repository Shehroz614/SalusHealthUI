import { Fragment } from "react";
import Select from "react-select";
import { v4 as uuidv4 } from "uuid";

function CustomSelect({
  name,
  options,
  loading,
  placeholder,
  disabled,
  onChange,
  onBlur,
  value,
  styles,
  ...rest
}) {

  //#region States
  const uniqueId = uuidv4();
  const colourStyles = {
    placeholder: (defaultStyles) => {
      return {
        ...defaultStyles,
        color: "#babac4",
      };
    },
    singleValue: (provided, state) => ({
      ...provided,
    }),
    menu: (provided, state) => ({
      ...provided,
      zIndex: 999999
    }),
    control: (provided, state) => ({
      ...provided,
      border: "1px solid #B9B9B9"
    })
  };
  //#endregion

  return (
    <Fragment>
          <Select
            id={uniqueId}
            options={options}
            value={value}
            styles={styles || colourStyles}
            placeholder={placeholder}
            onChange={onChange}
            onBlur={onBlur}
            menuPosition="fixed"
            isLoading={loading}
            isDisabled={disabled}
            {...rest}
          />
    </Fragment>
  );
}

export default CustomSelect;
