// ** React Imports
import { useEffect } from "react";
import { Link } from "react-router-dom";

// ** Icons Imports
import { Disc, X, Circle } from "react-feather";

// ** Config
import themeConfig from "@configs/themeConfig";

// ** Utils
import { getUserData, getHomeRouteForLoggedInUser } from "@utils";
import { useSelector } from "react-redux";
import { useSkin } from "@hooks/useSkin";

const VerticalMenuHeader = (props) => {
  // ** Props
  const {
    menuCollapsed,
    setMenuCollapsed,
    setMenuVisibility,
    setGroupOpen,
    menuHover,
  } = props;

  // ** Vars
  const user = useSelector((store) => store.auth.user);
  const { skin } = useSkin();

  // ** Reset open group
  useEffect(() => {
    if (!menuHover && menuCollapsed) setGroupOpen([]);
  }, [menuHover, menuCollapsed]);

  // ** Menu toggler component
  const Toggler = () => {
    if (!menuCollapsed) {
      return (
        <Disc
          size={20}
          data-tour="toggle-icon"
          className="text-white toggle-icon d-none d-xl-block"
          onClick={() => setMenuCollapsed(true)}
        />
      );
    } else {
      return (
        <Circle
          size={20}
          data-tour="toggle-icon"
          className="text-white toggle-icon d-none d-xl-block"
          onClick={() => setMenuCollapsed(false)}
        />
      );
    }
  };

  return (
    <div className="navbar-header">
      <ul className="nav navbar-nav flex-row">
        <li className="nav-item me-auto">
          <Link to="/" className="navbar-brand">
            <span className="brand-logo">
              {(menuCollapsed && menuHover) || !menuCollapsed ? 
                <img src={themeConfig.app.appLogoImageDashboard} alt="logo" 
                  style={{ transform: "translateY(-0.5rem)"}}
                />
              : (
                <img
                  src={
                    skin == "dark"
                      ? themeConfig.app.appLogoImageDashboard
                      : themeConfig.app.appLogoImageDashboard
                  }
                  alt="logo"
                  style={{
                    maxWidth: "30px",
                    objectFit: "fill",
                    objectPosition: "center",
                    scale: "2",
                    paddingTop: "0.2rem",
                  }}
                />
              )}
            </span>
            {/* <h2 className="brand-text text-dark mb-0">
              {themeConfig.app.appName}
            </h2> */}
          </Link>
        </li>
        <li className="nav-item nav-toggle">
          <div className="nav-link modern-nav-toggle cursor-pointer">
            <Toggler />
            <X
              onClick={() => setMenuVisibility(false)}
              className="toggle-icon icon-x d-block d-xl-none"
              size={20}
            />
          </div>
        </li>
      </ul>
    </div>
  );
};

export default VerticalMenuHeader;
