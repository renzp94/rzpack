const nodemon = require('nodemon')

nodemon({
  watch: './client',
  exec: `pnpm --filter=./client run build`,
  ext: 'js,ts,tsx,jsx,less,css',
})

nodemon.on('start', () => {
  console.log('client start...')
})

nodemon.on('restart', () => {
  console.log('client restart...')
})
