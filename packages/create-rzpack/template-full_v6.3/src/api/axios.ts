import type { Axios, AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'
import { message } from 'antd'
import storage, { TOKEN, USER_INFO } from '@/utils/storage'
import { isUndef, recordValueTrim } from '@/utils/tools'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
NProgress.configure({ showSpinner: false })

const instance: AxiosInstance = axios.create({
  baseURL: '/api/omc',
}) as AxiosInstance

const noAuth = () => {
  storage.remove(TOKEN)
  storage.remove(USER_INFO)
  window.location.hash = '#/login'
}

instance.interceptors.request.use(
  config => {
    NProgress.start()
    const token = storage.get(TOKEN)
    // 如果在请求配置中指定了token，则不再添加token
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!isUndef(token) && !config?.headers?.Authorization) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      config.headers.Authorization = token as string
    }

    // 处理get请求参数值字符串左右空格
    if (config.params) {
      config.params = recordValueTrim(config.params)
    }
    // 处理post请求参数值字符串左右空格
    if (config.data) {
      if (config.data.constructor === Object) {
        const data = recordValueTrim(config.data)
        config.data = data
      }
    }
    return config
  },
  error => Promise.reject(error)
)

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    NProgress.done()
    // 下载文件
    if (response.data instanceof Blob) {
      return response
    }

    if (response?.data?.code === 401) {
      noAuth()
      return Promise.reject(response.data)
    }

    if (response?.data?.code !== 0) {
      // 是否显示错误信息
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
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
    if (error?.response?.status === 401) {
      noAuth()
      return Promise.reject(error.data)
    }

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
export interface ResponseDataList<T> {
  totalRecord: number
  pageSize?: number
  pageNo?: number
  records: T[]
}
// 分页参数
export interface PaginationParams {
  pageNo?: number
  pageSize?: number
}
