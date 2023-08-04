import { cloneDeep } from 'lodash-es'
import { type RouteObject, useLocation, useParams } from 'react-router-dom'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { fetchAuths } from '@/api/system'
import { getUserRoutes, RouteModel } from '@/router'
import { BUTTON_KEY } from '@/utils/constants'

export interface RouterStore {
  buttonKeys: Record<string, string[]>
  clear: () => void
  firstPath: string
  getUserAuths: () => void
  loading: boolean
  menus: RouteModel[]
  setLoading: (status: boolean) => void
  userAuths: RouteModel[]
  userRoutes: RouteObject[]
}

/**
 * 递归过滤掉除路由之外的数据
 * Tips: 此操作会改变数据源的children
 * @param item 权限数据
 * @returns true/false
 */
export const deepFilterHidden = (item: RouteModel) => {
  if (item?.children?.length) {
    item.children = item.children.filter(deepFilterHidden)
  }

  return !item.hidden
}

const useRouterStore = create<RouterStore>()(
  devtools(set => ({
    buttonKeys: {},
    clear: () => {
      set({ firstPath: '', menus: [], userAuths: [], userRoutes: [] })
    },
    firstPath: '',
    getUserAuths: async () => {
      try {
        set({ loading: true })
        const {
          data: { buttonKeys, menuTree },
        } = await fetchAuths()
        const [userRoutes, firstPath] = getUserRoutes(menuTree)
        const menus = cloneDeep(menuTree).filter(deepFilterHidden)
        set({ buttonKeys, firstPath, loading: false, menus, userAuths: menuTree, userRoutes })
      } catch {
        set({ loading: false })
      }
    },
    loading: false,
    menus: [],
    setLoading: (status: boolean) => set({ loading: status }),
    userAuths: [],
    userRoutes: [],
  }))
)

/**
 * 获取当前页面按钮权限
 * @param path 当前路由地址，默认获取location.pathname，如果页面路径是/:xxx的需要自行处理传入
 * @returns 返回一个数组，数组第一个元素是判断是否有权限的函数，第二个元素是按钮权限数组
 */
export const useButtonAuth = (): [(key: BUTTON_KEY) => boolean, string[]] => {
  const location = useLocation()
  const buttonKeys = useRouterStore(state => state.buttonKeys)
  // 处理params
  const params = useParams()
  const paramKeys = Object.keys(params)
  let paramsRep = paramKeys.join('/:')
  paramsRep = paramsRep ? `/:${paramsRep}` : ''
  const paramsPath = paramKeys.reduce((prev, curr) => `${prev}/${params[curr]}`, '')
  const key = location.pathname.replace(paramsPath, paramsRep)

  const auths = buttonKeys?.[key] ?? []
  const hasAuth = (key: BUTTON_KEY) => auths.includes(key)

  return [hasAuth, auths]
}

export default useRouterStore
