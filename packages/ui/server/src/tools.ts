export const catchError = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next)
    } catch (error) {
      res.json({
        data: null,
        code: 500,
        msg: error.stack,
      })
    }
  }
}
