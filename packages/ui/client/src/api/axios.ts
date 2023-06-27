import type { Axios, AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios'

import axios from 'axios'
import NProgress from 'nprogress'

import { message } from '@/App'

import 'nprogress/nprogress.css'
NProgress.configure({ showSpinner: false })

const BASE_URL = '/__RZPACK_UI__/api'

const instance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
}) as AxiosInstance

instance.interceptors.request.use(
  config => {
    NProgress.start()
    return config
  },
  error => Promise.reject(error)
)

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    NProgress.done()
    if (response?.data?.code !== 0) {
      // 是否显示错误信息
      const showErrorMessage = response.config?.headers?._showErrorMessage ?? true

      if (showErrorMessage) {
        message.error(response.data.msg)
      }

      return Promise.reject(response.data.msg)
    }
    return response.data
  },
  async error => {
    NProgress.done()
    if (error.response) {
      if (error.response.status === 404) {
        message.error(`未找到接口：${error.response.config.url}`)
      }

      if (error.response.status === 500) {
        message.error(`接口：${error.response.config.url}在服务端发生未知错误`)
      }

      return Promise.reject(error.response.data)
    }
    return Promise.reject(error)
  }
)

export default instance

export interface AxiosInstance extends Axios {
  (config: AxiosRequestConfig): Response<any>
  (url: string, config?: AxiosRequestConfig): AxiosPromise
}
export type Response<T = unknown> = Promise<ResponseBody<T>>
export interface ResponseBody<T> extends AxiosResponse {
  code: number
  data: T
  msg: string
}
