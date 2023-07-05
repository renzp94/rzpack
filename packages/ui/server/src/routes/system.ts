import { getFileFullPath, requireFile } from 'rzpack-utils'
import express from 'express'

const router = express.Router()

// 系统信息
router.get('/info', (_, res) => {
  let title = process.env.APP_TITLE
  if (!title) {
    const pkgs = requireFile(getFileFullPath('./package.json'))
    title = pkgs?.name
  }
  res.json({
    data: {
      title,
    },
    msg: '操作成功',
    code: 0,
  })
})

export default router
