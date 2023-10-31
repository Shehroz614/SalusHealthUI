import { Button, Spinner } from "reactstrap";
import { forwardRef } from "react";

const CustomButton = forwardRef((props, ref) => {
   const {loading, disabled, size, color, className, ...rest} = props
   return(
    <Button
    disabled={disabled || loading}
    size={size}
    color={color}
    className={className}
    ref={ref}
    {...rest}
    >
        {
            loading ?
            <Spinner color="light" size={"sm"} type="grow">Loading ...</Spinner>
            :
            (props.children ||  "Button")
        }
    </Button>
   )
})

export default CustomButton