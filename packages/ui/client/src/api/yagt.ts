import type {
  YagtInterfaceModel,
  YagtProjectInterfaceMenuModel,
  YagtProjectInterfaceModel,
  YagtProjectModel,
} from '@/models/yagt'

import axios, { PaginationParams, type Response, ResponseDataList } from './axios'

/**
 * 获取项目信息
 */
export const fetchYagtProjectInfo = (): Response<YagtProjectModel> => axios.get('/yagt/project')

export interface FetchYagtProjectInterfaceParams extends PaginationParams {
  cid?: number
}
/**
 * 获取项目接口列表
 */
export const fetchYagtProjectInterface = (
  params: FetchYagtProjectInterfaceParams
): Response<ResponseDataList<YagtProjectInterfaceModel>> =>
  axios.get('/yagt/project/interface', { params })
/**
 * 获取项目接口菜单列表
 */
export const fetchYagtProjectInterfaceMenus = (
  params: PaginationParams
): Response<YagtProjectInterfaceMenuModel[]> =>
  axios.get('/yagt/project/interface/menus', { params })

/**
 * 获取项目接口菜单列表
 */
export const fetchYagtInterfaceInfo = (id: number): Response<YagtInterfaceModel> =>
  axios.get('/yagt/interface/get', { params: { id } })
