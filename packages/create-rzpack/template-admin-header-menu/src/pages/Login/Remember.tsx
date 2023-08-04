import type { FormInstance, FormItemProps } from 'antd'

import { Checkbox, Form } from 'antd'
import React from 'react'
import { useEffect } from 'react'

import storage, { REMEMBER_INFO } from '@/utils/storage'

import classes from './index.module.less'

interface RememberProps extends FormItemProps {
  form: FormInstance
}

const Remember = (props: RememberProps) => {
  const { form, ...formItemProps } = props ?? {}
  useEffect(() => {
    const rememberInfo = getRememberInfo()
    if (rememberInfo) {
      form.setFieldsValue(rememberInfo)
    }
  }, [form])

  return (
    <Form.Item name="remember" valuePropName="checked" {...formItemProps}>
      <Checkbox style={{ borderRadius: 4 }}>
        <div className={classes.remember}>记住密码</div>
      </Checkbox>
    </Form.Item>
  )
}

export const setRememberInfo = (values: unknown) => {
  const encodeInfo = window.btoa(JSON.stringify(values))
  storage.set(REMEMBER_INFO, encodeInfo)
}
export const getRememberInfo = () => {
  let info = storage.get(REMEMBER_INFO)
  if (info && typeof info === 'string') {
    info = JSON.parse(window.atob(info as string))
  }

  return info
}
export const removeRememberInfo = () => storage.remove(REMEMBER_INFO)

export default Remember
