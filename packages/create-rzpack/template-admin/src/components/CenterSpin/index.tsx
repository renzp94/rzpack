import { Spin } from 'antd'

const CenterSpin = () => {
  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        height: '100vh',
        justifyContent: 'center',
      }}
    >
      <Spin />
    </div>
  )
}

export default CenterSpin
