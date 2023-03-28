import pkg from '../package.json'

export const NAME = pkg.name
export const VERSION = pkg.version
export enum DEFAULT_CONFIG {
  ENTRY = './src/main.tsx',
  HTML = './index.html',
  FAVICON = './favicon.ico',
  STATIC_DIR = 'public',
}
