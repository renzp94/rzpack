import httpProxy from 'http-proxy'
import { PREFIX_URL } from '../constants'
import { __proxyList__ } from '../routes/proxy'

const proxy = httpProxy.createProxyServer({})

proxy.on('error', (error, req, res) => {
  res.writeHead(500, {
    'Content-Type': 'text/plain',
  })

  res.end(`rzpack: ${req.url}接口代理出错: ${error}`)
})

export const httpProxyMiddleware: any = (req, res, next) => {
  if (req.url.match(`${PREFIX_URL}/`)) {
    next()
    return
  }

  const proxyList = __proxyList__.filter((item) => item.enabled)
  const target = proxyList.find((item) => new RegExp(item.path).test(req.url))

  if (target) {
    proxy.web(req, res, {
      target: target.target,
      changeOrigin: true,
      ...(target?.options ?? {}),
    })
  } else {
    next()
  }
}
