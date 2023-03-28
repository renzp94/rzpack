import type { RouteModel } from './tools'
const routes: RouteModel[] = [
  {
    title: '工作台',
    path: '/workbench',
    hidden: false,
    children: [
      {
        title: '首页',
        path: '/workbench/home',
        component: 'Home',
        icon: 'home',
        hidden: false,
      },
    ],
  },
  {
    title: '系统管理',
    path: '/system',
    hidden: false,
    children: [
      {
        title: '用户管理',
        path: '/system/user',
        component: 'System/User',
        icon: 'home',
        hidden: false,
        children: [
          {
            title: '用户详情',
            path: '/system/user/details',
            component: 'System/User/Details',
            hidden: true,
            meta: '{"activeMenuPath":"/system/user"}',
          },
        ],
      },
      {
        title: '安全管理',
        path: '/system/auth',
        icon: 'home',
        hidden: false,
        children: [
          {
            title: '账号安全设置',
            path: '/system/auth/account',
            component: 'System/Auth/Account',
            hidden: false,
          },
          {
            title: '密码安全设置',
            path: '/system/auth/password',
            component: 'System/Auth/Password',
            hidden: false,
          },
        ],
      },
    ],
  },
]

export default routes
