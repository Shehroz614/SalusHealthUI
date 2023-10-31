// ** Dropdowns Imports
import UserDropdown from "./UserDropdown";
import { Badge, Button, NavItem, NavLink, Spinner } from "reactstrap";
import { Sun, Moon, X } from "react-feather";

const NavbarUser = (props) => {

  const { skin, setSkin } = props;


  // ** Function to toggle Theme (Light/Dark)
  const ThemeToggler = () => {
    if (skin === "dark") {
      return <Sun className="ficon" onClick={() => setSkin("light")} />;
    } else {
      return <Moon className="ficon" onClick={() => setSkin("dark")} />;
    }
  };

  return (
    <ul className="nav navbar-nav align-items-center ms-auto" >
      {/* <NavItem className="d-none d-lg-block">
        <NavLink className="nav-link-style">
          <ThemeToggler />
        </NavLink>
      </NavItem> */}
      <UserDropdown />
    </ul>
  );
};
export default NavbarUser;
