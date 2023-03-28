// less css module
declare module '*.module.less' {
  interface Classes {
    [key: string]: string
  }
  const classes: Classes
  export default classes
}
// font
declare module '*.woff'
declare module '*.woff2'
declare module '*.eot'
declare module '*.ttf'
declare module '*.otf'
// images
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.svg'
declare module '*.svg?url'
