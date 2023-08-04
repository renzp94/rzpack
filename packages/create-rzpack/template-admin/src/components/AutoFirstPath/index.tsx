import React from 'react'
import { Navigate, useLocation, useMatch } from 'react-router-dom'

import useRouterStore from '@/stores/router'

export interface AutoFirstPathProps {
  children: React.ReactNode
}

const AutoFirstPath = (props: AutoFirstPathProps) => {
  const location = useLocation()
  const [firstPath, userRoutes] = useRouterStore(state => [state.firstPath, state.userRoutes])
  const isFirstPath = useMatch(firstPath)
  const isGoToFirstPath =
    firstPath && !isFirstPath && !userRoutes.some(item => item.path === location.pathname)

  return isGoToFirstPath ? <Navigate replace to={firstPath} /> : <>{props.children}</>
}

export default AutoFirstPath
