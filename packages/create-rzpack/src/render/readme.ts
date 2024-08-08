import fs from 'node:fs'
import { pathResolve } from 'rzpack-utils'
import biomeVscodeSettings from '../../template-biome/.vscode/settings.json'
import { JS_LINT, type PromptsResult } from '../prompts'

/**
 * 在目标目录下生成README.md
 * @param {string} projectName 项目名
 */
export const renderReadme = ({
  projectName,
  styleLint,
  jsLint,
}: PromptsResult) => {
  let pluginInfo = '\n'
  const eslintPlugin = '- `ESLint`\n' + '- `Prettier - Code formatter`\n'
  const biomePlugin = '- `Biome`\n'
  let jsLintPlugin = ''
  if (jsLint) {
    jsLintPlugin = jsLint === JS_LINT.BIOME ? biomePlugin : eslintPlugin
  }
  const stylelintPlugin = styleLint ? '- `Stylelint`\n' : ''
  const cssModulePlugin = '- `CSS Modules`\n'

  const vscodeSettingTitle =
    '## 配置 Vscode\n\n' +
    '在`Vscode`配置文件`settings.json`中添加如下配置\n\n' +
    '```json\n' +
    '"editor.formatOnSave": true,\n' +
    '"editor.codeActionsOnSave": {\n' +
    '    "source.fixAll": true\n' +
    '}\n' +
    '```\n\n'

  const prettierSettings =
    '"prettier.jsxSingleQuote": true,\n' +
    '"prettier.requireConfig": true,\n' +
    '"prettier.semi": false,\n' +
    '"prettier.singleQuote": true,\n' +
    '"prettier.arrowParens": "avoid",\n'

  const eslintSettings =
    '### 配置 Eslint+Prettier\n\n' +
    '在`Vscode`配置文件`settings.json`中添加如下配置\n\n' +
    '```json\n' +
    prettierSettings +
    '```\n\n'

  const biomeSettings =
    '### 配置 Biome\n\n' +
    '在根目录下创建`.vscode/settings.json`\n' +
    '```json\n' +
    `${JSON.stringify(biomeVscodeSettings, null, 2)}\n` +
    '```\n\n'

  pluginInfo +=
    '## Vscode 插件\n\n' +
    jsLintPlugin +
    stylelintPlugin +
    cssModulePlugin +
    '\n' +
    vscodeSettingTitle +
    (jsLint === JS_LINT.BIOME ? biomeSettings : eslintSettings) +
    '\n'

  const info =
    `# ${projectName}\n\n` +
    '> create-rzpack创建的React项目\n\n' +
    '## 开发\n\n' +
    '```bash\n' +
    'npm run dev\n' +
    '```\n' +
    '## 打包\n\n' +
    '```bash\n' +
    'npm run build\n' +
    '```\n' +
    pluginInfo

  fs.writeFileSync(pathResolve('README.md', process.env.ROOT), info)
}
