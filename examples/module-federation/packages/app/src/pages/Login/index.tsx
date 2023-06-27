import React, { useState } from 'react'
import classes from './index.module.less'
import LoginForm, { LoginFormFields } from './LoginForm'
import { removeRememberInfo, setRememberInfo } from './Remember'
import { isUndef } from '@/utils/tools'
import userInfoStore from '@/stores/user'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { login } from '@/api/system'

const Login = () => {
  const [loading, setLoading] = useState(false)
  const setUserInfo = userInfoStore((state) => state.setUserInfo)
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
      const { userInfo, token } = data
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
