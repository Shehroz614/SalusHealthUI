import React from "react";
import { Link } from "react-router-dom";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import { AllEnums } from "../../../../constants/enums";

export default function PlanInfoModal({ show, stateChanger, plan }) {
  return (
    <Modal
      isOpen={show}
      toggle={() => {
        stateChanger(!show);
      }}
      className="modal-dialog-centered box-detail-modal"
      // onClosed={() => setCardType("")}
      size="sm"
      scrollable
    >
      <ModalHeader
        className="bg-transparent"
        toggle={() => {
          stateChanger(!show);
        }}
      ></ModalHeader>
      <ModalBody className="px-sm-2 mx-50">
        <div className="choose-box-img-wrapper mb-2 p-1 bg-white">
          <img
            src={plan?.imagePath || "/assets/images/default-plan-img.png"}
            className="img-fluid"
          ></img>
        </div>
        <div className=" d-flex align-items-start justify-content-between">
          <h3 className="choose-box-title mb-0">
            {plan?.boxTitle}

            <span className="sub-heading-plan-info ms-50">
              {plan?.itemsType == AllEnums.SelectPlan_WhatToEat.FruitAndVeg
                ? "(Fruit and Veg)"
                : plan?.itemsType == AllEnums.SelectPlan_WhatToEat.FruitOnly
                ? "(Fruit Only)"
                : plan?.itemsType == AllEnums.SelectPlan_WhatToEat.VegOnly
                ? "(Veg Only)"
                : ""}
            </span>
          </h3>

          <p className="mb-25 choose-box-price-tag text-dark mt-25">
            ${plan?.price / 100}
          </p>
        </div>
        <div className="choose-box-content">
          <div>
            <div className="mb-1">
              <h4>Perfect for:</h4>
              <ul className="text-dark">
                <li>{plan?.sufficientFor} person</li>
              </ul>
            </div>
            <div className="mb-2">
              <h4>Box Includes:</h4>
              <ul className="text-dark">
                <li>{plan?.qtyProduce} kg fresh produce</li>
                <li>{plan?.noOfVarieties} different varieties</li>
                {plan?.isMealDonated && (
                  <li>Meals donated with every box (i)</li>
                )}
                {plan?.isOrganic && <li>Organic</li>}
              </ul>
            </div>
            {/* <div className="text-center mt-1">
              <Link
                to="#"
                role="button"
                onClick={() => {
                  stateChanger(!show);
                }}
                className="summary-link"
              >
                Go back
              </Link>
            </div> */}
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}
