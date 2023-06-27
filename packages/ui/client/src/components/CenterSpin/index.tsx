import { Spin } from 'antd'
import React from 'react'

const CenterSpin = () => {
  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <Spin />
    </div>
  )
}

export default CenterSpin
