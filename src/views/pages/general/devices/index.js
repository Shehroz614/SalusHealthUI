//#region imports
import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Row } from "reactstrap";
import { Helmet } from "react-helmet";
import { siteInfo } from "@src/constants";
import { ArrowLeft, ArrowRight, CheckCircle, Phone, Plus } from "react-feather";
import { formatDateToCustomString } from "../../../../utility/Utils";
//#endregion

function DevicesPage() {

  //#region Redux
  const user = useSelector((store) => store.auth.user);
  //#endregion

  return (
    <Fragment>
      <Helmet>
        <title>Devices | {siteInfo.siteLongName}</title>
      </Helmet>
      <Row>
        <Col md="8">
          
        </Col>
        <Col md="3">
         
        </Col>
      </Row>
    </Fragment>
  );
}

export default DevicesPage;
