import { message } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import LoginForm, { type LoginFormFields } from './LoginForm'
import { removeRememberInfo, setRememberInfo } from './Remember'
import { login } from '@/api/system'
import userInfoStore from '@/stores/user'
import { isUndef } from '@/utils/tools'

import classes from './index.module.less'

const Login = () => {
  const [loading, setLoading] = useState(false)
  const setUserInfo = userInfoStore(state => state.setUserInfo)
  const navigate = useNavigate()

  const onLogin = async (values: LoginFormFields) => {
    try {
      setLoading(true)
      const { data } = await login(values)
      setLoading(false)
      // 记住密码
      if (!isUndef(values?.remember)) {
        values.remember ? setRememberInfo(values) : removeRememberInfo()
      }
      const { token, userInfo } = data
      setUserInfo(token, userInfo)
      message.success('登录成功')
      navigate('/')
    } catch (error: any) {
      setLoading(false)
    }
  }

  return (
    <div className={classes.login}>
      <div className={classes.container}>
        <h1 className={classes.title}>XXX管理系统</h1>
        <LoginForm loading={loading} onFinish={onLogin} />
      </div>
    </div>
  )
}

export default Login
