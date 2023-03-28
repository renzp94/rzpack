import fs from 'fs'
import path from 'path'

export const isValidPackageName = (projectName: string) =>
  /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(projectName)

export const isValidTemplate = (template: string) =>
  template && ['react-ts', 'antd', 'full_v6.3'].includes(template)

export const canSafelyOverwrite = (dir: string) =>
  !fs.existsSync(dir) || fs.readdirSync(dir).length === 0

export const toValidPackageName = (projectName: string) => {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z0-9-~]+/g, '-')
}

export const preOrderDirectoryTraverse = (dir, dirCallback, fileCallback) => {
  for (const filename of fs.readdirSync(dir)) {
    const fullpath = path.resolve(dir, filename)
    if (fs.lstatSync(fullpath).isDirectory()) {
      dirCallback(fullpath)
      // in case the dirCallback removes the directory entirely
      if (fs.existsSync(fullpath)) {
        preOrderDirectoryTraverse(fullpath, dirCallback, fileCallback)
      }
      continue
    }
    fileCallback(fullpath)
  }
}

export const postOrderDirectoryTraverse = (dir, dirCallback, fileCallback) => {
  for (const filename of fs.readdirSync(dir)) {
    const fullpath = path.resolve(dir, filename)
    if (fs.lstatSync(fullpath).isDirectory()) {
      postOrderDirectoryTraverse(fullpath, dirCallback, fileCallback)
      dirCallback(fullpath)
      continue
    }
    fileCallback(fullpath)
  }
}

export const clearDir = (dir: string) => {
  postOrderDirectoryTraverse(
    dir,
    (dir) => fs.rmdirSync(dir),
    (file) => fs.unlinkSync(file)
  )
}

const isObject = (val) => val && typeof val === 'object'
const mergeArrayWithDedupe = (a, b) => Array.from(new Set([...a, ...b]))

/**
 * Recursively merge the content of the new object to the existing one
 * @param {Object} target the existing object
 * @param {Object} obj the new object
 */
export const deepMerge = (target, obj) => {
  for (const key of Object.keys(obj)) {
    const oldVal = target[key]
    const newVal = obj[key]

    if (Array.isArray(oldVal) && Array.isArray(newVal)) {
      target[key] = mergeArrayWithDedupe(oldVal, newVal)
    } else if (isObject(oldVal) && isObject(newVal)) {
      target[key] = deepMerge(oldVal, newVal)
    } else {
      target[key] = newVal
    }
  }

  return target
}

export const sortDependencies = (packageJson) => {
  const sorted = {}

  const depTypes = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']

  for (const depType of depTypes) {
    if (packageJson[depType]) {
      sorted[depType] = {}

      Object.keys(packageJson[depType])
        .sort()
        .forEach((name) => {
          sorted[depType][name] = packageJson[depType][name]
        })
    }
  }

  return {
    ...packageJson,
    ...sorted,
  }
}
/**
 *
 * @param file 要追加的文件绝对路径
 * @param data 追加的内容
 * @param line 要追加的位置，未指定则追加到最后
 */
export const appendFileContent = (file: string, data: string, line?: number) => {
  const content = fs.readFileSync(file, 'utf-8').split(/\r\n|\n|\r/gm)
  if (!line) {
    line = content.length
  } else {
    line = line < content.length ? line : content.length
  }
  content.splice(line, 0, data)
  fs.writeFileSync(file, content.join('\n'))
}
