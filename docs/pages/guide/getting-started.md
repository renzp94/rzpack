# 快速开始

## 环境要求

`node`版本: `>=16.0.0`。

### 搭建第一个Rzpack项目

::: code-group

```sh [npm]
$ npm create rzpack
```

```sh [pnpm]
$ pnpm create rzpack
```

```sh [yarn]
$ yarn create rzpack
```

```sh [bun]
$ bun create rzpack
```

:::

然后按照提示操作即可！

## 模板

你还可以通过附加的命令行选项直接指定项目名称和模板，例如：创建一个基础的Ts模板：
```sh
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

```sh
cd rzpack-app

npm install
npm run dev
```

## 命令行界面

```json
"scripts": {
  "dev": "rzpack",
  "build": "rzpack build",
  "preview": "rzpack preview"
}
```

可以指定额外的命令行选项，如: `--config`。运行`npx rzpack --help`获得完整的命令行选项列表。

查看[命令行界面](/guide/cli)了解更多细节。