import express from 'express'
import path from 'node:path'
import { DEFAULT_CONFIG_FILE, PREFIX_URL } from './constants'
import proxyRoutes from './routes/proxy'
import events from 'node:events'
import { createDynamicsProxyMiddleware, dynamic } from './middlewares/dynamics-proxy'

export default async (app: express.Application, proxyFile?: string) => {
  // 移除频繁开启关闭代理时报MaxListenersExceededWarning
  events.EventEmitter.defaultMaxListeners = 0
  process.env.PROXY_FILE = proxyFile ?? DEFAULT_CONFIG_FILE

  const staticDir = path.join(__dirname, './client')
  app.use(createDynamicsProxyMiddleware)
  app.use(dynamic.handle())
  app.use(express.json())

  app.get(`${PREFIX_URL}/`, (_, res) => {
    res.sendFile(`${staticDir}/index.html`)
  })
  app.use('/static/favicon.ico', express.static(`${staticDir}/favicon.ico`))
  app.use('/static/assets', express.static(`${staticDir}/assets`))

  app.use(`${PREFIX_URL}/api/proxy`, proxyRoutes)
}

export { PREFIX_URL, DEFAULT_CONFIG_FILE } from './constants'
export { validateConfigFile } from './routes/proxy'
