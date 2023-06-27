import { TOKEN, USER_INFO } from '@/utils/storage'
import { UserInfoModel } from '@/model/system'
import create from 'zustand'
import { devtools } from 'zustand/middleware'
import { fetchUserInfo } from '@/api/system'
import storage from '@/utils/storage'

export interface UserInfoStore {
  token?: string
  userInfo?: UserInfoModel
  refreshUserInfo: () => void
  setUserInfo: (token: string, data: UserInfoModel) => void
  clear: () => void
}

const userInfoStore = create<UserInfoStore>()(
  devtools((set) => ({
    token: storage.get(TOKEN) as string,
    userInfo: undefined,
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
    clear: () => {
      storage.remove(USER_INFO)
      storage.remove(TOKEN)
      set({ token: undefined, userInfo: undefined })
    },
  }))
)

export default userInfoStore
