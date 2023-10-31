import React, { useState } from "react";
import { useEffect } from "react";
import { Trash2 } from "react-feather";
import { Button, UncontrolledTooltip, Label, Input } from "reactstrap";

const UploadAndDisplayImage = ({ existingImagePath, imageChanger }) => {
  //#region States
  const [avatar, setAvatar] = useState(null);
  //#endregion

  //#region UseEffects
  useEffect(() => {
    setAvatar(existingImagePath);
  }, [existingImagePath]);
  //#endregion

  return (
    <>
      {avatar && (
        <div className="me-auto">
          <div className="text-end mb-25">
            <Button
              id="removeImage"
              size="sm"
              color="flat-danger"
              className="rounded-circle btn-icon me-auto"
              onClick={() => {
                setAvatar(null);
              }}
            >
              <Trash2 size={15} />
            </Button>
          </div>
          <UncontrolledTooltip placement="top" target="removeImage">
            Remove Selected Image
          </UncontrolledTooltip>
          <div className="text-center">
            <img
              alt="not found"
              width={"250px"}
              height={"250px"}
              style={{ objectFit: "contain" }}
              src={avatar}
            />
          </div>
        </div>
      )}

      {!avatar && (
        <div>
          <div>
            <Label className="form-label label-cs" for="inputFile">
              Image
            </Label>
            <Input
              type="file"
              accept="image/*"
              name="myImage"
              onChange={(e) => {
                const files = e.target.files;
                if (
                  files[0].type !== "image/png" &&
                  files[0].type !== "image/jpeg"
                ) {
                } else {
                  const reader = new FileReader();
                  reader.onload = function () {
                    setAvatar(reader.result);
                    imageChanger(files[0]);
                  };
                  reader.readAsDataURL(files[0]);
                }
              }}
              id="inputFile"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default UploadAndDisplayImage;
