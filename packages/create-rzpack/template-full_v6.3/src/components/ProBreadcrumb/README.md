# ProBreadcrumb

基于`react-router`配置和当前页面地址自动生成面包屑


## 基本使用

```tsx
import type { ProBreadcrumbRoute } from '@/pro-components/ProBreadcrumb'
import React from 'react'
import ProBreadcrumb from '@/pro-components/ProBreadcrumb'

export default () => {
  const routes: AuthModel[] = [
    {
      title: '高级组件',
      key: 'pro-components',
      path: '/pro-components',
      hidden: false,
      children: [
        {
          title: 'ProBreadcrumb',
          key: 'pro-breadcrumb',
          path: '/pro-components/pro-breadcrumb',
          hidden: false,
        },
        {
          title: 'ProTable',
          key: 'pro-table',
          path: '/pro-components/pro-table',
          hidden: false,
        },
      ]
    }
  ]
  return <ProBreadcrumb routes={routes} />
}
```

## 带图标的

图标放在文字前面。

```tsx
import type { ProBreadcrumbRoute } from '@/pro-components/ProBreadcrumb'
import React from 'react'
import { HomeOutlined, UserOutlined } from '@ant-design/icons'
import ProBreadcrumb from '@/pro-components/ProBreadcrumb'

export default () => {
  const routes: AuthModel[] = [
    {
      title: '高级组件',
      key: 'pro-components',
      path: '/pro-components',
      hidden: false,
      icon: <HomeOutlined />,
      children: [
        {
          title: 'ProBreadcrumb',
          key: 'pro-breadcrumb',
          path: '/pro-components/pro-breadcrumb',
          hidden: false,
          icon: <UserOutlined />
        },
        {
          title: 'ProTable',
          key: 'pro-table',
          path: '/pro-components/pro-table',
          hidden: false,
        },
      ]
    }
  ]
  return <ProBreadcrumb routes={routes} />
}
```

## 分隔符

使用`separator=">"`可以自定义分隔符。

```tsx
import type { ProBreadcrumbRoute } from '@/pro-components/ProBreadcrumb'
import React from 'react'
import ProBreadcrumb from '@/pro-components/ProBreadcrumb'

export default () => {
  const routes: AuthModel[] = [
    {
      title: '高级组件',
      key: 'pro-components',
      path: '/pro-components',
      hidden: false,
      children: [
        {
          title: 'ProBreadcrumb',
          key: 'pro-breadcrumb',
          path: '/pro-components/pro-breadcrumb',
          hidden: false,
        },
        {
          title: 'ProTable',
          key: 'pro-table',
          path: '/pro-components/pro-table',
          hidden: false,
        },
      ]
    }
  ]
  return <ProBreadcrumb separator=">" routes={routes} />
}
```

## 带下拉菜单

```tsx
import type { ProBreadcrumbRoute } from '@/pro-components/ProBreadcrumb'
import React from 'react'
import ProBreadcrumb from '@/pro-components/ProBreadcrumb'

export default () => {
  const routes: AuthModel[] = [
    {
      title: '高级组件',
      key: 'pro-components',
      path: '/pro-components',
      hidden: false,
      children: [
        {
          title: 'ProBreadcrumb',
          key: 'pro-breadcrumb',
          path: '/pro-components/pro-breadcrumb',
          hidden: false,
          isChildOverlayMenu: true,
          children: [
            {
              title: '基本使用',
              key: 'pro-breadcrumb#基本使用',
              path: '/pro-components/pro-breadcrumb#基本使用',
              hidden: false,
              component: 'test'
            },
            {
              title: '带图标的',
              key: 'pro-breadcrumb#带图标的',
              path: '/pro-components/pro-breadcrumb#带图标的',
              hidden: false,
            },
            {
              title: '分隔符',
              key: 'pro-breadcrumb#分隔符',
              path: '/pro-components/pro-breadcrumb#分隔符',
              hidden: false,
            },
          ]
        },
        {
          title: 'ProTable',
          key: 'pro-table',
          path: '/pro-components/pro-table',
          hidden: false,
        },
      ]
    }
  ]

  return <ProBreadcrumb routes={routes} />
}
```

## 属性

| 属性   | 说明         | 类型                 | 默认 | 是否必填 |
| ------ | ------------ | -------------------- | ---- | -------- |
| routes | 路由配置信息 | ProBreadcrumbRoute[] | -    | 是       |

> 其他属性参考[Breadcrumb组件](https://ant-design.antgroup.com/components/breadcrumb-cn/#API)

```ts
export interface ProBreadcrumbRoute extends AuthModel {
  icon: string & React.ReactNode
  // children属性中的配置是否渲染成下拉菜单
  isChildOverlayMenu?: boolean
  children: ProBreadcrumbRoute[]
}
```
