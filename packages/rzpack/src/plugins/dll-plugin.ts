import type WebpackChain from 'webpack-chain'
import webpack from 'webpack'
import {
  dllManifestPath,
  dllPath,
  fileExists,
  logInfo,
  logSuccess,
  logWarning,
  checkDllVersion,
} from 'rzpack-utils'
import fs from 'fs'

/**
 * 构建依赖包的Dll
 * @param vendor 依赖包
 * @returns 返回true为构建成功，否则为构建失败
 */
export const useDll = async (dll: Array<string>) => {
  const exist = fileExists(dllPath)
  const rebuildList = await checkDllVersion(dll)

  if (exist) {
    // 检测dll版本和当前安装的依赖一致，则不需要构建
    if (rebuildList.length === 0) {
      return
    }
    // 构建前删除dll信息
    // 删除文件
    fs.unlinkSync(`${dllPath}/dll.js`)
    fs.unlinkSync(`${dllPath}/manifest.json`)
    fs.unlinkSync(`${dllPath}/dll.js.LICENSE.txt`)
    // 删除文件夹
    fs.rmdirSync(dllPath)

    const msg = rebuildList
      .map((item) => `\n${item.name}: Dll版本是${item.dll},当前安装版本是${item.installed}`)
      .toString()
    logWarning(msg)
  }

  const status = await buildDll(dll)
  if (status) {
    logSuccess(`构建${dll}依赖包的dll成功`)
  }
}
/**
 * 构建依赖包的Dll
 * @param vendor 依赖包
 * @returns 返回true为构建成功，否则为构建失败
 */
export const buildDll = (dll: Array<string>) => {
  logInfo(`⌛ 开始构建${dll}依赖包的Dll...`)
  const dllConfig = {
    entry: {
      dll,
    },
    output: {
      path: dllPath,
    },
    plugins: [
      new webpack.DllPlugin({
        name: '[name]_[fullhash]',
        path: `${dllPath}/manifest.json`,
      }),
    ],
  }

  const compiler = webpack(dllConfig)
  return new Promise((resolve) =>
    compiler.run((err, stats) => resolve(!(err || stats.hasErrors())))
  )
}
/**
 * 加载DllReferencePlugin
 * @param webpackChain WebpackChain
 */
const resolveDllReferencePlugin = (webpackChain: WebpackChain) => {
  webpackChain.plugin('dll-reference-plugin').use(webpack.DllReferencePlugin, [
    {
      context: __dirname,
      manifest: require(dllManifestPath),
    },
  ])
}

export default resolveDllReferencePlugin
