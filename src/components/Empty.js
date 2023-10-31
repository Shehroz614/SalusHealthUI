function Empty({text, ...props}) {
  return (
    <div className={props?.className}>
      <div className="d-flex justify-content-center">
        {!!props.cart ? (
          <>
            <img
              style={{ height: 80 }}
              className="img-fluid"
              src={"/assets/images/empty-cart.png"}
            ></img>
          </>
        ) : (
          <>
            <img
              style={{ height: 80 }}
              className="img-fluid"
              src={"/assets/images/no-data.png"}
            ></img>
          </>
        )}
      </div>
      <h4 style={{ marginTop: 20, color: '#82868b' }} className="text-center">
        {text ? text : "No Data"}
      </h4>
    </div>
  );
}

export default Empty;
