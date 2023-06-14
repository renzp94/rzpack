import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'

import App from '@/App'
import { AntdConfigProvider } from '@/components'

import './app.less'

const root = ReactDOM.createRoot(document.querySelector('#root') as HTMLDivElement)

root.render(
  <AntdConfigProvider>
    <HashRouter>
      <App />
    </HashRouter>
  </AntdConfigProvider>
)
