import React from "react";
import { Check, X } from "react-feather";
import { Button, Card, CardBody } from "reactstrap";
import PlanBox from "../../boxes/planBox/PlanBox";

const ChoosePlanBoxCard = ({ plan, selectedPlan, onSelect }) => {
  return (
    <>
      <Card className="border choose-plan-main-wrapper">
        <CardBody>
          <PlanBox
            id={plan?.id}
            showImage={true}
            imagePath={plan?.imagePath}
            price={plan?.price}
            boxTitle={plan?.name}
            itemsType={plan?.itemsType}
            sufficientFor={plan?.sufficientFor}
            qtyProduce={plan?.qtyOfProduceKg}
            noOfVarieties={plan?.noOfVarieties}
            isMealDonated={plan?.isMealDonated}
          />
          <div>
            {selectedPlan === plan?.uniqueID ? (
              <Button
                color="secondary"
                className="w-100 d-flex align-items-center justify-content-center"
              >
                <X size={18} className="me-25" />
                <span>Unselect</span>
              </Button>
            ) : (
              <Button
                color="primary"
                className="w-100 d-flex align-items-center justify-content-center"
                onClick={() => onSelect(plan)}
              >
                <Check size={18} className="me-25" />
                <span>Select</span>
              </Button>
            )}
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default ChoosePlanBoxCard;
