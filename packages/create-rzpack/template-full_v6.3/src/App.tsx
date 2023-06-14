import { useEffect } from 'react'
import React, { useRef } from 'react'
import { useMatch, useRoutes } from 'react-router-dom'

import { CenterSpin } from './components'
import { mergeUserRoutes } from './router'
import useRouterStore from './stores/router'
import storage, { TOKEN } from './utils/storage'
import userInfoStore from '@/stores/user'

const App = () => {
  const isLogin = useMatch('/login')
  const refreshUserInfo = userInfoStore(state => state.refreshUserInfo)
  const { getUserAuths, loading, userRoutes } = useRouterStore(state => ({
    getUserAuths: state.getUserAuths,
    loading: state.loading,
    userRoutes: state.userRoutes,
  }))
  // 此处将信息请求缓存，防止useEffect进入死循环
  const refreshWebData = useRef(() => {
    refreshUserInfo()
    getUserAuths()
  })

  useEffect(() => {
    const token = storage.get(TOKEN)
    if (!isLogin && token) {
      refreshWebData.current()
    }
  }, [isLogin])

  const routeComponents = useRoutes(mergeUserRoutes(userRoutes))

  return !loading ? routeComponents : <CenterSpin />
}

export default App
