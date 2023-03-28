import App from '@/App'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './app.less'
import { AntdConfigProvider } from '@/components'
import { HashRouter } from 'react-router-dom'

const root = ReactDOM.createRoot(document.querySelector('#root') as HTMLDivElement)

root.render(
  <AntdConfigProvider>
    <HashRouter>
      <App />
    </HashRouter>
  </AntdConfigProvider>
)
