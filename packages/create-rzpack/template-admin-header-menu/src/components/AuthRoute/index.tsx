import React from 'react'
import { Navigate, useMatch } from 'react-router-dom'

import storage, { TOKEN } from '@/utils/storage'

export interface AuthRouteProps {
  children: React.ReactNode
}

const AuthRoute = (props: AuthRouteProps) => {
  const isLogin = storage.get(TOKEN)
  const isLoginPath = useMatch('/login') || window.location.hash.includes('#/login')

  if (!isLogin && !isLoginPath) {
    const redirectUrl = window.location.hash.replace('#', '')
    const url = `/login${redirectUrl && redirectUrl !== '/' ? `?redirectUrl=${redirectUrl}` : ''}`
    return <Navigate to={url} replace />
  }

  return <>{props.children}</>
}

export default AuthRoute
