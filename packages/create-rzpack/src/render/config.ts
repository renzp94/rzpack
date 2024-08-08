import fs from 'node:fs'
import { pathResolve } from 'rzpack-utils'
import { Template } from '..'
import { BUILDER, type PromptsResult } from '../prompts'

/**
 * 渲染配置文件
 * @param {PromptsResult} result
 */
export const renderConfig = (result: PromptsResult) => {
  const {
    projectName,
    cssScoped,
    builder,
    jtsLoader,
    template,
    million,
    imageMini,
  } = result
  const isTsTemplate = template === Template.TS
  let importStr = 'import { defineConfig'
  if (jtsLoader) {
    importStr += ', JSX_TOOLS'
  }
  if (builder) {
    importStr += ', BUILDER'
  }

  let assets = '  assets: {\n'
  if (cssScoped) {
    assets += '    cssScoped: true,\n'
  }

  if (jtsLoader) {
    assets += `    jsxTools: JSX_TOOLS.${jtsLoader.toLocaleUpperCase()},\n`
  }
  assets += '  },\n'

  const hasAssets = cssScoped || jtsLoader

  const antd =
    '  antdTheme: {\n' + `    file: './src/theme/index.ts',\n` + '  },\n'
  const lessVars =
    '  lessVars: {\n' + `    file: './src/theme/globalVars.ts',\n` + '  },\n'

  importStr += ` } from 'rzpack'\n\n`
  fs.writeFileSync(
    pathResolve('rzpack.config.ts', process.env.ROOT),
    importStr +
      'export default defineConfig({\n' +
      `  ${builder === BUILDER.RSPACK ? 'builder: BUILDER.RSPACK,\n' : ''}` +
      `${hasAssets ? assets : ''}` +
      '  html: {\n' +
      `    title: '${projectName}',\n` +
      '  },\n' +
      (!isTsTemplate ? antd + lessVars : '') +
      (million ? '  million: true,\n' : '') +
      (imageMini ? '  imageMini: true,\n' : '') +
      '})\n',
  )
}
