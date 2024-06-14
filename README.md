<p align="center"><a href="https://github.com/renzp94/rzpack" target="_blank" rel="noopener noreferrer"><img width="200" src="./logo.png" alt="rzpack logo"></a></p>
<p align="center">
  <a href="https://www.npmjs.com/package/rzpack"><img src="https://img.shields.io/bundlejs/size/rzpack?sanitize=true" alt="size"></a>
  <a href="https://npmcharts.com/compare/rzpack?minimal=true"><img src="https://img.shields.io/npm/dm/rzpack.svg?sanitize=true" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/rzpack"><img src="https://img.shields.io/npm/v/rzpack.svg?sanitize=true" alt="Version"></a>
  <a href="https://www.npmjs.com/package/rzpack"><img src="https://img.shields.io/npm/l/rzpack.svg?sanitize=true" alt="License"></a>
</p>

# rzpack

### 介绍
  `Rzpack`是一款基于`Webpack5`/`Rspack`开发的`React`打包工具，通过`Webpack5`的`cache`、`lazyCompilation`特性及`esbuild`、`swc`等工具的配合，或者使用由`Rust`开发的`Rspack`，大大提高开发环境的启动速度，热更速度及打包速度，内置了许多功能，无需复杂的配置即可快速开发。同时配套的`create-rzpack`可以快速创建项目模板，省去项目框架搭建的时间。

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

更多详情查看[文档](https://rzpack.deno.dev)
