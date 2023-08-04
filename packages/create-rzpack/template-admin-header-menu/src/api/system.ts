// import type { UserInfoModel } from '@/model/system'
// import type { RouteModel } from '@/router'
// import type { Response } from './axios'
// import axios from './axios'

// export interface LoginParams {
//   // 账号
//   username: string
//   // 密码
//   password: string
// }
// export interface LoginResult {
//   token: string
//   sysLoginUserDetail: UserInfoModel
// }
// /**
//  * 登录
//  * @param params LoginParams
//  * @returns 返回token和用户信息
//  */
// export const login = (params: LoginParams): Response<LoginResult> =>
//   axios.post('/v1/system/login', params)
// /**
//  * 获取当前登录用户权限
//  * @returns 返回菜单及按钮权限
//  */
// export const fetchAuths = (): Response<{ menuTree: RouteModel[]; buttonKeys: string[] }> =>
//   axios.post('/v1/system/listMenuButtonByUser')
// /**
//  * 退出登录
//  */
// export const logout = (): Response<unknown> => axios.post('/v1/system/logout')
// /**
//  * 获取当前登录用户信息
//  * @returns 返回用户信息
//  */
// export const fetchUserInfo = (): Response<UserInfoModel> => axios.post('/v1/system/userinfo')

// 实际开发时，打开上面的代码并改一下接口地址，并将下面mock数据的代码删除即可

import { routes } from '@/router'

export interface LoginParams {
  // 密码
  password: string
  // 账号
  username: string
}
/**
 * 登录
 * @param params LoginParams
 * @returns 返回token和用户信息
 */
export const login = (values: LoginParams): Promise<any> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 0,
        data: {
          token: 'ASKL_ASJKLASLASAKLASJKL',
          userInfo: {
            nickname: '测试001',
            username: values.username,
          },
        },
      })
    }, 1000)
  })
}
/**
 * 获取当前登录用户权限
 * @returns 返回菜单及按钮权限
 */
export const fetchAuths = (): Promise<any> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        data: {
          buttonKeys: {},
          menuTree: routes,
        },
      })
    }, 1000)
  })
}
/**
 * 退出登录
 */
export const logout = (): Promise<unknown> => {
  return new Promise(resolve => setTimeout(() => resolve(null), 1000))
}
/**
 * 获取当前登录用户信息
 * @returns 返回用户信息
 */
export const fetchUserInfo = (): Promise<any> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 0,
        data: {
          nickname: '测试001',
          username: 'test001',
        },
      })
    }, 1000)
  })
}
