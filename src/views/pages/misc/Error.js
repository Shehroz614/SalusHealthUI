// ** React Imports
import { Link, NavLink } from 'react-router-dom'

// ** Reactstrap Imports
import { Button } from 'reactstrap'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'

// ** Illustrations Imports
import illustrationsLight from '@src/assets/images/pages/error.svg'
import illustrationsDark from '@src/assets/images/pages/error-dark.svg'

// ** Styles
import '@styles/base/pages/page-misc.scss'

// ** Config
import themeConfig from "@configs/themeConfig";

// ** Utils
import { getUserData, getHomeRouteForLoggedInUser } from "@utils";
import { useSelector } from "react-redux";

import { siteInfo } from "@src/constants";

const Error = () => {
  // ** Hooks
  const { skin } = useSkin()

  const user = useSelector((store) => store.auth.user);
  const role = useSelector((state) => state.auth.role);

  const source = skin === 'dark' ? illustrationsDark : illustrationsLight

  return (
    <div className='misc-wrapper'>
      <div className=''>
        <NavLink
          to={user ? getHomeRouteForLoggedInUser(role?.id) : "/"}
          className=""
        >
          <span className="brand-logo d-flex align-items-center">
            <img src={skin == "dark" ? themeConfig.app.appLogoImage : themeConfig.app.appLogoImageDark} alt="logo" width={"35px"} />
            <h4 className='my-auto ms-1'><b>{themeConfig.app.appName}</b></h4>
          </span>
        </NavLink>
      </div>
      
      <div className='misc-inner p-2 p-sm-3'>
        <div className='w-100 text-center'>
          <h2 className='mb-1'>Page Not Found 🕵🏻‍♀️</h2>
          <p className='mb-2'>Oops! 😖 The requested URL was not found on this server.</p>
          <Button tag={Link} to='/' color='primary' className='btn-sm-block mb-2'>
            Back to home
          </Button>
          <img className='img-fluid' src={source} alt='Not authorized page' />
        </div>
      </div>
    </div>
  )
}
export default Error
