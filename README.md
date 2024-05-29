<p align="center"><a href="https://github.com/renzp94/rzpack" target="_blank" rel="noopener noreferrer"><img width="200" src="./logo.png" alt="rzpack logo"></a></p>
<p align="center">
  <a href="https://npmcharts.com/compare/rzpack?minimal=true"><img src="https://img.shields.io/npm/dm/rzpack.svg?sanitize=true" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/rzpack"><img src="https://img.shields.io/npm/v/rzpack.svg?sanitize=true" alt="Version"></a>
  <a href="https://www.npmjs.com/package/rzpack"><img src="https://img.shields.io/bundlejs/size/rzpack?sanitize=true" alt="size"></a>
  <a href="https://www.npmjs.com/package/rzpack"><img src="https://img.shields.io/npm/l/rzpack.svg?sanitize=true" alt="License"></a>
</p>
<p align="center">
  <a href="https://github.com/renzp94/rzpack/watchers"><img src="https://img.shields.io/github/watchers/renzp94/rzpack.svg?style=social" alt="watchers"></a>
  <a href="https://github.com/renzp94/rzpack/stars"><img src="https://img.shields.io/github/stars/renzp94/rzpack.svg?style=social" alt="stars"></a>
</p>

# rzpack

### 介绍
  `Rzpack`是一款基于`Webpack5`/`Rspack`开发的React打包工具，通过`Webpack5`的`cache`、`lazyCompilation`特性及`esbuild`、`swc`等工具的配合，或者使用由`Rust`开发的`Rspack`，大大提高开发环境的启动速度，热更速度及打包速度，内置了许多功能，无需复杂的配置即可快速开发。同时配套的`create-rzpack`可以快速创建项目模板，省去项目框架搭建的时间。

### 环境配置

node 版本: `>=16.0.0`。推荐使用`nvm`进行 node 版本控制。

### 模板创建

```shell
# npm
npm create rzpack

# yarn
yarn create rzpack

# pnpm
pnpm create rzpack
```

然后按照提示操作即可！
你还可以通过附加的命令行选项直接指定项目名称和模板，例如：创建一个基础的Ts模板：
```shell
# npm
npm create rzpack rzpack-app --template react-ts

# yarn
yarn create rzpack rzpack-app --template react-ts

# pnpm
pnpm create rzpack rzpack-app --template react-ts
```

模板列表：
- `react-ts` - ts模板
- `antd` - antd模版
- `admin` - 基础后台管理平台(侧边菜单版)的模版
- `admin-header-menu` - 基础后台管理平台(顶部菜单版)的模版

模板推荐使用`admin-header-menu`，选择模板之后还有：`JSX文件处理Loader`、`cssScoped(类似Vue的style scoped)`、`commitLint`功能可以选择。

### 项目结构

基于`admin-header-menu`模板说明

```shell
|--src
|  |--api
|  |  |--axios      // 请求方法的封装
|  |  |--system.ts  // 基础框架需要的请求
|  |--assets // 静态资源
|  |  |--img
|  |  |--svg
|  |  |  |--menu  // 菜单图标
|  |--components  // 基础组件
|  |--layout      // 页面布局
|  |--model       // 数据模型(一般为后端返回数据的类型定义)
|  |--pages       // 业务页面
|  |--routes // 路由
|  |  |--routes.ts // mock使用的数据
|  |  |--tools.tsx // 路由处理方法
|  |--stores // 页面store
|  |--theme  // 主题变量
|  |  |--globalVars.ts // 全局变量
|  |  |--index.ts      // 覆盖antd的全局变量
|  |  |--reset.less // 无法通过antd变量覆盖的样式，通过此文件样式覆盖
|  |--utils // 公共方法和hooks
|  |  |--constants.ts      // 常量
|  |  |--storage.ts        // 本地缓存工具
|  |  |--tools.tsx         // 常用方法
|  |  |--useModal.tsx      // Modal组件hooks
|  |  |--useQuery.tsx      // react router的query参数获取
|  |--app.less // 全局样式
|  |--App.tsx  // App组件
|  |--main.tsx // 入口组件
|--rzpack.config.ts // 脚手架配置文件
```

### 开发环境

通过配置`packages.json`的脚本命令启动开发环境，并且可指定参数。
```json
{
  "scripts": "rzpack"
}
// 或者
{
  "scripts": "rzpack dev"
}
// 或者
{
  "scripts": "rzpack start"
}
```

#### 参数
| 属性     | 说明                 | 类型    | 默认                 | 是否必填 |
| -------- | -------------------- | ------- | -------------------- | -------- |
| --c      | 指定配置文件         | string  | `./rzpack.config.ts` | 非必填   |
| --config | 指定配置文件         | string  | `./rzpack.config.ts` | 非必填   |
| --m      | 指定webpack启动模式  | string  | `development`        | 非必填   |
| --mode   | 指定webpack启动模式  | string  | `development`        | 非必填   |
| --host   | 开发服务的host       | string  | -                    | 非必填   |
| --port   | 开发服务的端口       | number  | -                    | 非必填   |
| --open   | 是否启动后自动打开   | boolean | -                    | 非必填   |
| --ui     | 是否启动可视化配置页 | boolean | true                 | 非必填   |

### 打包

通过配置`packages.json`的脚本命令打包，并且可指定参数。
```json
{
  "scripts": "rzpack build"
}
```

#### 参数
| 属性         | 说明                       | 类型    | 默认                 | 是否必填 |
| ------------ | -------------------------- | ------- | -------------------- | -------- |
| --c          | 指定配置文件               | string  | `./rzpack.config.ts` | 非必填   |
| --config     | 指定配置文件               | string  | `./rzpack.config.ts` | 非必填   |
| --m          | 指定webpack启动模式        | string  | `production`         | 非必填   |
| --mode       | 指定webpack启动模式        | string  | `production`         | 非必填   |
| --outDir     | 打包输出目录               | string  | `dist`               | 非必填   |
| --bundleSize | 是否开启打包文件大小分析页 | boolean | -                    | 非必填   |
| --bundleTime | 是否输出打包时间           | boolean | -                    | 非必填   |

### 配置

| 属性             | 说明                                                                                | 类型                                       | 默认              | 是否必填 |
| ---------------- | ----------------------------------------------------------------------------------- | ------------------------------------------ | ----------------- | -------- |
| builder          | 打包器                                                                              | `BUILDER`                                  | `BUILDER.WEBPACK` | 非必填   |
| antdTheme        | antd主题变量设置                                                                    | `LessVars`                                 | -                 | 非必填   |
| lessVars         | less全局变量设置                                                                    | `LessVars`                                 | -                 | 非必填   |
| assets           | 资源文件处理                                                                        | `RzpackAssets`                             | -                 | 非必填   |
| buildInfo        | 是否在控制台打印编译信息                                                            | `boolean\|BuildInfoWebpackPluginOptions`   | -                 | 非必填   |
| cache            | 是否使用持久化缓存(目前Webpack仅支持)                                               | boolean                                    | true              | 非必填   |
| entry            | 打包入口                                                                            | `string\|string[]\|Record<string, string>` | `./src/main.tsx`  | 非必填   |
| gzip             | 是否启用gzip                                                                        | boolean                                    | -                 | 非必填   |
| html             | htmlPlugin/HtmlRspackPlugin插件设置(配置参考htmlWebpackPlugin/HtmlRspackPlugin插件) | `HtmlWebpackPlugin.Options`                | -                 | 非必填   |
| output           | 输出目录                                                                            | `Output`                                   | `dist`            | 非必填   |
| publicPath       | 静态资源目录                                                                        | string                                     | `public`          | 非必填   |
| server           | 代理配置，当开启可视化配置时此处配置的接口代理无效                                  | `WebpackDevServerConfiguration`            | -                 | 非必填   |
| lazyCompilation  | 实验性功能                                                                          | `LazyCompilationOptions`                   | -                 | 非必填   |
| moduleFederation | 模块联邦                                                                            | `ModuleFederationPluginOptions`            | -                 | 非必填   |
| webpackChain     | 使用webpackChain重写webpack配置(0.2.x以下支持)                                      | `RzpackWebpackChain`                       | -                 | 非必填   |
| rzpackChain      | 使用webpackChain重写webpack/rspack配置(0.3.x支持)                                   | `RzpackWebpackChain`                       | -                 | 非必填   |
| proxyFile        | 可视化配置的代理，仅在开启可视化配置时才生效                                        | string                                     | -                 | 非必填   |
| reactRefresh     | 是否开启React代码热更新                                                             | boolean                                    | -                 | 非必填   |
| million          | 是否使用Million.js                                                                  | `boolean\|MillionOptions`                  | -                 | 非必填   |

```ts
export enum BUILDER {
  WEBPACK = 'webpack',
  RSPACK = 'rspack',
}

export interface LessVars {
  // 全局变量(直接定义的变量优先级高于变量文件)
  vars?: Record<string, string>
  // 全局变量文件
  file?: string
}


export interface RzpackAssets {
  // jsx编译处理器
  jsxTools?: JSX_TOOLS
  // 是否使用cssScoped(类似Vue的scoped功能)
  cssScoped?: boolean
  // 是否压缩图片
  imageMini?: boolean
}

export enum JSX_TOOLS {
  ESBUILD = 'esbuild',
  SWC = 'swc',
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

export type RzpackWebpackChain = (w: WebpackChain) => WebpackChain
```

### 常见问题

#### 1. 网站标题更改

推荐使用配置文件配置

```ts
import { defineConfig } from 'rzpack'

export default defineConfig({
  html: {
    title: 'rzpack-app',
  },
})
```

#### 2. 支持 css module 吗？

默认开启`css module`，文件后缀为`*.module.less`即可。

#### 3. css Scoped怎么开启和使用

通过配置文件设置`assets.cssScoped: true`，文件后缀为`*.scoped.less`即可。

```ts
import { defineConfig } from 'rzpack'

export default defineConfig({
  assets: {
    cssScoped: true,
  },
})
```

`css Scoped`使用的库：[@renzp/jsx-scoped-loader](https://www.npmjs.com/package/@renzp/jsx-scoped-loader)、[@renzp/css-scoped-loader](https://www.npmjs.com/package/@renzp/css-scoped-loader)

原理：通过将css文件中的类名全部转化为`xx[data-scoped-xxx]`，然后将每个有className的元素加上`data-scoped-xxx`属性

`css`
```css
/* 转化前 */
.test{
  color: red;
}
/* 转化后 */
.test[data-scoped-729a2688]{
  color:red;
}
```

`tsx`

```tsx
// 转化前
<div className="test">test</div>
// 转化后
<div class="test" data-scoped-729a2688="true">test</div>
```

如果需要在css Scoped文件中写全局样式可以通过`::global`

```css
::global .test {
  color: red;
}
```

#### 4. 如何快速定位需要修改哪个 antd 的变量？

变量地址参考: [定制主题](https://ant-design.antgroup.com/docs/react/customize-theme-cn#theme)

#### 5. svg 怎么用？

脚手架引入[svgr](https://react-svgr.com/docs/webpack/)。

- 默认一个 svg 会被编译成 React 组件。
- 如果需要使用地址，不想被编译成组件，可以在 URL 后面加上?url

```css
.content {
  background-image: url('./some-svg.svg?url');
}
```

#### 6.怎么配置接口代理

##### 可视化配置
如果使用了可视化配置页面(推荐使用)，则直接通过页面配置即可，会自动在根目录下生成`proxy.config.json`文件。启动开发环境后，则会有`http://127.0.0.1:8000/__RZPACK_UI__`为可视化配置的路径
```bash
Rzpack UI run at: 
 - Local:     http://127.0.0.1:8000/__RZPACK_UI__
 - Network:   http://10.220.39.128:8000/__RZPACK_UI__


App run at: 
 - Local:     http://127.0.0.1:8000
 - Network:   http://10.220.39.128:8000

 Note that the development build is not optimized.
 To create a production build, run yarn build.
```

##### webpack配置

如果想通过webpack参数配置，可通过配置文件的`server`属性配置，配置方法参考[devServer.proxy](https://webpack.docschina.org/configuration/dev-server/#devserverproxy)

```ts
import { defineConfig } from 'rzpack'

export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://127.0.0.0:3000',
    },
  },
})
```

> Tips: 注意，可视化的优先级高于webpack配置，即：如果开启可视化配置，则webpack配置的代理无效

#### 7.提速开发环境

默认使用`esbuild`打包，同时默认开启了`Webpack5`的`cache`功能。如果还不满意的话，可以开启`webpack5`的`lazyCompilation(懒编译)`：`lazyCompilation: { imports: true, entries: false }`。懒编译参考文档: [experiments.lazyCompilation](https://webpack.docschina.org/configuration/experiments/#experimentslazycompilation)，特别注意：懒编译只能在开发环境中启用，生产环境即使配置了也是禁用的。

```ts
import { defineConfig, JSX_TOOLS } from 'rzpack'

export default defineConfig({
  assets: {
    jsxTools: JSX_TOOLS.ESBUILD,
  },
  lazyCompilation: {
    imports: true,
    entries: false,
  },
})
```
