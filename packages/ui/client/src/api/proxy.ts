import type { ProxyModel } from '@/models/proxy'

import axios, { type Response } from './axios'

/**
 * 接口代理列表
 */
export const fetchProxyList = (): Response<ProxyModel[]> => axios.get('/proxy/rules')

export interface AddProxyParams {
  description?: string
  id?: string
  path: string
  target: string
}
/**
 * 添加
 */
export const addProxy = (data: AddProxyParams): Response<{ id: string }> =>
  axios.post('/proxy/rule', data)
/**
 * 删除
 */
export const removeProxy = (id: string): Response<unknown> => axios.delete(`/proxy/rule/${id}`)
/**
 * 更新
 */
export const updateProxy = ({ id, ...data }: AddProxyParams): Response<unknown> =>
  axios.put(`/proxy/rule/${id}`, data)
/**
 * 启用/禁用
 */
export const updateProxyEnabled = (id: string, enabled: boolean): Response<unknown> =>
  axios.put(`/proxy/rule/enabled/${id}`, { enabled })
/**
 * 全部启用/禁用
 */
export const updateAllProxyEnabled = (enabled: boolean): Response<unknown> =>
  axios.put('/proxy/rule/all-enabled', { enabled })
/**
 * 移动
 */
export const moveProxy = (from: number, to: number): Response<unknown> =>
  axios.put('/proxy/rule/move', { from, to })
