import type { LoginParams } from '@/api/system'

import { Button, Form } from 'antd'
import { Input } from 'antd'
import React from 'react'

import Remember from './Remember'

import classes from './index.module.less'

export interface LoginFormFields extends LoginParams {
  remember?: boolean
}

export interface LoginFormProps {
  extra?: React.ReactNode
  loading: boolean
  onFinish: (values: LoginFormFields) => void
}

const LoginForm = (props: LoginFormProps) => {
  const [form] = Form.useForm()
  const rules = {
    password: [{ message: '请输入密码', required: true }],
    username: [{ message: '请输入账号', required: true }],
  }

  return (
    <Form form={form} layout="vertical" onFinish={props?.onFinish}>
      <Form.Item label="账号" name="username" rules={rules?.username}>
        <Input allowClear placeholder="请输入账号" size="large" />
      </Form.Item>
      <Form.Item extra={props?.extra} label="密码" name="password" rules={rules?.password}>
        <Input.Password allowClear placeholder="请输入密码" size="large" />
      </Form.Item>
      <Form.Item className={classes.mb12}>
        <Button block htmlType="submit" loading={props.loading} type="primary">
          登录
        </Button>
      </Form.Item>
      <Remember className={classes.remember} form={form} />
    </Form>
  )
}

export default LoginForm
