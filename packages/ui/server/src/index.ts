import events from 'node:events'
import path from 'node:path'
import express from 'express'
import { DEFAULT_CONFIG_FILE, PREFIX_URL } from './constants'
import { httpProxyMiddleware } from './middlewares/http-proxy'
import proxyRoutes from './routes/proxy'
import systemRoutes from './routes/system'

export default async (
  app: express.Application,
  proxyFile?: string,
  appTitle?: string,
) => {
  // 移除频繁开启关闭代理时报MaxListenersExceededWarning
  events.EventEmitter.defaultMaxListeners = 0
  process.env.PROXY_FILE = proxyFile ?? DEFAULT_CONFIG_FILE
  process.env.APP_TITLE = appTitle

  const staticDir = path.join(__dirname, './client')
  app.use(httpProxyMiddleware)
  app.use(express.json())

  app.get(`${PREFIX_URL}/`, (_, res) => {
    res.sendFile(`${staticDir}/index.html`)
  })
  app.use('/static', express.static(`${staticDir}`))
  app.use(`${PREFIX_URL}/api/proxy`, proxyRoutes)
  app.use(`${PREFIX_URL}/api/system`, systemRoutes)
}

export { PREFIX_URL, DEFAULT_CONFIG_FILE } from './constants'
export { validateConfigFile } from './routes/proxy'
