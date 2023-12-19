import axios from 'axios'
import express from 'express'
import { catchError } from '../tools'

const router = express.Router()

const validateError = (res, data) => {
  if (data?.data?.errcode !== 0) {
    const msg =
      data?.data?.errcode === 40011
        ? 'yagt配置的token或url错误'
        : data?.data?.errmsg
    res.json({
      code: data?.data?.errcode,
      msg,
      data: data?.data?.data,
    })
    return [true, null]
  }

  return [false, data]
}

// 项目信息
router.get(
  '/project',
  catchError(async (_, res) => {
    const [error, data] = validateError(
      res,
      await axios.get(`${process.env.YAGT_URL}/api/project/get`, {
        params: {
          token: process.env.YAGT_TOKEN,
        },
      }),
    )

    if (error) {
      return
    }

    const { name, _id, uid, group_id, add_time, up_time } =
      data?.data?.data ?? {}

    res.json({
      data: {
        name,
        id: _id,
        uid,
        group_id,
        add_time,
        up_time,
        yapiUrl: process.env.YAGT_URL,
        webUrl: `${process.env.YAGT_URL}/project/${_id}/interface/api`,
        token: process.env.YAGT_TOKEN,
      },
      msg: '操作成功',
      code: 0,
    })
  }),
)

let __interface_list = []

const getListMenus = async (res) => {
  const [error, data] = validateError(
    res,
    await axios.get(`${process.env.YAGT_URL}/api/interface/list_menu`, {
      params: {
        token: process.env.YAGT_TOKEN,
      },
    }),
  )

  return [
    error,
    data?.data?.data?.reduce(
      (prev, item) => [...prev, ...(item.list ?? [])],
      [],
    ),
  ]
}

const listFilter = (list: Array<any>, cid: number, pathOrName: string) => {
  return list
    .filter((item) => !cid || item.catid === Number(cid))
    .filter(
      (item) =>
        !pathOrName ||
        item.title.includes(pathOrName) ||
        item.path.includes(pathOrName) ||
        pathOrName.includes(item.path) ||
        pathOrName.includes(item.title),
    )
}
// 获取接口分页
router.get(
  '/project/interface',
  catchError(async (req, res) => {
    const { limit, page, cid, pathOrName } = req.query
    let isFetch = false
    // 如果缓存中没数据则重新获取数据
    if (__interface_list.length === 0) {
      const [error, list] = await getListMenus(res)
      if (error) {
        return
      }
      __interface_list = list
      isFetch = true
    }
    // 根据筛选条件过滤
    let allList = listFilter(__interface_list, cid, pathOrName)
    // 如果没有重新请求过数据且过滤后数据为空，则重新请求，重新过滤。确保缓冲使用最新的数据
    if (!isFetch && allList.length === 0) {
      const [error, list] = validateError(res, await getListMenus(res))
      if (error) {
        return
      }
      __interface_list = list
      allList = listFilter(__interface_list, cid, pathOrName)
      isFetch = true
    }
    // 分页处理
    const list = allList.splice((page - 1) * limit, limit)

    res.json({
      data: {
        list: list.map((item) => {
          const { _id, ...other } = item
          return { id: _id, ...other }
        }),
        total: allList.length,
      },
      msg: '操作成功',
      code: 0,
    })
  }),
)
// 获取接口菜单
router.get(
  '/project/interface/menus',
  catchError(async (_, res) => {
    const [error, data] = validateError(
      res,
      await axios.get(
        `${process.env.YAGT_URL}/api/interface/list_menu?token=${process.env.YAGT_TOKEN}`,
      ),
    )

    if (error) {
      return
    }

    res.json({
      data: data.data.data?.map((item) => ({ id: item._id, name: item.name })),
      msg: '操作成功',
      code: 0,
    })
  }),
)
// 接口详情
router.get(
  '/interface/get',
  catchError(async (req, res) => {
    const { id } = req.query
    const [error, data] = validateError(
      res,
      await axios.get(`${process.env.YAGT_URL}/api/interface/get`, {
        params: { token: process.env.YAGT_TOKEN, id },
      }),
    )

    if (error) {
      return
    }

    const { _id, res_body, req_body_other, req_query, ...otherData } =
      data.data.data ?? {}
    // 响应数据
    let resBody
    try {
      resBody = JSON.parse(res_body)
    } catch {
      resBody = res_body
    }
    // 请求body
    let reqBody
    try {
      reqBody = JSON.parse(req_body_other)
    } catch {
      reqBody = req_body_other
    }
    // 请求query
    let reqQuery
    try {
      reqQuery = JSON.parse(req_query)
    } catch {
      reqQuery = req_query
    }

    res.json({
      data: {
        id: _id,
        resBody,
        reqBody,
        reqQuery,
        ...otherData,
      },
      msg: '操作成功',
      code: 0,
    })
  }),
)

export default router
