// ** React Imports
import { Suspense } from 'react'
import { Navigate } from 'react-router-dom'

// ** Utils
import { getUserData, getHomeRouteForLoggedInUser } from '@utils'
import { useSelector } from 'react-redux'

const PublicRoute = ({ children, route }) => {
  if (route) {
    const user = useSelector((store) => store.auth.user);
    const role = useSelector((state) => state.auth.role);

    const restrictedRoute = route.meta && route.meta.restricted

    if (user && restrictedRoute) {
      return <Navigate to={getHomeRouteForLoggedInUser(role?.id)} />
    }
  }

  return <Suspense fallback={null}>{children}</Suspense>
}

export default PublicRoute
