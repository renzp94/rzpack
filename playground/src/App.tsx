import { Button, DatePicker, message, Space } from 'antd'
import React, { useState } from 'react'
import './app.less'

const App: React.FC = () => {
  const [count, setCount] = useState(0)
  const onShowMsg = () => {
    message.warning('111')
  }

  return (
    <div
      style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Space>
        <Button onClick={() => setCount((val) => val - 1)}>-</Button>
        <div style={{ margin: '0 12px' }}>{count}</div>
        <Button onClick={() => setCount((val) => val + 1)}>+</Button>
        <Button type="primary">按钮</Button>
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
