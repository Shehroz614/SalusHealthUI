import classNames from "classnames";
import React from "react";
import { Alert, Badge } from "reactstrap";

const CustomAlert = ({
  icon = <></>,
  color = "primary",
  border = "top",
  text,
  children,
}) => (
  <Alert color={color} className={classNames(`border-${border}-alert`)}>
    <div
      className={classNames("alert-body", {
        "d-flex align-items-center": !!icon,
      })}
    >
      {!!icon && <div>{icon}</div>}
      {!!text ? (
        <span className="ms-50">{text}</span>
      ) : (
        <div className="ms-50">{children}</div>
      )}
    </div>
  </Alert>
);

export const CustomBadge = ({
  icon = <></>,
  color = "primary",
  border = "top",
  text,
  children,
}) => (
  <Badge color={color} className={classNames(`border-${border}-alert`)}>
    <div className="alert-body d-flex align-items-center">
      <div>{icon}</div>
      {!!text ? (
        <span className="ms-50">{text}</span>
      ) : (
        <div className="ms-50">{children}</div>
      )}
    </div>
  </Badge>
);

export default CustomAlert;
