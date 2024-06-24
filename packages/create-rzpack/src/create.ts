import fs from 'node:fs'
import {
  bold,
  fileExists,
  logInfo,
  logSuccess,
  pathResolve,
} from 'rzpack-utils'
import { yellow } from 'rzpack-utils'
import { JS_LINT, type PromptsResult } from './prompts'
import {
  gitInit,
  renderConfig,
  renderGitignore,
  renderLintConfig,
  renderNodemon,
  renderPackage,
  renderReadme,
  renderTemplate,
} from './render'
import { clearDir } from './utils'

const createProject = async (options: PromptsResult) => {
  const {
    projectName,
    template,
    overwrite,
    styleLint,
    jsLint,
    commitLint,
    rs,
  } = options
  const { ROOT } = process.env

  if (overwrite) {
    logInfo(`正在清除${ROOT}目录...`)
    clearDir(ROOT)
  }
  logInfo(`正在${ROOT}目录中创建${projectName}项目...`)
  if (!fileExists(ROOT)) {
    fs.mkdirSync(ROOT)
  }
  // 渲染package.json,第一步必须先生成package,因为后续会根据选项做出调整
  await renderPackage(options)
  // 渲染基础文件
  renderTemplate(pathResolve('../template-base', __dirname), ROOT)
  // 渲染jsLint
  if (jsLint) {
    const lint = jsLint === JS_LINT.BIOME ? JS_LINT.BIOME : JS_LINT.ESLINT
    renderTemplate(pathResolve(`../template-${lint}`, __dirname), ROOT)
  }
  // 渲染styleLint
  if (styleLint) {
    renderTemplate(pathResolve('../template-stylelint', __dirname), ROOT)
  }
  const templateDir = pathResolve(`../template-${template}`, __dirname)
  // 渲染指定模板
  renderTemplate(templateDir, ROOT)
  // 渲染配置文件
  renderConfig(options)
  // .开头的文件只能通过fs写入，不能放在基础文件中，放入则无法生成
  // 渲染.gitignore
  renderGitignore()
  if (commitLint) {
    // 渲染commitLint配置
    renderLintConfig()
  }
  if (rs) {
    renderNodemon()
  }
  // 渲染Readme
  renderReadme(options)
  logInfo('正在初始化git仓库...')
  await gitInit()
  logSuccess(
    `\n✨  项目${bold(projectName)}创建成功!!! 🚀🚀🚀

    👉 cd ${projectName}
    👉 npm install
    👉 npm run dev
    `,
  )
  if (jsLint === JS_LINT.BIOME) {
    logInfo(
      `模版是基于eslint开发的, 检测到使用了${
        JS_LINT.BIOME
      } lint, 所以最好下载依赖以后执行一下${yellow(
        bold('npm run lint:unsafe'),
      )}`,
    )
  }
}

export default createProject
