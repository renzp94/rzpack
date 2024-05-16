# 功能

## 模块热更新

Rzpack使用的Webpack，所以使用的是`webpack-dev-server`的热更新。React的热更新使用的是`@pmmmwh/react-refresh-webpack-plugin`插件实现的。React的热更新默认是不开启的，如果需要开启可指定`reactRefresh: true`开启。

## Typescript

Rzpack默认支持`.ts`和`.tsx`文件。默认使用的打包工具是`esbuild`，也可通过`assets.jsxTools`指定使用`swc`或者`esbuild`。

```ts
export enum JSX_TOOLS {
  ESBUILD = 'esbuild',
  SWC = 'swc',
}
```

## Css

导入`.css`文件将会把内容开发环境插入到`<style>`标签中生产环境打包成文件，同时也带有`HMR`支持。

### PostCSS

如果项目包含有效的`PostCSS`配置 (任何受[postcss-load-config](https://github.com/postcss/postcss-load-config)支持的格式，例如`postcss.config.js`)，它将会自动应用于所有已导入的CSS。

### CSS Modules

任何以`.module.css`为后缀名的 CSS 文件都被认为是一个`CSS modules`文件。导入这样的文件会返回一个相应的模块对象:

```css
/* button.module.css */
.button{
  background: #fff;
}

.button-primary{
  background: blue;
}
```

```js
import classes from './button.module.css'
document.getElementById('btn').className = classes.button
document.getElementById('btn-primary').className = classes.buttonPrimary
```

默认导入的对象属性名支持`小驼峰`转换。

### Css预处理器

默认支持`less`。如果需要使用其他预处理器，可以通过`webpackChain`属性自行配置webpack配置。

### Css Scoped

可通过`assets.cssScoped`开启类似于Vue的CSS Scoped功能。开启后，会自动识别`.scoped.css`文件。

## 静态资源处理

导入一个静态资源会返回解析后的 URL。对于`svg`来说，默认支持导入为React组件，如果想导入为图片地址则导入时加`?url`即可。

如果需要图片打包压缩，可指定`assets.imageMini: true`开启图片压缩，需要注意开启后打包速度将变慢。

## JSON

JSON 可以被直接导入 —— 同样支持具名导入

## Antd主题定制

可通过`antdTheme`属性进行antd主题定制配置。可指定配置文件也可直接指定变量。

## Less变量注入

可通过`lessVars`属性进行antd主题定制配置。可指定配置文件也可直接指定变量。


## 控制台输出编译信息

可通过`buildInfo: true`将`项目名`、`版本号`、`打包时间`、`打包分支`、`最后一次提交commit id`输出在控制台。

## 构建优化

可通过设置`cache`开启webpack5的缓存，以及通过`lazyCompilation`开启懒编译。

## 性能优化

可设置`gzip`开启GZIP压缩，以及`moduleFederation`配置模块联邦，`million`使用Million.js进行React性能优化。

## 接口代理

可通过`server`配置`webpack-dev-server`的接口代理。也可通过`proxyFile`配置可视化管理接口代理的json文件。注意：当开启可视化配置时，不再需要在`server`中指定接口代理。

