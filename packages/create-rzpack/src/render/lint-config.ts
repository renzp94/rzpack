import fs from 'node:fs'
import { pathResolve } from 'rzpack-utils'

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
