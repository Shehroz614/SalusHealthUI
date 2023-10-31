import React, { Fragment } from 'react'
import { FaHistory } from 'react-icons/fa';
import { Card, CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';

export default function LastBoxCard() {
  return (
    <Fragment>
      <Card>
        <CardBody>
          <div className="mb-1">
            <h4 className="plan-summary-text-heading">My last box</h4>
          </div>
          <div className="mb-1">
            {/* <h2 className="plan-box-title">{props.planTitle}</h2> */}
          </div>
          {/* <div className="box-card-status mb-1">
            <p>Delivery date and time:</p>
            <p>{props.deliveryDateTime}</p>
          </div> */}
          <div className="text-center">
            <Link
              className="btn btn-outline-primary"
              to="/order-history"
            >
              <FaHistory className="text-primary me-25" size={18} /> See
              history
            </Link>
          </div>
        </CardBody>
      </Card>
    </Fragment>
  )
}
