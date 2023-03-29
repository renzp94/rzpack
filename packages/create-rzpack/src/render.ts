import { pathResolve, run } from 'rzpack-utils'
import fs from 'fs'
import path from 'path'
import { Template } from '.'
import { PromptsResult } from './prompts'
import { deepMerge, sortDependencies } from './utils'

/**
 * 将源目录下的文件复制到指定目录目录下
 * 如果是package.json文件则合并内容
 * @param {string}  src 源目录
 * @param {string}  dest 目标目录
 */
export const renderTemplate = (src: string, dest: string) => {
  const stats = fs.statSync(src)

  if (stats.isDirectory()) {
    // 如果是目录则递归复制
    fs.mkdirSync(dest, { recursive: true })
    for (const file of fs.readdirSync(src)) {
      renderTemplate(pathResolve(file, src), pathResolve(file, dest))
    }
    return
  }

  const filename = path.basename(src)

  if (filename === 'package.json' && fs.existsSync(dest)) {
    // 合并并覆盖
    const existing = JSON.parse(fs.readFileSync(dest) as unknown as string)
    const newPackage = JSON.parse(fs.readFileSync(src) as unknown as string)
    const pkg = sortDependencies(deepMerge(existing, newPackage))
    fs.writeFileSync(dest, JSON.stringify(pkg, null, 2) + '\n')
    return
  }

  fs.copyFileSync(src, dest)
}

/**
 * 在目标目录下生成package.json文件
 * @param {string} projectName 项目名
 */
export const renderPackage = ({ packageName, commitLint, template }: PromptsResult) => {
  const isAntd4Template = [Template.ANTD4, Template.FULL_V6_3].includes(template)
  const isAntd5Template = [Template.ANTD5, Template.FULL_ANTD5_V6_3].includes(template)
  const isRouter6_3Template = [Template.FULL_V6_3, Template.FULL_ANTD5_V6_3].includes(template)

  const commitScripts = {
    cz: 'git-cz',
    release: 'standard-version',
  }
  const commitlintPackages = {
    '@commitlint/cli': '^17.2.0',
    '@commitlint/config-conventional': '^17.2.0',
    'commitlint-config-cz': '^0.13.3',
    'cz-customizable': '^7.0.0',
    commitizen: '^4.2.5',
    'standard-version': '^9.5.0',
  }
  const commitizenConfig = {
    config: {
      commitizen: {
        path: 'node_modules/cz-customizable',
      },
      'cz-customizable': {
        config: 'cz.config.js',
      },
    },
  }

  const eslintPackages = {
    '@typescript-eslint/eslint-plugin': '^5.37.0',
    '@typescript-eslint/parser': '^5.37.0',
    eslint: '^8.23.1',
    'eslint-config-prettier': '^8.5.0',
    'eslint-plugin-jsx-a11y': '^6.6.1',
    'eslint-plugin-prettier': '^4.2.1',
    'eslint-plugin-react': '^7.31.10',
    'eslint-plugin-react-hooks': '^4.6.0',
    prettier: '^2.7.1',
  }
  const huskyPackages = {
    'simple-git-hooks': '^2.8.1',
    'lint-staged': '^13.0.3',
  }
  const stylelintPackage = {
    stylelint: '^14.15.0',
    'stylelint-config-property-sort-order-smacss': '^9.0.0',
    'stylelint-config-standard': '^29.0.0',
    'stylelint-order': '^5.0.0',
  }

  const antdPackages = {
    '@ant-design/icons': '^4.7.0',
    antd: isAntd5Template ? '^5.1.0' : '^4.24.2',
  }

  // antd4.x时将moment.js换成dayjs
  if (isAntd4Template) {
    antdPackages['dayjs'] = '^1.11.6'
  }

  const fullDepPackages = {
    '@renzp/storage': '^0.0.1',
    axios: '^1.1.3',
    dayjs: '^1.11.7',
    'lodash-es': '^4.17.21',
    nprogress: '^0.2.0',
    'react-router-dom': isRouter6_3Template ? '6.3.0' : '^6.4.3',
    zustand: '^4.1.4',
  }
  const fullDevDepPackages = {
    '@types/lodash-es': '^4.17.6',
    '@types/nprogress': '^0.2.0',
  }

  const pkg = {
    name: packageName,
    version: '0.0.1',
    scripts: {
      dev: 'rzpack',
      build: 'rzpack build',
      'build:time': 'rzpack build --bundle-time',
      'build:size': 'rzpack build --bundle-size',
      preview: 'rzpack preview',
      prepare: 'npx simple-git-hooks',
      ...(commitLint ? commitScripts : {}),
    },
    browserslist: ['>0.2%', 'not dead', 'not IE 11', 'not op_mini all'],
    'simple-git-hooks': {
      'pre-commit': 'npx lint-staged',
      ...(commitLint ? { 'commit-msg': 'npx --no -- commitlint --edit $1' } : {}),
    },
    'lint-staged': {
      'src/**/*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],
    },
    ...(commitLint ? commitizenConfig : {}),
    dependencies: {
      react: '^18.2.0',
      'react-dom': '^18.2.0',
      ...(template !== 'react-ts' ? antdPackages : {}),
      ...(isRouter6_3Template ? fullDepPackages : {}),
    },
    devDependencies: {
      '@types/react': '^18.0.25',
      '@types/react-dom': '^18.0.9',
      rzpack: '^0.0.2',
      typescript: '4.8.4',
      ...(isRouter6_3Template ? fullDevDepPackages : {}),
      ...(commitLint ? commitlintPackages : {}),
      ...eslintPackages,
      ...huskyPackages,
      ...stylelintPackage,
    },
  }
  fs.writeFileSync(path.resolve(process.env.ROOT, 'package.json'), JSON.stringify(pkg, null, 2))
}
/**
 * 在目标目录下生成README.md
 * @param {string} projectName 项目名
 */
export const renderReadme = ({ projectName }: PromptsResult) => {
  let pluginInfo = '\n'
  const eslintPlugin = '- `ESLint`\n' + '- `Prettier - Code formatter`\n'
  const stylelintPlugin = '- `Stylelint`\n'
  const cssModulePlugin = '- `CSS Modules`\n'
  const vscodeSettingTitle =
    '## 配置 Vscode\n\n' + '在`Vscode`配置文件`settings.json`中添加如下配置\n\n'

  const eslintSettings =
    '### 配置 Eslint+Prettier\n\n' +
    '```json\n' +
    '"editor.formatOnSave": true,\n' +
    '"editor.fontLigatures": true,\n' +
    '"svelte.enable-ts-plugin": true,\n' +
    '"explorer.confirmDelete": false,\n' +
    '"prettier.jsxSingleQuote": true,\n' +
    '"prettier.requireConfig": true,\n' +
    '"prettier.semi": false,\n' +
    '"prettier.singleQuote": true,\n' +
    '"prettier.arrowParens": "avoid",\n' +
    '"editor.codeActionsOnSave": {\n' +
    '    "source.fixAll": true\n' +
    '}\n' +
    '```\n\n'

  pluginInfo +=
    '## Vscode 插件\n\n' +
    eslintPlugin +
    stylelintPlugin +
    cssModulePlugin +
    '\n' +
    vscodeSettingTitle +
    eslintSettings +
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

  fs.writeFileSync(path.resolve(process.env.ROOT, 'README.md'), info)
}
/**
 * 渲染配置文件
 * @param {PromptsResult} result
 */
export const renderConfig = (result: PromptsResult) => {
  const { projectName, cssScoped, jtsLoader, template } = result
  const isFullTemplate = [Template.FULL_ANTD5_V6_3, Template.FULL_V6_3].includes(template)
  const isTsTemplate = template === Template.TS

  let assets = `  assets: {\n`
  if (cssScoped) {
    assets += `    cssScoped: true,\n`
  }

  if (jtsLoader) {
    assets += `    jsxTools: '${jtsLoader}',\n`
  }
  assets += '  },\n'

  const hasAssets = cssScoped || jtsLoader

  const server =
    '  server: {\n' +
    '    proxy: {\n' +
    `      '/api': 'http://127.0.0.0:3000',\n` +
    `    },\n` +
    `  },\n`

  const antd = `  antdTheme: {\n` + `    file: './src/theme/index.ts',\n` + `  },\n`
  const lessVars = `  lessVars: {\n` + `    file: './src/theme/globalVars.ts',\n` + `  },\n`

  fs.writeFileSync(
    path.resolve(process.env.ROOT, 'rzpack.config.js'),
    `/* eslint-disable @typescript-eslint/no-var-requires */\n` +
      `const { defineConfig } = require('rzpack')\n\n` +
      `module.exports = defineConfig({\n` +
      `  html: {\n` +
      `    title: '${projectName}',\n` +
      `  },\n` +
      (!isTsTemplate ? antd + lessVars : '') +
      `${hasAssets ? assets : ''}` +
      `${isFullTemplate ? server : ''}` +
      `})\n`
  )
}
/**
 * 渲染commitlint配置文件
 */
export const renderLintConfig = () => {
  fs.writeFileSync(
    pathResolve('commitlint.config.js', process.env.ROOT),
    `module.exports = {\n` + `  extends: ['@commitlint/config-conventional', 'cz'],\n` + `}\n`
  )
  fs.writeFileSync(
    pathResolve('cz.config.js', process.env.ROOT),
    `module.exports = {\n` +
      `  types: [\n` +
      `    { value: 'feat', name: 'feat: 新功能' },\n` +
      `    { value: 'fix', name: 'fix: Bug修复' },\n` +
      `    { value: 'docs', name: 'docs: 文档更改' },\n` +
      `    { value: 'style', name: 'style: 不影响代码含义的更改(空白、格式、缺少分号等)' },\n` +
      `    { value: 'refactor', name: 'refactor: 代码重构' },\n` +
      `    { value: 'perf', name: 'perf: 性能优化' },\n` +
      `    { value: 'test', name: 'test: 测试更改' },\n` +
      `    {\n` +
      `      value: 'build',\n` +
      `      name: 'build: 影响构建系统或外部依赖关系的更改(示例范围: gulp、Brocoli、npm)',\n` +
      `    },\n` +
      `    { value: 'ci', name: 'ci: CI配置文件和脚本更改' },\n` +
      `    { value: 'chore', name: 'chore: 其他' },\n` +
      `    { value: 'revert', name: 'revert: 代码回退' },\n` +
      `  ],\n` +
      `  messages: {\n` +
      `    type: '请选择要提交的更改类型: ',\n` +
      `    subject: '请输入此次更改内容的简短描述:',\n` +
      `    body: '请输入此次更改内容的详细描述[可选]:',\n` +
      `    confirmCommit: '是否提交本次内容?',\n` +
      `  },\n` +
      `  skipQuestions: ['breaking', 'scope', 'footer'],\n` +
      `  subjectLimit: 100,\n` +
      `}\n`
  )
  const versionConfig = {
    types: [
      { type: 'chore', section: '其他', hidden: false },
      { type: 'revert', section: '代码回退', hidden: false },
      { type: 'feat', section: '新功能', hidden: false },
      { type: 'fix', section: 'Bug修复', hidden: false },
      { type: 'docs', section: '文档', hidden: false },
      { type: 'style', section: '代码格式', hidden: false },
      { type: 'refactor', section: '代码重构', hidden: false },
      { type: 'perf', section: '性能优化', hidden: false },
      { type: 'test', section: '测试', hidden: false },
      { type: 'build', section: '构建', hidden: false },
      { type: 'ci', section: 'CI配置', hidden: false },
    ],
  }
  fs.writeFileSync(
    pathResolve('.versionrc', process.env.ROOT),
    JSON.stringify(versionConfig, null, 2)
  )
}
/**
 * 初始化git仓库
 */
export const gitInit = async () => {
  await run('git init')
  // await run('git add .')
  // await run('git commit -m init')
}
/**
 * 渲染.gitignore
 */
export const renderGitignore = () => {
  fs.writeFileSync(
    pathResolve('.gitignore', process.env.ROOT),
    'node_modules\nbin\n*.log\n.vscode\n.DS_Store\ndist'
  )
}
