import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { fetchUserInfo } from '@/api/system'
import { UserInfoModel } from '@/model/system'
import storage from '@/utils/storage'
import { TOKEN, USER_INFO } from '@/utils/storage'

export interface UserInfoStore {
  clear: () => void
  refreshUserInfo: () => void
  setUserInfo: (token: string, data: UserInfoModel) => void
  token?: string
  userInfo?: UserInfoModel
}

const userInfoStore = create<UserInfoStore>()(
  devtools(set => ({
    clear: () => {
      storage.remove(USER_INFO)
      storage.remove(TOKEN)
      set({ token: undefined, userInfo: undefined })
    },
    refreshUserInfo: async () => {
      const { data } = await fetchUserInfo()
      storage.set(USER_INFO, data)
      set({ userInfo: data })
    },
    setUserInfo: (token: string, data: UserInfoModel) => {
      storage.set(TOKEN, token)
      storage.set(USER_INFO, data)
      set({ token, userInfo: data })
    },
    token: storage.get(TOKEN) as string,
    userInfo: undefined,
  }))
)

export default userInfoStore
