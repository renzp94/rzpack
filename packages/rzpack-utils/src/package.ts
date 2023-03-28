import { fileExists, pathResolve } from './file'
import check from 'check-dependencies'
import fs from 'fs'

export const dllPath = pathResolve('./node_modules/.dll', process.cwd())
export const dllManifestPath = `${dllPath}/manifest.json`

/**
 * 获取Dll中的依赖包的名称和版本号
 * @param packageName 包名
 * @returns 返回依赖包的名称和版本号
 */
const getDllPackageNameVersion = (path: string) => {
  const space = '/node_modules/'
  const pathList = path.split(space)
  const name = pathList.pop().split('/')[0]
  const version = pathList.pop().split('@').pop()
  return version ? { name, version } : undefined
}

export const checkDllVersion = async (dll: Array<string>) => {
  const exist = fileExists(dllPath)
  if (exist) {
    const { log } = await check()

    const packages = log
      ?.filter((item: string) => item.includes('installed'))
      ?.map((item: string) => {
        // item内容："react: installed: \u001b[32m18.2.0\u001b[39m, expected: \u001b[32m^18.2.0\u001b[39m"
        const [name, installed, expected] = item
          .replace('installed: \x1B[32m', '')
          .replace('installed: \u001b[32m', '')
          .replace('\x1B[39m, expected: \x1B[32m', ',')
          .replace('\u001b[39m, expected: \u001b[32m', ',')
          .replace('\x1B[39m', '')
          .replace('\u001b[39m', '')
          .replace(':', ',')
          .split(',')
          .map((item) => item.trim())

        return {
          name,
          installed,
          expected,
        }
      })
      ?.filter((item) => dll.includes(item.name))

    const { content } = JSON.parse(fs.readFileSync(dllManifestPath, 'utf-8'))
    // 已经构建dll的依赖
    const dllPackages = Object.keys(content).map(getDllPackageNameVersion)

    const rebuildList = dllPackages.reduce((prev, curr) => {
      const packageTarget = packages.find(
        (pack) => pack.name === curr.name && pack.installed !== curr.version
      )

      if (packageTarget) {
        return [...prev, { name: curr.name, dll: curr.version, installed: packageTarget.installed }]
      }

      return prev
    }, [])

    return rebuildList
  }

  return []
}
