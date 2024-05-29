import { exec } from 'node:child_process'

/**
 * 执行命令
 * @param {string} command 执行的命令
 * @param {readonly string[]} args 命令参数
 * @returns 返回命令执行的结果
 */
export const run = async (command: string) => {
  return new Promise<string>((resolve, reject) => {
    exec(command, { cwd: process.env.ROOT }, (err, stdout) => {
      if (err != null) {
        return reject(err)
      }

      return resolve(stdout)
    })
  })
}
