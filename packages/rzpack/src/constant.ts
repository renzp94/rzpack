import { BUILDER as _BUILDER } from '.'
import pkg from '../package.json'

export const NAME = pkg.name
export const VERSION = pkg.version
export enum DEFAULT_CONFIG {
  CONFIG_FILE = 'rzpack.config.ts',
  ENTRY = './src/main.tsx',
  HTML = './index.html',
  FAVICON = './favicon.ico',
  STATIC_DIR = 'public',
  OUTPUT = 'dist',
}
