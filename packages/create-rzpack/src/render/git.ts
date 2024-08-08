import fs from 'node:fs'
import { pathResolve, run } from 'rzpack-utils'

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
