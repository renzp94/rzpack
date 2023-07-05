import type { SystemInfoModel } from '@/models/system'

import axios, { type Response } from './axios'

/**
 * 获取项目信息
 */
export const fetchSystemInfo = (): Response<SystemInfoModel> => axios.get('/system/info')
