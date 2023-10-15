import {
  bgGray,
  bgGreen,
  bgRed,
  bgYellow,
  gray,
  green,
  red,
  white,
  yellow,
} from 'kolorist'

export const logSuccess = (msg: string) => {
  console.log(`${bgGreen(white('SUCCESS: '))} ${green(msg)}`)
}

export const logWarning = (msg: string) => {
  console.log(`${bgYellow(white('WARNING: '))} ${yellow(msg)}`)
}

export const logError = (msg: string) => {
  console.log(`${bgRed(white(' ERROR: '))} ${red(msg)}`)
}

export const logInfo = (msg: string) => {
  console.log(`${bgGray(white('   INFO: '))} ${gray(msg)}`)
}
