import { fetchAuths } from '@/api/system'
import { getUserRoutes, RouteModel } from '@/router'
import { BUTTON_KEY } from '@/utils/constants'
import { cloneDeep } from 'lodash-es'
import { RouteObject, useLocation, useParams } from 'react-router-dom'
import create from 'zustand'
import { devtools } from 'zustand/middleware'

export interface RouterStore {
  loading: boolean
  userAuths: RouteModel[]
  userRoutes: RouteObject[]
  menus: RouteModel[]
  buttonKeys: string[]
  firstPath: string
  getUserAuths: () => void
  setLoading: (status: boolean) => void
  clear: () => void
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
  devtools((set) => ({
    loading: false,
    userAuths: [],
    userRoutes: [],
    firstPath: '',
    buttonKeys: [],
    menus: [],
    getUserAuths: async () => {
      try {
        set({ loading: true })
        const {
          data: { menuTree, buttonKeys },
        } = await fetchAuths()
        const [userRoutes, firstPath] = getUserRoutes(menuTree)
        const menus = cloneDeep(menuTree).filter(deepFilterHidden)
        set({ loading: false, userAuths: menuTree, userRoutes, firstPath, menus, buttonKeys })
      } catch {
        set({ loading: false })
      }
    },
    setLoading: (status: boolean) => set({ loading: status }),
    clear: () => {
      set({ userAuths: [], userRoutes: [], firstPath: '', menus: [] })
    },
  }))
)

/**
 * 获取当前页面按钮权限
 * @param path 当前路由地址，默认获取location.pathname，如果页面路径是/:xxx的需要自行处理传入
 * @returns 返回一个数组，数组第一个元素是判断是否有权限的函数，第二个元素是按钮权限数组
 */
export const useButtonAuth = (): [(key: BUTTON_KEY) => boolean, string[]] => {
  const location = useLocation()
  const buttonKeys = useRouterStore((state) => state.buttonKeys)
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
