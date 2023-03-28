import { Spin } from 'antd'
import React from 'react'

const CenterSpin = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <Spin />
    </div>
  )
}

export default CenterSpin
