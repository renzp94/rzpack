import { exec } from 'child_process'

/**
 * 执行命令
 * @param {string} command 执行的命令
 * @param {readonly string[]} args 命令参数
 * @returns 返回命令执行的结果
 */
export const run = async (command: string) => {
  return new Promise((resolve, reject) => {
    exec(command, { cwd: process.env.ROOT }, (err) => {
      if (err != null) {
        return reject(err)
      }

      return resolve(null)
    })
  })
}
