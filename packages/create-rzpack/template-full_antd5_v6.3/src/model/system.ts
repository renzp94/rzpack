// 用户信息数据模型
export interface UserInfoModel {
  // 用户id
  userId: string
  // 用户名称
  username: string
  // 用户邮箱
  userEmail: string
  // 昵称
  nickname: string
  // 电话
  phone: string
  roleList: RoleModel[]
}
// 用户信息部门数据模型
export interface RoleModel {
  id: string
  // 角色描述
  roleDesc: string
  // 角色名
  roleName: string
}
