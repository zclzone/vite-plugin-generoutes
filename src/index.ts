/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/04 22:48:11
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import path from 'node:path'
import fs from 'fs-extra'
import type { Plugin, ResolvedConfig } from 'vite'
import { globSync } from 'glob'
import { parse } from '@vue/compiler-sfc'
import { debounce, slash } from '@antfu/utils'
import chokidar from 'chokidar'
import prettier from 'prettier'

function toPascalCase(str: string) {
  return str
    .toLowerCase()
    .replace(/(?:^|-)([a-z])/g, (_, p1) => {
      return p1.toUpperCase()
    })
}

interface Options {
  routesFolder: string
  pagesFolder: string
}

const defaultOptions: Options = {
  routesFolder: 'src/router/generoutes/',
  pagesFolder: 'src/pages',
}

function VitePluginGeneroutes(options: Options = defaultOptions) {
  const defineOptionsCache = new Map()

  let rootDir: string
  let routesFolder = options.routesFolder

  async function writerRoutesFile() {
    const { routes } = generateMenusAndRoutes()

    let routesStr = `
    // ! 此文件由 vite-plugin-generoutes 自动生成，请勿修改，请勿修改，请勿修改!!!

    export const routes = ${JSON.stringify(routes, null, 2)}
    `

    // 转化component为 () => import('${pagePath}')
    routesStr = routesStr.replace(/"##(.*)##"/g, (_, p1) => `() => import('${p1}')`)
    // 格式化
    routesStr = await prettier.format(routesStr, { parser: 'babel', semi: false, singleQuote: true })

    fs.writeFileSync(`${routesFolder}/index.js`, routesStr)
  }

  const debounceWriter = debounce(500, writerRoutesFile)

  function generateMenusAndRoutes() {
    const pages = globSync(`${options.pagesFolder}/**/index.vue`).concat(globSync(`src/pages/**/\\[...all\\].vue`))
    const routes = pages.map((filePath) => {
      filePath = slash(filePath)
      const defineOptions = parseDefineOptions(filePath)
      defineOptionsCache.set(filePath, JSON.stringify(defineOptions))
      const meta = defineOptions?.meta || {}

      if (meta.enabled === false)
        return null

      // 格式化文件路径
      const fileName = path.basename(filePath)
      const pageName = path.parse(fileName).name

      // 处理文件路径，按文件路径结构进行拆分， 如：src/pages/foo/bar/index.vue =>  ['foo', 'bar']
      const pathSegments = filePath.replace(`${options.pagesFolder}/`, '')
        .replace(fileName, '')
        .split('/')
        .filter(item => !!item && !/^\(.*\)$/.test(item)) // 过滤掉带括号的路径

      let name = defineOptions?.name || pathSegments.map(item => toPascalCase(item)).join('_') || 'Index'

      // component作个标记，方便转化成 () => import('${pagePath}')
      const component = `##/${filePath}##`

      let routePath = `/${pathSegments.map(item => item.replace(/\[(.*?)\]/g, (_, p1) => p1.split(',').map((i: any) => `:${i}`).join('/'))).join('/')}`
      if (pageName === '[...all]') {
        name = `${name}_[...all]`
        routePath = routePath === '/' ? '/:pathMatch(.*)*' : (`${routePath}/:pathMatch(.*)*`)
      }

      if (!('title' in meta))
        meta.title = name
      if (!('show' in meta))
        meta.show = true
      // defineOptions 设置了 name 且 keepAlive 不为 false 时，则开启 keepAlive
      meta.keepAlive = !!defineOptions?.name && meta.keepAlive !== false

      return {
        name,
        path: routePath,
        component,
        meta,
      }
    }).filter(Boolean)

    return {
      routes,
    }
  }

  function createWatcher() {
    // 监听 index.vue 和 [...all].vue 文件变动
    const watcher = chokidar.watch(['src/pages/**/index.vue', `src/pages/**/[...all].vue`], { ignoreInitial: true })
    return watcher.on('all', async (event, path) => {
      if ((path.endsWith('index.vue') || path.endsWith('[...all].vue')) && (event === 'add' || event === 'unlink')) {
        debounceWriter()
        await watcher.close()
        createWatcher()
      }
    })
  }

  return {
    name: 'vite-plugin-generoutes',
    async configResolved(config: ResolvedConfig) {
      rootDir = config.root
      routesFolder = slash(path.resolve(rootDir, routesFolder))
      await fs.ensureDir(routesFolder)
      await writerRoutesFile()
      config.command !== 'build' && createWatcher()
    },
    async handleHotUpdate({ file, read }) {
      if (file.includes('src/pages') && (file.endsWith('index.vue') || file.endsWith('[...all].vue'))) {
        // 获取上一次文件的defineOptions内容
        const prevDefineOptions = defineOptionsCache.get(slash(path.relative(rootDir, file)))
        if (!prevDefineOptions) {
          debounceWriter()
        }
        else {
          const defineOptions = JSON.stringify(parseDefineOptions(file, await read()))
          if (prevDefineOptions !== defineOptions) {
            debounceWriter()
          }
        }
      }
    },
  } as Plugin
}

function parseDefineOptions(filePath: string, content?: string) {
  content = content ?? fs.readFileSync(filePath, 'utf-8')
  const { descriptor } = parse(content)

  // 从 setup script 中提取 defineOptions
  const setupScript = descriptor.scriptSetup?.content
  if (setupScript) {
    const defineOptionsMatch = setupScript.match(/defineOptions\(([^)]+)\)/)
    if (defineOptionsMatch) {
      try {
        return new Function(`return ${defineOptionsMatch[1]}`)()
      }
      catch (e) {
        console.error(`Failed to parse defineOptions in ${filePath}:`, e)
      }
    }
  }
  return null
}

export default VitePluginGeneroutes
