# 命令行界面

## 开发服务器

### rzpack

在当前目录下启动`rzpack`开发服务器。`rzpack dev`和`rzpack start`是 `rzpack`的别名。

#### 使用

```sh
rzpack [root]
```

#### 选项

| 属性           | 说明                | 类型                | 默认                 |
| -------------- | ------------------- | ------------------- | -------------------- |
| --c            | 指定配置文件        | `string`            | `./vigour.config.ts` |
| --config       | 指定配置文件        | `string`            | `./vigour.config.ts` |
| --m            | 指定webpack启动模式 | `string`            | `development`        |
| --mode         | 指定webpack启动模式 | `string`            | `development`        |
| --host [host]  | 指定主机名称        | `string`            | -                    |
| --host [host]  | 指定主机名称        | `string`            | -                    |
| --port [port]  | 指定端口            | `string`            | -                    |
| --open [path]  | 启动时打开浏览器    | `boolean \| string` | -                    |
| --ui [boolean] | 是否启动可视化配置  | `boolean`           | `true`               |

## 构建

### rzpack build

构建生产版本。

#### 使用

```sh
rzpack build [root]
```

#### 选项

| 属性                    | 说明                | 类型      | 默认                 |
| ----------------------- | ------------------- | --------- | -------------------- |
| --c                     | 指定配置文件        | `string`  | `./vigour.config.ts` |
| --config                | 指定配置文件        | `string`  | `./vigour.config.ts` |
| --m                     | 指定webpack启动模式 | `string`  | `development`        |
| --mode                  | 指定webpack启动模式 | `string`  | `development`        |
| --outDir [dir]          | 输出目录            | `string`  | `dist`               |
| --bundle-size [boolean] | 分析打包资源大小    | `boolean` | -                    |
| --bundle-time [boolean] | 分析打包时长        | `boolean` | -                    |

## 预览

### rzpack preview

本地预览构建产物。不要将其用作生产服务器，因为它不是为此而设计的。

```sh
rzpack preview
```

#### 选项

| 属性           | 说明                | 类型     | 默认                 |
| -------------- | ------------------- | -------- | -------------------- |
| --c            | 指定配置文件        | `string` | `./vigour.config.ts` |
| --config       | 指定配置文件        | `string` | `./vigour.config.ts` |
| --m            | 指定webpack启动模式 | `string` | `development`        |
| --mode         | 指定webpack启动模式 | `string` | `development`        |
| --outDir [dir] | 输出目录            | `string` | `dist`               |
