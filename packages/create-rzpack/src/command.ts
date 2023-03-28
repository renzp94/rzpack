import type { CLIOptions } from '.'

const getCommands = (projectName: string, options: CLIOptions) => {
  const filterOptions = Object.keys(options)
    .filter((key) => key !== '--')
    .reduce((prev: any, key: string) => {
      return {
        ...prev,
        [key]: options[key],
      }
    }, {})
  return {
    projectName,
    ...filterOptions,
  }
}

export default getCommands
