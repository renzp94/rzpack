import dynamicMiddleware from 'express-dynamic-middleware'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { PREFIX_URL } from '../constants'
import { __proxyList__ } from '../routes/proxy'

export const dynamic = dynamicMiddleware.create([])
export const createDynamicsProxyMiddleware = (req, _, next) => {
  if (req.url.match(`${PREFIX_URL}/api/proxy`)) {
    dynamic.clean()
    const proxyList = __proxyList__.filter((item) => item.enabled)
    proxyList.forEach((item) => {
      dynamic.use(
        createProxyMiddleware(item.path, {
          target: item.target,
          changeOrigin: true,
          ...(item?.options ?? {}),
          logLevel: 'silent',
        })
      )
    })
  }

  next()
}
