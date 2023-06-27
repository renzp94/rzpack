import React from 'react'
import storage, { TOKEN } from '@/utils/storage'
import { Navigate, useMatch } from 'react-router-dom'

export interface AuthRouteProps {
  children: React.ReactNode
}

const AuthRoute = (props: AuthRouteProps) => {
  const isLogin = storage.get(TOKEN)
  const isLoginPath = useMatch('/login')

  if (!isLogin && !isLoginPath) {
    return <Navigate to="/login" replace />
  }

  return <>{props.children}</>
}

export default AuthRoute
