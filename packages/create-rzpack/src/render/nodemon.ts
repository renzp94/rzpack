import fs from 'node:fs'
import { pathResolve } from 'rzpack-utils'

/**
 * 在目标目录下生成nodemon.json文件
 */
export const renderNodemon = async () => {
  const config = {
    watch: ['rzpack.config.ts'],
    exec: 'npm run dev',
  }
  fs.writeFileSync(
    pathResolve('nodemon.json', process.env.ROOT),
    JSON.stringify(config, null, 2),
  )
}
