import fs from 'node:fs'
import { pathResolve, run } from 'rzpack-utils'
import { Template } from '..'
import { JS_LINT, type PromptsResult } from '../prompts'

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
  const isAdminTemplate =
    template && [Template.ADMIN, Template.ADMIN_HEADER_MENU].includes(template)
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
      '@commitlint/cli': '^18.6.1',
      '@commitlint/config-conventional': '^18.6.3',
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
    let rzpackLintVersion = '0.0.3'
    try {
      rzpackLintVersion = (
        await run('npm view eslint-config-rzpack version')
      ).replace(/\s*/g, '')
    } catch {
      rzpackLintVersion = '0.0.3'
    }

    const eslintPackages = {
      eslint: '^8.57.0',
      prettier: '^3.3.2',
      'eslint-config-rzpack': `^${rzpackLintVersion}`,
    }
    const biomePackages = {
      '@biomejs/biome': '^1.8.2',
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
      stylelint: '^16.6.1',
      'stylelint-config-property-sort-order-smacss': '^10.0.0',
      'stylelint-config-standard': '^36.0.1',
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
      '@ant-design/icons': '^5.3.7',
      antd: '^5.18.3',
      dayjs: '^1.11.11',
    }
  }

  let fullDepPackages = {}
  let fullDevDepPackages = {}
  if (isAdminTemplate) {
    fullDepPackages = {
      '@renzp/storage': '^1.0.0',
      '@renzp/utils': '^0.3.1',
      axios: '^1.7.2',
      nprogress: '^0.2.0',
      'react-router-dom': '^6.23.1',
      zustand: '^4.5.2',
    }

    fullDevDepPackages = {
      '@types/nprogress': '^0.2.3',
    }
  }

  let millionPackage = {}

  if (million) {
    millionPackage = {
      million: '^3.1.11',
    }
  }

  const huskyPackages = {
    'simple-git-hooks': '^2.11.1',
    'lint-staged': '^15.2.7',
  }

  let rzpackVersion = '0.4.0'
  try {
    rzpackVersion = (await run('npm view rzpack version')).replace(/\s*/g, '')
  } catch {
    rzpackVersion = '0.4.0'
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
      react: '^18.3.1',
      'react-dom': '^18.3.1',
      ...antdPackages,
      ...fullDepPackages,
    },
    devDependencies: {
      '@types/react': '^18.3.3',
      '@types/react-dom': '^18.3.0',
      rzpack: `^${rzpackVersion}`,
      typescript: '5.5.2',
      nodemon: '^3.1.4',
      ...fullDevDepPackages,
      ...commitLintPackages,
      ...jsLintPackages,
      ...huskyPackages,
      ...stylelintPackage,
      ...millionPackage,
    },
  }
  fs.writeFileSync(
    pathResolve('package.json', process.env.ROOT),
    JSON.stringify(pkg, null, 2),
  )
}
