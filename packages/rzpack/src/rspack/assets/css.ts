import { requireResolve } from 'rzpack-utils'
import type WebpackChain from 'webpack-chain'
import type { LessVars, RzpackConfigs } from '../../index'
import { applyPreCssLoader } from '../../webpack/assets/css'

/**
 * 应用公共css loader
 * @param rule rule实例
 * @returns 返回rule实例
 */
const applyCommonLoader = (
  rule: WebpackChain.Rule<WebpackChain.Rule<WebpackChain.Module>>,
  cssScoped?: boolean,
) => {
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
    .set('type', cssScoped ? 'css' : 'css/auto')
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
  cssScoped?: boolean,
  antdTheme?: LessVars,
  lessVars?: LessVars,
) => {
  const regexps = {
    css: [/\.css$/, /\.scoped\.css$/],
    less: [/\.less$/, /\.scoped\.less$/],
  }
  const [cssTest, cssScopedTest] = regexps[lang]

  const rule = baseRule
    .oneOf(lang)
    .test(cssTest)
    .exclude.add(cssScopedTest)
    .end()
  applyCommonLoader(rule)

  if (lang === 'less') {
    applyPreCssLoader(rule, 'less-loader', antdTheme, lessVars)
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
  webpackChain.set('experiments', { css: true })
  webpackChain.module.set('parser', {
    'css/auto': {
      namedExports: false,
    },
  })
  webpackChain.module.set('generator', {
    'css/auto': {
      exportsConvention: 'camel-case',
    },
  })

  const baseRule = webpackChain.module.rule('css')
  createCssRule(baseRule, 'css', assets?.cssScoped)
  createCssRule(baseRule, 'less', assets?.cssScoped, antdTheme, lessVars)
}
