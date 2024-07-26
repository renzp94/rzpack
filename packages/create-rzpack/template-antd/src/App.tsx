import type { MessageInstance } from 'antd/es/message/interface'
import type { ModalStaticFunctions } from 'antd/es/modal/confirm'
import type { NotificationInstance } from 'antd/es/notification/interface'

import {
  App as antdApp,
  message as antdMessage,
  Modal as antdModal,
  notification as antdNotification,
  Button,
} from 'antd'
import { useState } from 'react'

let message: MessageInstance = antdMessage
let notification: NotificationInstance = antdNotification
let modal: Omit<ModalStaticFunctions, 'warn'> = antdModal

const App = () => {
  const [count, setCount] = useState(0)

  const staticFunctions = antdApp.useApp()
  message = staticFunctions.message
  notification = staticFunctions.notification
  modal = staticFunctions.modal

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
export { message, modal, notification }
