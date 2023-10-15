import dotenv from 'dotenv'
import { expand as dotenvExpand } from 'dotenv-expand'
import { fileExists, pathResolve } from './file'

/**
 * 加载环境变量文件
 * @param {string} mode 开发模式
 */
export const loadEnv = (mode?: string) => {
  const basePath = pathResolve(`.env${mode ? `.${mode}` : ''}`, process.cwd())
  const localPath = pathResolve(`${basePath}.local`, process.cwd())

  const load = (envPath: string) => {
    try {
      const env = dotenv.config({ path: envPath })
      dotenvExpand(env)
    } catch (err) {
      // only ignore error if file is not found
      if (err.toString().indexOf('ENOENT') < 0) {
        console.log(err)
      }
    }
  }
  const isLocalExist = fileExists(localPath)
  if (isLocalExist) {
    load(localPath)
  }
  const isBaseExist = fileExists(basePath)
  if (isBaseExist) {
    load(basePath)
  }
}

/**
 * 将环境变量加载到客户端
 * @returns 返回REACT_APP_开头的环境变量
 */
export const resolveClientEnv = () => {
  const env = {}
  Object.keys(process.env).forEach((key) => {
    if (/^REACT_APP_/.test(key) || key === 'NODE_ENV') {
      env[key] = process.env[key]
    }
  })

  for (const key in env) {
    env[key] = JSON.stringify(env[key])
  }

  return {
    'process.env': env,
  }
}
