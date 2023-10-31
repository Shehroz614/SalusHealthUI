import { Spinner } from "reactstrap";

function ModalLoading({height, color}){

    //#region States
    const fixedHieght = 300
    //#endregion

    return(
        <div className="d-flex justify-content-center mt-5" style={{height: height ? height : fixedHieght}}>
            <Spinner color={color ? color : "primary"} />
        </div>
    )
}

export default ModalLoading