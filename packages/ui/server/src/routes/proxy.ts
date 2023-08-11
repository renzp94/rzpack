import express from 'express'
import { DEFAULT_CONFIG_FILE } from '../constants'
import { fileExists, getFileFullPath } from 'rzpack-utils'
import fs from 'node:fs'
import { catchError } from '../tools'

const router = express.Router()
export interface ProxyConfig {
  id: string
  path: string
  target: string
  description?: string
  options: Record<string, unknown>
  enabled: boolean
}

let configFilePath: string
export let __proxyList__: ProxyConfig[] = []

// 接口代理列表
router.get(
  '/rules',
  catchError((_, res) => {
    loadProxyConfigFile(process.env.PROXY_FILE)
    res.json({
      data: __proxyList__,
      msg: '操作成功',
      code: 0,
    })
  })
)
// 新增
router.post(
  '/rule',
  catchError((req, res) => {
    const target = Object.assign(req.body, { id: generateId() })
    __proxyList__.unshift(target)
    updateProxyConfigFile()
    res.json({
      code: 0,
      msg: '操作成功',
      data: {
        id: target.id,
      },
    })
  })
)
// 开启/关闭规则
router.put(
  '/rule/enabled/:id',
  catchError((req, res) => {
    __proxyList__ = __proxyList__.map((item) => {
      if (item.id !== req.params.id) {
        return item
      }

      return Object.assign({}, item, { enabled: req.body.enabled })
    })

    res.json({
      code: 0,
      msg: '操作成功',
    })
  })
)
// 全部开启/关闭规则
router.put(
  '/rule/all-enabled',
  catchError((req, res) => {
    __proxyList__ = __proxyList__.map((item) =>
      Object.assign({}, item, { enabled: req.body.enabled })
    )

    res.json({
      code: 0,
      msg: '操作成功',
    })
  })
)
// 移动
router.put(
  '/rule/move',
  catchError((req, res) => {
    const { from, to } = req.body
    __proxyList__.splice(to, 1, ...__proxyList__.splice(from, 1, __proxyList__[to]))

    updateProxyConfigFile()

    res.json({
      code: 0,
      data: __proxyList__,
      msg: '操作成功',
    })
  })
)
// 编辑
router.put(
  '/rule/:id',
  catchError((req, res) => {
    __proxyList__ = __proxyList__.map((item) => {
      if (item.id !== req.params.id) {
        return item
      }

      return Object.assign({}, item, req.body)
    })

    updateProxyConfigFile()
    res.json({
      code: 0,
      msg: '操作成功',
    })
  })
)
// 删除
router.delete(
  '/rule/:id',
  catchError((req, res) => {
    __proxyList__ = __proxyList__.filter((item) => item.id !== req.params.id)
    updateProxyConfigFile()
    res.json({
      code: 0,
      msg: '操作成功',
    })
  })
)

export default router

// 生成随机ID
const generateId = () => Math.random().toString(36).substring(2) + new Date().getTime().toString(36)

/**
 * 加载代理配置文件
 * @param filepath 配置文件路径
 */
export const loadProxyConfigFile = (filepath = DEFAULT_CONFIG_FILE) => {
  const fullPath = getFileFullPath(filepath)
  configFilePath = fullPath

  if (fileExists(fullPath)) {
    try {
      const content = JSON.parse(fs.readFileSync(fullPath, 'utf-8'))
      __proxyList__ = content?.map((item, index) => {
        const target = __proxyList__[index]
        return { id: generateId(), ...item, enabled: target?.enabled ?? item?.enabled ?? false }
      })
    } catch {
      __proxyList__ = []
    }
  }
}

const removeFiled = (list: ProxyConfig[], filed: string) => {
  return list.map((item) => {
    delete item[filed]

    return item
  })
}
// 更新配置文件数据
export const updateProxyConfigFile = () => {
  fs.writeFileSync(
    configFilePath,
    JSON.stringify(
      removeFiled(__proxyList__, 'id'),
      (key, value) => (key === 'enabled' ? undefined : value),
      2
    ),
    'utf-8'
  )
}

export const validateConfigFile = (filepath: string) => /.json$/.test(filepath)
