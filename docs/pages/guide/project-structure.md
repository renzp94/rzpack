# 项目结构


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