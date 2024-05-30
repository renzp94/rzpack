# 常见问题

## 网站标题更改

推荐使用配置文件配置

```ts
import { defineConfig } from 'rzpack'

export default defineConfig({
  html: {
    title: 'rzpack-app',
  },
})
```

## 支持`css module`吗？

默认开启`css module`，文件后缀为`*.module.less`即可。

## `css Scoped`怎么开启和使用

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

## 如何快速定位需要修改哪个`antd`的变量？

变量地址参考: [定制主题](https://ant-design.antgroup.com/docs/react/customize-theme-cn#theme)

## `svg`怎么用？

脚手架引入[svgr](https://react-svgr.com/docs/webpack/)。

- 默认一个 svg 会被编译成 React 组件。
- 如果需要使用地址，不想被编译成组件，可以在 URL 后面加上?url

```css
.content {
  background-image: url('./some-svg.svg?url');
}
```

## 怎么配置接口代理

### 可视化配置
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

### webpack配置

如果想通过webpack/rspack参数配置，可通过配置文件的`server`属性配置，配置方法参考[server](/configs.html#server-开发服务)

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

## 自定义配置

如果想通过webpack/rspack配置，可通过配置文件的`rzpackChain`属性配置，配置方法参考[rzpackChain](/configs.html#rzpackchain-自定义配置)

## 提速开发环境

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
