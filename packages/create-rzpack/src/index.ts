#!/usr/bin/env node
import { blue, bold } from 'rzpack-utils'
import cac from 'cac'
import getCommands from './command'
import { NAME, VERSION } from './constant'
import createProject from './create'
import getPrompts from './prompts'
const cli = cac()

export enum Template {
  TS = 'react-ts',
  ANTD = 'antd',
  ADMIN = 'admin',
  ADMIN_HEADER_MENU = 'admin-header-menu',
}

export interface CLIOptions {
  projectName?: string
  template?: Template
  force?: boolean
}

cli
  .command('[projectName]', '创建项目模板')
  .option('--template [template]', '[string] 模板类型')
  .option('--force', '[boolean] 是否覆盖目录')
  .action(async (projectName: string, options: CLIOptions) => {
    console.log(bold(blue(`\n${NAME}@${VERSION}`)))
    const values = getCommands(projectName, options)
    const result = await getPrompts(values)
    await createProject(result)
  })

cli.help()
cli.version(VERSION)
cli.parse()
