import { Button, DatePicker, Space, message } from 'antd'
import React from 'react'
import { useState } from 'react'
import './app.less'
import './test.scoped.less'
import styles from './test-module.module.less'
import logo from '@/assets/images/logo.png'
import HomeIcon from '@/assets/images/home.svg'
import home from '@/assets/images/home.svg?url'

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
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <HomeIcon />
      <img style={{ height:24, width:24 }} src={logo}  />
      <img style={{ height:24, width:24 }} src={home}  />
      <Space>
        <Button onClick={() => setCount((val) => val - 1)}>-</Button>
        <div style={{ margin: '0 12px' }} className={`test ${styles.fontStyle}`}>
          {count}
        </div>
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
