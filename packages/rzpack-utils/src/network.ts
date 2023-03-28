import portfinder from 'portfinder'
import address from 'address'

/**
 * 获取ip，host地址及port
 * @param port 指定端口
 * @returns 返回当前主机的ip，host，如果指定port被占用，则自动+1
 */
export const getNetwork = async (port?: number) => {
  port = await portfinder.getPortPromise({ port })
  const local = address.ip('lo') ?? 'localhost'
  const network = address.ip()

  return { network, local, port }
}
