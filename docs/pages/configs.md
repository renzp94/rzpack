# 配置

## antdTheme 主题配置

- 类型：`LessVars`

```ts
export interface LessVars {
  // 全局变量(直接定义的变量优先级高于变量文件)
  vars?: Record<string, string>
  // 全局变量文件
  file?: string
}
```

设置`antd`主题变量，可通过`file`属性直接设置配置文件路径，配置文件中需要默认导出一个配置对象。也可通过`vars`直接设置变量。

```ts
antdTheme: {
  file: './src/theme/index.ts',
  vars: {
    colorPrimary: 'blue',
  },
}
```

## lessVars 变量注入

- 类型：`LessVars`

```ts
export interface LessVars {
  // 全局变量(直接定义的变量优先级高于变量文件)
  vars?: Record<string, string>
  // 全局变量文件
  file?: string
}
```

注入`less`全局变量，可通过`file`属性直接设置配置文件路径，配置文件中需要默认导出一个配置对象。也可通过`vars`直接设置变量。

```ts
antdTheme: {
  file: './src/theme/globalVars.ts',
  vars: {
    testColor: 'red',
  },
}
```

## assets 资源处理

- 类型：`RzpackAssets`
  
```ts
export interface RzpackAssets {
  // jsx编译处理器
  jsxTools?: JSX_TOOLS
  // 是否使用cssScoped(类似Vue的scoped功能)
  cssScoped?: boolean
  // 是否压缩图片
  imageMini?: boolean
}
```

配置资源文件处理方式

### jsxTools

- 类型：`JSX_TOOLS`
- 默认：`JSX_TOOLS.ESBUILD`

```ts
export enum JSX_TOOLS {
  ESBUILD = 'esbuild',
  SWC = 'swc',
}
```

`jsx`文件编译处理器。

### imageMini

- 类型：`boolean`

是否压缩图片。

> 注意：在打包过程中压缩图片，会拖慢打包速度，建议手动压缩。

## buildInfo 编译信息

- 类型：`boolean | BuildInfoWebpackPluginOptions`

是否在控制台打印编译信息。更多配置参考：[@renzp/build-info-webpack-plugin](https://github.com/renzp94/build-info-webpack-plugin)

## cache 缓存

- 类型：`boolean`
- 默认 ：`true`

是否使用webpack5缓存。

## entry 入口

- 类型：`string\|string[]\|Record<string, string>`
- 默认 ：`./src/main.tsx`

打包入口。

## gzip 压缩

- 类型：`boolean`

是否启用gzip。

## html

- 类型：`HtmlWebpackPlugin.Options`
- 默认：`index.html`

htmlPlugin插件设置。配置参考: [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)。

## output 输出

- 类型：`Output`
- 默认 ：`dist`

输出目录。配置参考：[Output](https://webpack.js.org/concepts/#output)

## publicPath

- 类型：`string`
- 默认 ：`public`

静态资源目录。

## server 开发服务

- 类型：`WebpackDevServerConfiguration`

开发服务器配置，当开启可视化配置时此处配置的接口代理无效。配置参考：[dev-server](https://webpack.js.org/configuration/dev-server/)

## lazyCompilation 懒编译

- 类型：`LazyCompilationOptions`

懒编译。配置参考：[lazycompilation](https://webpack.js.org/configuration/experiments/#experimentslazycompilation)

## moduleFederation 模块联邦

- 类型：`ModuleFederationPluginOptions`

```ts
export interface ModuleFederationShared {
  name: string
  requiredVersion: string
}

export interface ModuleFederationSharedAuto {
  deps: string[]
  depsPackagePath: string
}

export interface ModuleFederationPluginOptions {
  // 模块名称
  name: string
  // 模块导出名称
  filename?: string
  // 要共享的依赖
  shared?: ModuleFederationShared[] | ModuleFederationSharedAuto
  // 模块暴露的内容
  exposes?: boolean | Record<string, string>
  // 模块引入的内容
  remotes?: Record<string, string>
}
```

模块联邦。

## webpackChain 自定义配置

- 类型：`RzpackWebpackChain`

```ts
export type RzpackWebpackChain = (w: WebpackChain) => WebpackChain
```

使用webpackChain重写webpack配置。webpackChain用法参考：[webpackChain](https://github.com/neutrinojs/webpack-chain?tab=readme-ov-file)

## proxyFile

- 类型：`string`
- 默认：`./proxy.config.json`

可视化配置的代理，仅在开启可视化配置时才生效。

## reactRefresh React热更新

- 类型：`string`

是否开启React代码热更新。

## million React性能优化

- 类型：`boolean\|MillionOptions`

是否使用Million.js。配置参考：[Million.js](https://million.dev/zh-CN)