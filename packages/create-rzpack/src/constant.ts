import pkg from '../package.json'

export const VERSION = pkg.version
export const NAME = pkg.name
export enum DEFAULT_CONFIG {
  PROJECT_NAME = 'rzpack-app',
}
