import prompts from 'prompts'
import { blue, bold, cyan, getFileFullPath, red, yellow } from 'rzpack-utils'
import { type CLIOptions, Template } from '.'
import { DEFAULT_CONFIG } from './constant'
import {
  canSafelyOverwrite,
  isValidPackageName,
  isValidTemplate,
  toValidPackageName,
} from './utils'

export enum JS_LINT {
  ESLINT = 'eslint',
  BIOME = 'biome',
}

export enum BUILDER {
  WEBPACK = 'webpack',
  RSPACK = 'rspack',
}

export interface PromptsResult {
  projectName?: string
  packageName?: string
  overwrite?: boolean
  template?: Template
  builder?: BUILDER
  jtsLoader?: string
  cssScoped?: string
  jsLint?: JS_LINT
  styleLint?: boolean
  commitLint?: boolean
  rs?: boolean
  imageMini?: boolean
  million?: boolean
}

const getPrompts = async ({ projectName, template, force }: CLIOptions) => {
  let targetDir = projectName
  let builder: BUILDER = BUILDER.WEBPACK

  let result: PromptsResult = {
    projectName,
    packageName: projectName,
    overwrite: force,
  }

  const promptValues = await prompts(
    [
      {
        name: 'projectName',
        type: targetDir ? null : 'text',
        message: yellow('请输入项目名称: '),
        initial: projectName ?? DEFAULT_CONFIG.PROJECT_NAME,
        onState: (state) => {
          targetDir = String(state.value).trim() || projectName
        },
      },
      {
        name: 'overwrite',
        type: () => (canSafelyOverwrite(targetDir) || force ? null : 'confirm'),
        message: () => {
          const dirForPrompt =
            targetDir === '.' ? '当前目录' : `目标目录 "${targetDir}"`

          return red(`${dirForPrompt} 不为空. 是否删除${dirForPrompt}并继续?`)
        },
      },
      {
        name: 'overwriteChecker',
        type: (_prev, values) => {
          if (values?.overwrite === false) {
            throw new Error(red('操作取消'))
          }
          return null
        },
      },
      {
        name: 'packageName',
        type: () => (isValidPackageName(targetDir) ? null : 'text'),
        message: yellow('Package name:'),
        initial: () => toValidPackageName(targetDir),
        validate: (dir) => isValidPackageName(dir) || 'package.json name错误',
      },
      {
        name: 'template',
        type: isValidTemplate(template) ? null : 'select',
        message: yellow('请选择模板'),
        hint: '用于创建项目的模板',
        choices: [
          { title: cyan(`${bold(Template.TS)} - ts模板`), value: Template.TS },
          {
            title: yellow(`${bold(Template.ANTD)} - antd模版`),
            value: Template.ANTD,
          },
          {
            title: blue(
              `${bold(Template.ADMIN)} - 基础后台管理平台(侧边菜单版)的模版`,
            ),
            value: Template.ADMIN,
          },
          {
            title: blue(
              `${bold(
                Template.ADMIN_HEADER_MENU,
              )} - 基础后台管理平台(顶部菜单版)的模版`,
            ),
            value: Template.ADMIN_HEADER_MENU,
          },
        ],
      },
      {
        name: 'builder',
        type: 'select',
        message: yellow('请选择打包器'),
        choices: [
          { title: yellow('Webpack'), value: BUILDER.WEBPACK },
          { title: blue('Rspack'), value: BUILDER.RSPACK },
        ],
        onState: (state) => {
          builder = state.value
        },
      },
      {
        name: 'jtsLoader',
        type: () => (builder === 'rspack' ? null : 'select'),
        message: yellow('请选择Js/Ts文件的loader'),
        hint: '用于编译时处理JSX文件',
        choices: [
          { title: yellow('Esbuild'), value: 'esbuild' },
          { title: blue('Swc'), value: 'swc' },
        ],
      },
      {
        name: 'cssScoped',
        type: () => 'toggle',
        message: yellow('是否使用Css Scoped ?'),
        initial: false,
        active: '是',
        inactive: '否',
      },
      {
        name: 'jsLint',
        type: 'select',
        message: yellow('请选择Jslint'),
        choices: [
          { title: cyan(JS_LINT.ESLINT), value: JS_LINT.ESLINT },
          { title: yellow(`${JS_LINT.BIOME}(实验性)`), value: JS_LINT.BIOME },
          { title: blue('无'), value: false },
        ],
      },
      {
        name: 'imageMini',
        type: () => 'toggle',
        message: yellow('是否开启图片无损压缩?'),
        initial: false,
        active: '是',
        inactive: '否',
      },
      {
        name: 'million',
        type: () => 'toggle',
        message: yellow('是否使用Million.js优化jsx性能(实验性)?'),
        initial: false,
        active: '是',
        inactive: '否',
      },
      {
        name: 'styleLint',
        type: () => 'toggle',
        message: yellow('是否使用styleLint ?'),
        initial: true,
        active: '是',
        inactive: '否',
      },
      {
        name: 'commitLint',
        type: () => 'toggle',
        message: yellow('是否使用CommitLint ?'),
        initial: true,
        active: '是',
        inactive: '否',
      },
      {
        name: 'rs',
        type: () => 'toggle',
        message: yellow('是否开启配置文件更改自动重启?'),
        initial: true,
        active: '是',
        inactive: '否',
      },
    ],
    {
      onCancel: () => process.exit(0),
    },
  )

  process.env.ROOT = getFileFullPath(targetDir)

  result = {
    ...result,
    ...promptValues,
  }

  if (result.packageName === projectName) {
    result.packageName = result.projectName
  }

  return result
}

export default getPrompts
