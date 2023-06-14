import { Button } from 'antd'
import React, { useState } from 'react'

const App: React.FC = () => {
  const [count, setCount] = useState(0)

  return (
    <div
      style={{ alignItems: 'center', display: 'flex', height: '100vh', justifyContent: 'center' }}
    >
      <Button onClick={() => setCount(val => val - 1)}>-</Button>
      <div style={{ margin: '0 12px' }}>{count}</div>
      <Button onClick={() => setCount(val => val + 1)}>+</Button>
    </div>
  )
}

export default App
