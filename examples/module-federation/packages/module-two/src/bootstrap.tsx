import App from '@/App'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './app.less'
import { AntdConfigProvider } from '@/components'

const root = ReactDOM.createRoot(document.querySelector('#root') as HTMLDivElement)

root.render(
  <AntdConfigProvider>
    <App />
  </AntdConfigProvider>
)
