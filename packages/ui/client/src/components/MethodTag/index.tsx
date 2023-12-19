import { Tag } from 'antd'
import { Method } from 'axios'
import React from 'react'

export interface MethodTagProps {
  method: Method
}

const MethodTag = ({ method }: MethodTagProps) => {
  const colors = {
    DELETE: 'error',
    GET: 'success',
    POST: 'processing',
    PUT: 'warning',
  }

  return <Tag color={colors[method]}>{method}</Tag>
}

export default MethodTag
