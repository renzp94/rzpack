import fs from 'fs'
import path from 'path'
import { pathResolve, run } from 'rzpack-utils'
import { Template } from '.'
import biomeVscodeSettings from '../template-biome/.vscode/settings.json'
import { JS_LINT, PromptsResult } from './prompts'
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
export const renderPackage = async ({
  packageName,
  jsLint,
  styleLint,
  commitLint,
  template,
  rs,
  million,
}: PromptsResult) => {
  const isAdminTemplate = [Template.ADMIN, Template.ADMIN_HEADER_MENU].includes(
    template,
  )
  const isTSTemplate = template === Template.TS

  let commitScripts = {}
  let commitLintPackages = {}
  let commitizenConfig = {}
  let commitGitHooks = {}
  if (commitLint) {
    commitScripts = {
      cz: 'git-cz',
      release: 'standard-version',
    }

    commitLintPackages = {
      '@commitlint/cli': '^18.5.0',
      '@commitlint/config-conventional': '^18.5.0',
      'commitlint-config-cz': '^0.13.3',
      'cz-customizable': '^7.0.0',
      commitizen: '^4.3.0',
      'standard-version': '^9.5.0',
    }

    commitizenConfig = {
      config: {
        commitizen: {
          path: 'node_modules/cz-customizable',
        },
        'cz-customizable': {
          config: 'cz.config.js',
        },
      },
    }

    commitGitHooks = { 'commit-msg': 'npx --no -- commitlint --edit $1' }
  }

  let jsLintPackages = {}
  if (jsLint) {
    let rzpackLintVersion = '0.0.2'
    try {
      rzpackLintVersion = (
        await run('npm view eslint-config-rzpack version')
      ).replace(/\s*/g, '')
    } catch {
      rzpackLintVersion = '0.0.2'
    }

    const eslintPackages = {
      eslint: '^8.56.0',
      prettier: '^3.2.4',
      'eslint-config-rzpack': `^${rzpackLintVersion}`,
    }
    const biomePackages = {
      '@biomejs/biome': '^1.5.3',
    }

    jsLintPackages = jsLint === JS_LINT.BIOME ? biomePackages : eslintPackages
  }
  const jsLintScripts =
    jsLint === JS_LINT.BIOME
      ? 'biome check --apply src && biome format --write src'
      : 'eslint --fix src && prettier --write src'

  let lintStagedScripts: Record<string, any> = {
    'src/**/*.{js,jsx,ts,tsx}':
      jsLint === JS_LINT.BIOME
        ? ['biome check', 'biome format --write']
        : ['eslint --fix', 'prettier --write'],
  }
  let stylelintPackage = {}
  if (styleLint) {
    lintStagedScripts = {
      ...lintStagedScripts,
      'src/**/*.{less,css}': 'stylelint --fix',
    }
    stylelintPackage = {
      stylelint: '^16.2.0',
      'stylelint-config-property-sort-order-smacss': '^10.0.0',
      'stylelint-config-standard': '^36.0.0',
      'stylelint-order': '^6.0.4',
      'postcss-less': '^6.0.0',
    }
  }
  const styleLintScripts = styleLint
    ? '&& stylelint --fix src/**/*.{less,css}'
    : ''

  const lintScripts = {
    lint: `${jsLintScripts} ${styleLintScripts}`,
    ...(jsLint === JS_LINT.BIOME
      ? {
          'lint:unsafe': `biome check --apply-unsafe src && biome format --write src ${styleLintScripts}`,
        }
      : {}),
  }

  if (Object.keys(lintStagedScripts).length > 0) {
    lintStagedScripts = {
      'lint-staged': lintStagedScripts,
    }
  }

  let antdPackages = {}

  if (!isTSTemplate) {
    antdPackages = {
      '@ant-design/icons': '^5.2.6',
      antd: '^5.13.2',
      dayjs: '^1.11.10',
    }
  }

  let fullDepPackages = {}
  let fullDevDepPackages = {}
  if (isAdminTemplate) {
    fullDepPackages = {
      '@renzp/storage': '^0.0.2',
      axios: '^1.6.6',
      'lodash-es': '^4.17.21',
      nprogress: '^0.2.0',
      'react-router-dom': '^6.14.2',
      zustand: '^4.5.0',
    }

    fullDevDepPackages = {
      '@types/lodash-es': '^4.17.12',
      '@types/nprogress': '^0.2.3',
    }
  }

  let millionPackage = {}

  if (million) {
    millionPackage = {
      million: '^3.0.3',
    }
  }

  const huskyPackages = {
    'simple-git-hooks': '^2.9.0',
    'lint-staged': '^15.2.0',
  }

  let rzpackVersion = '0.2.6'
  try {
    rzpackVersion = (await run('npm view rzpack version')).replace(/\s*/g, '')
  } catch {
    rzpackVersion = '0.2.6'
  }

  const pkg = {
    name: packageName,
    version: '0.0.1',
    scripts: {
      dev: 'rzpack',
      ...(rs ? { 'dev:rs': 'nodemon' } : {}),
      build: 'rzpack build',
      'build:time': 'rzpack build --bundle-time',
      'build:size': 'rzpack build --bundle-size',
      preview: 'rzpack preview',
      prepare: 'npx simple-git-hooks',
      ...commitScripts,
      ...lintScripts,
    },
    browserslist: ['>0.2%', 'not dead', 'not IE 11', 'not op_mini all'],
    'simple-git-hooks': {
      'pre-commit': 'npx lint-staged',
      ...commitGitHooks,
    },
    ...lintStagedScripts,
    license: 'MIT',
    ...commitizenConfig,
    dependencies: {
      react: '^18.2.0',
      'react-dom': '^18.2.0',
      ...antdPackages,
      ...fullDepPackages,
    },
    devDependencies: {
      '@types/react': '^18.2.48',
      '@types/react-dom': '^18.2.18',
      rzpack: `^${rzpackVersion}`,
      typescript: '5.3.3',
      nodemon: '^3.0.3',
      ...fullDevDepPackages,
      ...commitLintPackages,
      ...jsLintPackages,
      ...huskyPackages,
      ...stylelintPackage,
      ...millionPackage,
    },
  }
  fs.writeFileSync(
    path.resolve(process.env.ROOT, 'package.json'),
    JSON.stringify(pkg, null, 2),
  )
}
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

  fs.writeFileSync(path.resolve(process.env.ROOT, 'README.md'), info)
}
/**
 * 渲染配置文件
 * @param {PromptsResult} result
 */
export const renderConfig = (result: PromptsResult) => {
  const { projectName, cssScoped, jtsLoader, template, million, imageMini } =
    result
  const isTsTemplate = template === Template.TS

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

  fs.writeFileSync(
    path.resolve(process.env.ROOT, 'rzpack.config.ts'),
    `import { defineConfig${
      jtsLoader ? ', JSX_TOOLS' : ''
    } } from 'rzpack'\n\n` +
      'export default defineConfig({\n' +
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
/**
 * 渲染commitlint配置文件
 */
export const renderLintConfig = () => {
  fs.writeFileSync(
    pathResolve('commitlint.config.js', process.env.ROOT),
    'module.exports = {\n' +
      `  extends: ['@commitlint/config-conventional', 'cz'],\n` +
      '}\n',
  )
  fs.writeFileSync(
    pathResolve('cz.config.js', process.env.ROOT),
    'module.exports = {\n' +
      '  messages: {\n' +
      `    type: '请选择要提交的更改类型: ',\n` +
      `    subject: '请输入此次更改内容的简短描述:',\n` +
      `    body: '请输入此次更改内容的详细描述[可选]:',\n` +
      `    confirmCommit: '是否提交本次内容?',\n` +
      '  },\n' +
      `  skipQuestions: ['breaking', 'scope', 'footer'],\n` +
      '  subjectLimit: 100,\n' +
      '  types: [\n' +
      `    { value: 'feat', name: 'feat: 新功能' },\n` +
      `    { value: 'fix', name: 'fix: Bug修复' },\n` +
      `    { value: 'docs', name: 'docs: 文档更改' },\n` +
      `    { value: 'style', name: 'style: 不影响代码含义的更改(空白、格式、缺少分号等)' },\n` +
      `    { value: 'refactor', name: 'refactor: 代码重构' },\n` +
      `    { value: 'perf', name: 'perf: 性能优化' },\n` +
      `    { value: 'test', name: 'test: 测试更改' },\n` +
      '    {\n' +
      `      value: 'build',\n` +
      `      name: 'build: 影响构建系统或外部依赖关系的更改(示例范围: gulp、Brocoli、npm)',\n` +
      '    },\n' +
      `    { value: 'ci', name: 'ci: CI配置文件和脚本更改' },\n` +
      `    { value: 'chore', name: 'chore: 其他' },\n` +
      `    { value: 'revert', name: 'revert: 代码回退' },\n` +
      '  ],\n' +
      '}\n',
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
    JSON.stringify(versionConfig, null, 2),
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
    'node_modules\nbin\n*.log\n.vscode\n.DS_Store\ndist',
  )
}

/**
 * 在目标目录下生成nodemon.json文件
 */
export const renderNodemon = async () => {
  const config = {
    watch: ['rzpack.config.ts'],
    exec: 'npm run dev',
  }
  fs.writeFileSync(
    path.resolve(process.env.ROOT, 'nodemon.json'),
    JSON.stringify(config, null, 2),
  )
}
