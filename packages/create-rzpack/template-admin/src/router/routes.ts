import type { RouteModel } from './tools'

const routes: RouteModel[] = [
  {
    children: [
      {
        component: 'Home',
        hidden: false,
        path: '/workbench/home',
        title: '首页',
      },
    ],
    hidden: false,
    icon: 'home',
    path: '/workbench',
    title: '工作台',
  },
  {
    children: [
      {
        children: [
          {
            component: 'System/User/Details',
            hidden: true,
            meta: '{"activeMenuPath":"/system/user"}',
            path: '/system/user/details',
            title: '用户详情',
          },
        ],
        component: 'System/User',
        hidden: false,
        path: '/system/user',
        title: '用户管理',
      },
      {
        children: [
          {
            component: 'System/Auth/Account',
            hidden: false,
            path: '/system/auth/account',
            title: '账号安全设置',
          },
          {
            component: 'System/Auth/Password',
            hidden: false,
            path: '/system/auth/password',
            title: '密码安全设置',
          },
        ],
        hidden: false,
        path: '/system/auth',
        title: '安全管理',
      },
    ],
    hidden: false,
    icon: 'home',
    path: '/system',
    title: '系统管理',
  },
]

export default routes
