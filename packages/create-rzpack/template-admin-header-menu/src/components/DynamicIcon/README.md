# DynamicIcon

动态引入图标组件

> 当前组件引入的是@/assets/icons 的所有`.svg`文件。因为动态引入 webpack 需要预先知道文件所在路径，所以此路径不可配置
> 此组件依赖于‘@svgr/webpack’和`svgo-loader`包

## Options

| 属性      | 说明             | 类型          | 默认 | 是否必填 |
| --------- | ---------------- | ------------- | ---- | -------- |
| name      | 图标名字(文件名) | string        | -    | 是       |
| className | 图标样式名       | string        | -    | 否       |
| style     | 图标样式名       | CSSProperties | -    | 否       |
| fill      | 图标颜色         | string        | -    | 否       |
| width     | 图标宽度         | string        | 1em  | 否       |
| height    | 图标高度         | string        | 1em  | 否       |

## webpack config

```js
...
webpackChain.module
  .rule('image')
  .test(/\.(png|jpg|gif|jpeg|webp|mp4)$/)
  .exclude.add(/node_modules/)
  .end()
  .use('url')
  .loader('url-loader')
  .options({
    limit: 10 * 1024,
    name: 'img/[name].[hash:8].[ext]',
  })
  .end()
  .end()
  // 处理svg可以直接导入为React组件
  .rule('svg')
  .oneOf('svg-img')
  .test(/\.svg$/)
  .exclude.add(/node_modules/)
  .end()
  .set('resourceQuery', /url/)
  .use('svg-img')
  .loader('url-loader')
  .options({
    limit: 10 * 1024,
    name: 'img/[name].[hash:8].[ext]',
  })
  .end()
  .end()
  .oneOf('svg-icon')
  .test(/\.svg$/)
  .exclude.add(/node_modules/)
  .end()
  .use('svg-icon')
  .loader('@svgr/webpack')
  .end()
  .use('svgo-loader')
  .loader('svgo-loader')
...
```

需要去掉`svg`文件的`fill`、`stroke`属性以达到自定义效果
`svgo.config.js`

```js
module.exports = {
  plugins: [
    {
      name: 'removeAttrs',
      params: {
        attrs: '(fill|stroke)',
      },
    },
  ],
}
```
