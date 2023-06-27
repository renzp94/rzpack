import { Button, Result, Space } from 'antd'
import React from 'react'
import { useNavigate, useRouteError } from 'react-router-dom'

const PageError: React.FC = () => {
  const navigate = useNavigate()
  const error: any = useRouteError()
  const title = error?.statusText ?? error?.message

  return (
    <Result
      extra={
        <Space>
          <Button ghost onClick={() => navigate(-1)} type="primary">
            返回
          </Button>
        </Space>
      }
      title={title}
    />
  )
}

export default PageError
