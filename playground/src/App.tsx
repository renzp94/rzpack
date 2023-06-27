import { Button, DatePicker, message, Space } from 'antd'
import React, { useState } from 'react'
import './app.less'

const App: React.FC = () => {
  const [count, setCount] = useState(0)
  const onShowMsg = () => {
    message.warning('111')
  }

  const onFetch = async () => {
    try {
      await fetch('/api/repos/renzp94/rzpack', {
        method: 'get',
      })
      message.success('发送成功')
    } catch (error) {
      message.success('发送失败')
    }
  }

  return (
    <div
      style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Space>
        <Button onClick={() => setCount((val) => val - 1)}>-</Button>
        <div style={{ margin: '0 12px' }}>{count}</div>
        <Button onClick={() => setCount((val) => val + 1)}>+</Button>
        <Button type="primary" onClick={onFetch}>
          发送请求
        </Button>
        <Button danger onClick={onShowMsg}>
          按钮
        </Button>
        <span className="app">测试</span>
        <DatePicker />
      </Space>
    </div>
  )
}

export default App
