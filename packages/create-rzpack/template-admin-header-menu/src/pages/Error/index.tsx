import { Button, Result } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const ErrorPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <Result
      extra={
        <Button onClick={() => navigate(-1)} type="primary">
          返回
        </Button>
      }
    />
  )
}

export default ErrorPage
