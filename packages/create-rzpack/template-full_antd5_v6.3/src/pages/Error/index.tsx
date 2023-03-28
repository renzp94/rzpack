import { Button, Result } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Error: React.FC = () => {
  const navigate = useNavigate()

  return (
    <Result
      extra={
        <Button type="primary" onClick={() => navigate(-1)}>
          返回
        </Button>
      }
    />
  )
}

export default Error
