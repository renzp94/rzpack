import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import {
  bundleTsFile,
  fileExists,
  getFileFullPath,
  getPackageVersion,
  requireFile,
  requireResolve,
} from 'rzpack-utils'
import type WebpackChain from 'webpack-chain'
import { rzpack } from '../cli'
import { getBuildTmpFilePath } from '../configs'
import type { LessVars, RzpackConfigs } from './../index'

/**
 * 应用公共css loader
 * @param rule rule实例
 * @returns 返回rule实例
 */
const applyCommonLoader = (
  rule: WebpackChain.Rule<WebpackChain.Rule<WebpackChain.Module>>,
  cssScoped?: boolean,
) => {
  if (rzpack.mode === 'development') {
    rule.use('style-loader').loader(requireResolve('style-loader'))
  } else {
    rule.use('mini-css-extract-loader').loader(MiniCssExtractPlugin.loader)
  }

  const postcssPlugins: Array<unknown> = [
    requireResolve('postcss-flexbugs-fixes'),
    [
      requireResolve('postcss-preset-env'),
      {
        autoprefixer: {
          flexbox: 'no-2009',
        },
        stage: 3,
      },
    ],
    requireResolve('postcss-normalize'),
  ]
  rule
    .use('css-loader')
    .loader(requireResolve('css-loader'))
    .options({
      modules: {
        auto: true,
        localIdentName: '[local]--[hash:base64:10]',
        exportLocalsConvention: 'camelCaseOnly',
      },
    })
    .end()
    .use('postcss-loader')
    .loader(requireResolve('postcss-loader'))
    .options({
      postcssOptions: {
        ident: 'postcss',
        config: false,
        plugins: postcssPlugins,
      },
    })
    .end()

  if (cssScoped) {
    rule
      .use('css-scoped-loader')
      .loader(requireResolve('@renzp/css-scoped-loader'))
      .end()
  }

  return rule
}

// antd5主题设置跳转转px的key
const skipToPxKeys = [
  'motionBase',
  'motionUnit',
  'opacityImage',
  'zIndexBase',
  'zIndexPopupBase',
  'lineHeight',
  'lineHeightHeading1',
  'lineHeightHeading2',
  'lineHeightHeading3',
  'lineHeightHeading4',
  'lineHeightHeading5',
  'lineHeightLG',
  'lineHeightSM',
]

/**
 * 使用antd主题
 * @param antdTheme
 * @returns 返回modifyVars
 */
const useAntdTheme = (antdTheme: LessVars) => {
  let modifyVars = {}

  if (antdTheme) {
    // 处理主题变量
    if (antdTheme.file) {
      const themeFullPath = getFileFullPath(antdTheme.file)
      if (fileExists(themeFullPath)) {
        try {
          modifyVars = requireFile(themeFullPath) ?? {}
        } catch {
          const tmpFilePath = getBuildTmpFilePath('antd-theme')
          modifyVars = bundleTsFile(themeFullPath, tmpFilePath)
        }
      }
    }
    let antdVersion = getPackageVersion('antd')
    if (antdVersion < 5 && antdTheme.vars) {
      antdVersion = parseInt(antdVersion)
    }

    // 直接定义的变量优先级高于变量文件
    if (antdTheme.vars) {
      modifyVars = { ...modifyVars, ...antdTheme.vars }
    }

    if (antdVersion > 4) {
      const keys = Object.keys(modifyVars).filter(
        (key) => !skipToPxKeys.includes(key),
      )
      modifyVars = keys.reduce((prev, curr) => {
        let value = modifyVars[curr]
        if (typeof value === 'number') {
          value = `${value}px`
        }
        return { ...prev, [curr]: value }
      }, {})
    }
  }

  return modifyVars
}
/**
 * 解析less全局变量
 * @param lessVars
 * @returns 返回globalVars
 */
const useLessVars = (lessVars: LessVars) => {
  let globalVars = {}
  if (lessVars) {
    // 处理全局less变量
    if (lessVars.file) {
      const globalVarsFullPath = getFileFullPath(lessVars.file)
      if (fileExists(globalVarsFullPath)) {
        try {
          globalVars = requireFile(globalVarsFullPath) ?? {}
        } catch {
          const tmpFilePath = getBuildTmpFilePath('global-vars')
          globalVars = bundleTsFile(globalVarsFullPath, tmpFilePath)
        }
      }
    }
    // 直接定义的变量优先级高于变量文件
    if (lessVars.vars) {
      globalVars = { ...globalVars, ...lessVars.vars }
    }
  }

  return globalVars
}
/**
 * 应用预处理的loader
 * @param rule rule实例
 * @param loader 预处理的loader
 * @param options loader参数
 */
const applyPreCssLoader = (
  rule: WebpackChain.Rule<WebpackChain.Rule<WebpackChain.Module>>,
  loader: string,
  antdTheme?: LessVars,
  lessVars?: LessVars,
) => {
  if (loader) {
    const modifyVars = useAntdTheme(antdTheme)
    const globalVars = useLessVars(lessVars)

    const options =
      loader === 'less-loader'
        ? {
            lessOptions: {
              modifyVars,
              globalVars,
              javascriptEnabled: true,
            },
          }
        : undefined

    rule.use(loader).loader(requireResolve(loader)).options(options)
  }
}
/**
 * 创建css规则
 * @param baseRule rule实例
 * @param lang css语言
 * @param cssModule 是否为css module
 * @param options loader的配置
 */
export const createCssRule = (
  baseRule: WebpackChain.Rule<WebpackChain.Module>,
  lang: string,
  cssScoped: boolean,
  antdTheme?: LessVars,
  lessVars?: LessVars,
) => {
  const regexps = {
    css: [/\.css$/, /\.module\.css$/, /\.scoped\.css$/],
    less: [/\.less$/, /\.module\.less$/, /\.scoped\.less$/],
  }
  const [cssTest, cssModuleTest, cssScopedTest] = regexps[lang]

  const rule = baseRule
    .oneOf(lang)
    .test(cssTest)
    .exclude.add(cssModuleTest)
    .add(cssScopedTest)
    .end()
  applyCommonLoader(rule)
  const moduleRule = baseRule.oneOf(`${lang}-module`).test(cssModuleTest)
  applyCommonLoader(moduleRule)

  if (lang === 'less') {
    applyPreCssLoader(rule, 'less-loader', antdTheme, lessVars)
    applyPreCssLoader(moduleRule, 'less-loader', antdTheme, lessVars)
  }

  if (cssScoped) {
    const scopedRule = baseRule.oneOf(`${lang}-scoped`).test(cssScopedTest)
    applyCommonLoader(scopedRule, cssScoped)
    applyPreCssLoader(scopedRule, 'less-loader', antdTheme, lessVars)
  }
}

export default (
  webpackChain: WebpackChain,
  { antdTheme, lessVars, assets }: RzpackConfigs,
) => {
  const baseRule = webpackChain.module.rule('css')
  createCssRule(baseRule, 'css', assets?.cssScoped)
  createCssRule(baseRule, 'less', assets?.cssScoped, antdTheme, lessVars)
}
