import type { Method } from 'axios'

export interface YagtProjectModel {
  add_time: number
  group_id: number
  id: number
  name: string
  token: string
  uid: number
  up_time: number
  webUrl: string
  yapiUrl: string
}

export type YagtProjectInterfaceStatus = 'done' | 'undone'

export interface YagtProjectInterfaceModel {
  id: number
  method: Method
  path: string
  status: YagtProjectInterfaceStatus
  title: string
}
export interface YagtProjectInterfaceMenuModel {
  id: number
  name: string
}

export interface YagtInterfaceReqQueryModel {
  _id: string
  // 字段描述
  desc: string
  // 事例
  example: string
  // 字段名称
  name: string
  // 是否必填，1:必填 0:非必填
  required: '0' | '1'
}

export interface YagtInterfaceBodyModel {
  // 字段描述
  description: string
  items?: YagtInterfaceBodyModel
  properties?: YagtInterfaceBodyModel
  // 必填字段
  required?: string[]
  type: string
}

export interface YagtInterfaceModel extends YagtProjectInterfaceModel {
  method: Method
  // 接口地址
  path: string
  reqBody: YagtInterfaceBodyModel
  reqQuery: YagtInterfaceReqQueryModel[]
  resBody: YagtInterfaceBodyModel
  // 状态
  status: YagtProjectInterfaceStatus
  // 接口名称
  title: string
  // 更新时间
  up_time: number
  // 创建人
  username: string
}
