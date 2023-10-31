// ** Router imports
import { lazy, useEffect } from 'react'

// ** Router imports
import { useRoutes, Navigate, useLocation } from 'react-router-dom'

// ** Layouts
import BlankLayout from '@layouts/BlankLayout'

// ** Hooks Imports
import { useLayout } from '@hooks/useLayout'

// ** Utils
import { getUserData, getHomeRouteForLoggedInUser, hasTokenExpired } from '../utility/Utils'

// ** GetRoutes
import { getRoutes } from './routes'
import { useSelector, useDispatch } from 'react-redux'

import { handleLogin, handleLogout, handleUser } from '../redux/authentication'
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'

// ** Components
const Error = lazy(() => import('../views/pages/misc/Error'))
const Login = lazy(() => import('../views/pages/authentication/Login'))
const NotAuthorized = lazy(() => import('../views/pages/misc/NotAuthorized'))

const Router = () => {

  //#region Redux
  const dispatch = useDispatch();
  const user = useSelector((store) => store.auth.user);
  const role = useSelector((state) => state.auth.role);
  const tokenExpiryTime = useSelector((store) => store.auth.tokenExpiryTime);
  //#endregion Redux

  // ** Hooks
  const location = useLocation();
  const navigate = useNavigate();
  const { layout } = useLayout()

  const allRoutes = getRoutes(layout)
  const getHomeRoute = () => {
    if (user) {
      return getHomeRouteForLoggedInUser(role?.id)
    } else {
      return '/login'
    }
  }

  const routes = useRoutes([
    {
      path: '/',
      index: true,
      element: <Navigate replace to={getHomeRoute()} />
    },
    // {
    //   path: '/login',
    //   element: <BlankLayout />,
    //   children: [{ path: '/login', element: <Login /> }]
    // },
    // {
    //   path: '/auth/not-auth',
    //   element: <BlankLayout />,
    //   children: [{ path: '/auth/not-auth', element: <NotAuthorized /> }]
    // },
    {
      path: '*',
      element: <BlankLayout />,
      children: [{ path: '*', element: <Navigate to={getHomeRoute()} replace={true} state={{ prevPath: location.pathname }} /> }]
    },
    ...allRoutes
  ])
  //#region UseEffects
  useEffect(() => {
    if(user?.id > 0){
      if(hasTokenExpired(tokenExpiryTime)){
        dispatch(handleLogout());
        localStorage.clear();
        navigate("/");
        Swal.fire({
          icon: "info",
          text: "Session Expired! Please login again.",
          allowOutsideClick: false,
          confirmButtonText: 'Ok'
        })
      }
    }
  });
  //#endregion UseEffects

  return routes
}

export default Router
