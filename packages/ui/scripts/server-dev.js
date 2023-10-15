const nodemon = require('nodemon')

nodemon({
  watch: './server',
  exec: `pnpm --filter=./server run build`,
  ext: 'js,ts',
})

nodemon.on('start', () => {
  console.log('server start...')
})
