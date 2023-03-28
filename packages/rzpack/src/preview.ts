import sirv from 'sirv'
import polka from 'polka'
import compression from 'compression'
import { getNetwork } from 'rzpack-utils'
import { cyan } from 'rzpack-utils'

const runPreview = async (outDir: string) => {
  const assets = sirv(outDir, {
    gzip: true,
  })
  const { network, local, port } = await getNetwork(3000)

  polka()
    .use(compression(), assets)
    .listen(port, (err) => {
      if (err) throw err
      console.log(
        'App preview at: \n',
        `- Local:    ${cyan(`http://${local}:${port}`)}\n`,
        `- Network:  ${cyan(`http://${network}:${port}`)}\n\n`
      )
    })
}

export default runPreview
