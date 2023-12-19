import express from 'express'
import { getFileFullPath, requireFile } from 'rzpack-utils'
import { catchError } from '../tools'

const router = express.Router()

// 系统信息
router.get(
  '/info',
  catchError((_, res) => {
    let title = process.env.APP_TITLE
    const yagt = process.env.YAGT_URL
    if (!title) {
      const pkgs = requireFile(getFileFullPath('./package.json'))
      title = pkgs?.name
    }
    res.json({
      data: {
        title,
        yagt: !!yagt,
      },
      msg: '操作成功',
      code: 0,
    })
  }),
)

export default router
