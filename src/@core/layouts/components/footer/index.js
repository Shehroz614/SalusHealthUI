// ** Icons Import
import { Heart } from "react-feather";
import { Link } from "react-router-dom";
import { siteInfo } from "@src/constants";

const Footer = () => {
  return (
    <small className="clearfix mb-0">
      <span className="float-md-start d-block d-md-inline-block mt-25">
        COPYRIGHT © {new Date().getFullYear()}{" "}
        <Link to="/" rel="noopener noreferrer">
          {siteInfo?.siteLongName}
        </Link>
        <span className="d-none d-sm-inline-block">, All rights reserved</span>
      </span>
      {/* <span className='float-md-end d-none d-md-block'>
        Hand-crafted & Made with
        <Heart size={14} />
      </span> */}
    </small>
  );
};

export default Footer;
