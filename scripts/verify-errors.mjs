import path from 'node:path'
// eslint-disable-next-line antfu/no-import-dist
import autoPages from '../dist/index.js'

const root = path.resolve('examples/demo')
const plugin = autoPages()

await plugin.configResolved({ root })

if (!plugin.resolveId('virtual:vue-auto-pages')?.toString().startsWith('\0virtual:vue-auto-pages'))
  throw new Error('virtual module resolution failed')

const generatedModule = plugin.load('\0virtual:vue-auto-pages')
if (typeof generatedModule !== 'string' || !generatedModule.includes('export default routes'))
  throw new Error('virtual module default export failed')
if (!generatedModule.includes('path: "/user/profile"'))
  throw new Error('directory page must generate a full route path')
if (generatedModule.includes('name: "UserLayout"'))
  throw new Error('directory pages must not generate nested parent routes')

console.log('vue-auto-pages verification passed')
