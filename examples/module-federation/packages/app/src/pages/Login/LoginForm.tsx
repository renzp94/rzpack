import type { LoginParams } from '@/api/system'
import React from 'react'
import { Input } from 'antd'
import { Button, Form } from 'antd'
import Remember from './Remember'
import classes from './index.module.less'

export interface LoginFormFields extends LoginParams {
  remember?: boolean
}

export interface LoginFormProps {
  loading: boolean
  extra?: React.ReactNode
  onFinish: (values: LoginFormFields) => void
}

const LoginForm = (props: LoginFormProps) => {
  const [form] = Form.useForm()
  const rules = {
    username: [{ required: true, message: '请输入账号' }],
    password: [{ required: true, message: '请输入密码' }],
  }

  return (
    <Form form={form} layout="vertical" onFinish={props?.onFinish}>
      <Form.Item name="username" label="账号" rules={rules?.username}>
        <Input size="large" placeholder="请输入账号" allowClear />
      </Form.Item>
      <Form.Item name="password" label="密码" rules={rules?.password} extra={props?.extra}>
        <Input.Password size="large" placeholder="请输入密码" allowClear />
      </Form.Item>
      <Form.Item className={classes.mb12}>
        <Button type="primary" htmlType="submit" loading={props.loading} block>
          登录
        </Button>
      </Form.Item>
      <Remember className={classes.remember} form={form} />
    </Form>
  )
}

export default LoginForm
