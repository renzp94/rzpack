import { useMatch, useRoutes } from 'react-router-dom'
import { mergeUserRoutes } from './router'
import React, { useRef } from 'react'
import userInfoStore from '@/stores/user'
import { useEffect } from 'react'
import useRouterStore from './stores/router'
import { CenterSpin } from './components'
import storage, { TOKEN } from './utils/storage'

const App = () => {
  const isLogin = useMatch('/login')
  const refreshUserInfo = userInfoStore(state => state.refreshUserInfo)
  const { loading, getUserAuths, userRoutes } = useRouterStore(state => ({
    getUserAuths: state.getUserAuths,
    userRoutes: state.userRoutes,
    loading: state.loading,
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
