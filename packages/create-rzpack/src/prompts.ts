import { CLIOptions, Template } from '.'
import prompts from 'prompts'
import { red, yellow, blue, cyan, getFileFullPath, bold } from 'rzpack-utils'
import {
  canSafelyOverwrite,
  isValidPackageName,
  isValidTemplate,
  toValidPackageName,
} from './utils'
import { DEFAULT_CONFIG } from './constant'

export interface PromptsResult {
  projectName?: string
  packageName?: string
  overwrite?: boolean
  template?: Template
  jtsLoader?: string
  cssScoped?: string
  commitLint?: boolean
}

const getPrompts = async ({ projectName, template, force }: CLIOptions) => {
  let targetDir = projectName

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
        onState: (state) => (targetDir = String(state.value).trim() || projectName),
      },
      {
        name: 'overwrite',
        type: () => (canSafelyOverwrite(targetDir) || force ? null : 'confirm'),
        message: () => {
          const dirForPrompt = targetDir === '.' ? '当前目录' : `目标目录 "${targetDir}"`

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
          { title: cyan(`${bold(Template.TS)} - Typescript模板`), value: Template.TS },
          { title: yellow(`${bold(Template.ANTD4)} - antd4.x模版`), value: Template.ANTD4 },
          { title: yellow(`${bold(Template.ANTD5)} - antd5.x模版`), value: Template.ANTD5 },
          {
            title: blue(
              `${bold(Template.FULL_V6_3)} - antd4.x + zustand + router6.3.0 + 基础框架的模版`
            ),
            value: Template.FULL_V6_3,
          },
          {
            title: blue(
              `${bold(Template.FULL_ANTD5_V6_3)} - antd5.x + zustand + router6.3.0 + 基础框架的模版`
            ),
            value: Template.FULL_ANTD5_V6_3,
          },
        ],
      },
      {
        name: 'jtsLoader',
        type: 'select',
        message: yellow('请选择Js/Ts文件的loader'),
        hint: '用于编译时处理JSX文件',
        choices: [
          { title: cyan('Babel'), value: 'babel' },
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
        name: 'commitLint',
        type: () => 'toggle',
        message: yellow('是否使用CommitLint ?'),
        initial: true,
        active: '是',
        inactive: '否',
      },
    ],
    {
      onCancel: () => process.exit(0),
    }
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
