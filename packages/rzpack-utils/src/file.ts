import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import * as esbuild from 'esbuild'
import { logError } from './log'

/**
 * 判断文件是否存在
 * @param file 文件路径
 * @returns Promise<boolean>
 */
export const fileExists = (file?: string): boolean => fs.existsSync(file)
/**
 * 加载模块
 * @param module 模块
 * @returns 返回加载的模块
 */
export const requireResolve = (module: string, opts?: unknown) =>
  require.resolve(module, opts)
/**
 * 将相对路径转为绝对路径
 * @param dir 相对路径
 * @param root 主路径, 默认为__dirname
 * @returns 返回绝对路径
 */
export const pathResolve = (dir: string, root = __dirname) =>
  path.resolve(root, dir)
/**
 * 获取配置文件全路径，默认从当前项目目录(process.cwd())下查询
 * @param file 文件路径
 * @returns 找到则返回全路径，否则返回undefined
 */
export const getFileFullPath = (
  file: string,
  root = process.cwd(),
): string | undefined => {
  if (!file) {
    logError('参数file不能为空')
    return
  }

  return pathResolve(file, root)
}
/**
 * 加载node模块的文件
 * @param filepath 文件路径
 * @returns 返回文件内容
 */
export const requireFile = (filepath: string) => {
  if (!fileExists(filepath)) {
    logError(`加载文件错误：${filepath}不存在`)
    return
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const content = require(filepath)

  return content
}
/**
 * 创建环境hash
 * @param env 环境字符串
 * @returns 返回创建的hash
 */
export const createEnvHash = (env: string) => {
  const hash = createHash('md5')
  hash.update(env)
  return hash.digest('hex')
}
/**
 * 编译配置文件
 * @param configFile 要编译的文件地址
 * @param tmpFilePath 编译后保存的文件地址
 * @returns 返回配置文件内容
 */
export const bundleTsFile = (configFile: string, tmpFilePath: string) => {
  const fileContent = fs.readFileSync(configFile, 'utf-8')
  const result = esbuild.transformSync(fileContent, {
    loader: 'ts',
    format: 'cjs',
    platform: 'node',
    minify: true,
  })

  fs.writeFileSync(tmpFilePath, result.code)
  const configs = requireFile(tmpFilePath)?.default

  if (configs) {
    fs.unlink(tmpFilePath, () => undefined)
  }

  return configs
}
/**
 * 获取当前项目依赖包的版本
 * @param packageName 依赖包名
 * @returns 返回版本号
 */
export const getPackageVersion = (packageName: string) => {
  const packageFile = getFileFullPath('package.json')
  const packageInfo = requireFile(packageFile)
  const deps = packageInfo?.dependencies
  const devDeps = packageInfo?.devDependencies
  let version = deps?.[packageName] ?? devDeps?.[packageName]
  version = version?.replace(/^(\^|~)/, '')

  return version
}
