/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2024/07/01 14:51:47
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import path from 'node:path'
import fs from 'fs-extra'
import type { Plugin, ResolvedConfig } from 'vite'
import type { FSWatcher } from 'chokidar'
import { globSync } from 'glob'
import { parse } from '@vue/compiler-sfc'
import { debounce, slash } from '@antfu/utils'
import chokidar from 'chokidar'
import prettier from 'prettier'
import { convertToTree, findDuplicateRoutes, toPascalCase } from './utils'

interface Options {
  /**
   * pages 文件夹
   *
   * default: `src/pages`
   */
  pagesFolder: string
  /**
   * 忽略文件夹
   *
   * default: `['components']`
   */
  ignoreFolders: string[]
  /**
   * 路由文件路径
   *
   * default: `${pagesFolder}/generoutes.js`
   */
  routesPath?: string
  /**
   * 是否嵌套
   *
   * default: false
   */
  nested: boolean
}

const defaultOptions: Options = {
  pagesFolder: 'src/pages',
  ignoreFolders: ['components'],
  nested: false,
}

function VitePluginGeneroutes(options: Partial<Options> = {}) {
  if (options.routesPath && !(['.ts', '.js'].includes(path.extname(options.routesPath))))
    throw new Error('routesPath must be a js or ts file path, such as src/router/generoutes.js')

  let rootDir: string
  const pagesFolder = options.pagesFolder || defaultOptions.pagesFolder
  const routesPath = options.routesPath || path.join(pagesFolder, 'generoutes.js')
  const nested = options.nested || defaultOptions.nested
  const ignoreFolders = options.ignoreFolders || defaultOptions.ignoreFolders

  const defineOptionsCache = new Map()

  function generateMenusAndRoutes() {
    const pages = globSync(`${pagesFolder}/**/*.vue`, { ignore: ignoreFolders.map(folder => `${pagesFolder}/**/${folder}/**`) })
    const routes = pages.map((filePath) => {
      filePath = slash(filePath)
      const defineOptions = parseDefineOptions(filePath) || {}
      defineOptionsCache.set(filePath, JSON.stringify(defineOptions))
      const meta = defineOptions.meta || {}

      if (meta.enabled === false)
        return null

      // 处理文件路径，按文件路径结构进行拆分， 如：src/pages/foo/bar/index.vue =>  ['foo', 'bar']
      const pathSegments = filePath.replace(`${pagesFolder}`, '').replace('.vue', '').replace('index', '')
        .split('/')
        .filter(item => !!item && !/^\(.*\)$/.test(item)) // 过滤掉带括号的路径

      const name = defineOptions.name || pathSegments.map(item => toPascalCase(item)).join('_') || 'Index'

      // component作个标记，方便转化成 () => import('${pagePath}')
      const component = `##/${filePath}@@${name}##`

      const routePath = `/${pathSegments.map(item => item.replace(/\[(.*?)\]/g, (_, p1) => p1 === '...all' ? ':pathMatch(.*)*' : p1.split(',').map((i: any) => `:${i}`).join('/'))).join('/')}`

      return {
        name,
        path: routePath,
        redirect: defineOptions.redirect,
        component,
        meta,
        parent: defineOptions.parent,
      }
    }).filter(Boolean)

    const { duplicateNames, duplicatePaths } = findDuplicateRoutes(routes)
    if (duplicateNames.length)
      console.warn(`Warning: Duplicate names found in routes: ${duplicateNames.join(', ')}`)
    if (duplicatePaths.length)
      console.warn(`Warning: Duplicate paths found in routes: ${duplicatePaths.join(', ')}`)

    return {
      routes: nested ? convertToTree(routes) : routes,
    }
  }

  async function writerRoutesFile() {
    const { routes } = generateMenusAndRoutes()

    let routesStr = `
    // ! 此文件由 vite-plugin-generoutes 自动生成，建议添加到 .gitignore，请勿直接在此文件修改!!!
    // ! This file is generated by vite-plugin-generoutes, it is recommended to add it to .gitignore, do not modify it directly in this file!!!

    export const routes = ${JSON.stringify(routes, null, 2)}
    `

    // 转化component为 () => import('${pagePath}')
    routesStr = routesStr.replace(/"##(.*)##"/g, (_, p1) => `async () => ({...(await import('${p1.split('@@')[0]}')).default, name: '${p1.split('@@')[1]}'})`)
    // 格式化
    routesStr = await prettier.format(routesStr, { parser: 'babel', semi: false, singleQuote: true })

    const filePath = path.resolve(rootDir, routesPath)
    await fs.ensureDir(path.dirname(filePath))
    fs.writeFileSync(filePath, routesStr)
  }

  const debounceWriter = debounce(500, writerRoutesFile)

  let watcher: FSWatcher
  function createWatcher() {
    watcher = chokidar.watch(`${pagesFolder}/**/*.vue`, { ignoreInitial: true })
    return watcher.on('all', async (event, path) => {
      if (ignoreFolders.some(folder => slash(path).includes(`/${folder}/`)))
        return
      if ((path.endsWith('.vue')) && (event === 'add' || event === 'unlink')) {
        debounceWriter()
        if (watcher) {
          await watcher.close()
          createWatcher()
        }
      }
    })
  }

  return {
    name: 'vite-plugin-generoutes',
    async configResolved(config: ResolvedConfig) {
      rootDir = config.root
      await writerRoutesFile()
      config.command !== 'build' && createWatcher()
    },
    async handleHotUpdate({ file, read }) {
      if (file.includes(pagesFolder) && !ignoreFolders.some(folder => file.includes(`/${folder}/`)) && (file.endsWith('.vue'))) {
        // 获取上一次文件的defineOptions内容
        const prevDefineOptions = defineOptionsCache.get(slash(path.relative(rootDir, file)))
        const defineOptions = JSON.stringify(parseDefineOptions(file, await read()))

        if (prevDefineOptions !== defineOptions) {
          debounceWriter()
        }
      }
    },
    closeBundle() {
      watcher && watcher.close()
    },
  } as Plugin
}

function parseDefineOptions(filePath: string, content?: string) {
  content = content ?? fs.readFileSync(filePath, 'utf-8')
  const { descriptor } = parse(content)

  // 从 setup script 中提取 defineOptions
  const setupScript = descriptor.scriptSetup?.content
  if (setupScript) {
    const defineOptionsMatch = setupScript.match(/defineOptions\s*\(\s*(\{[\s\S]*?\})\s*\)/)
    if (defineOptionsMatch) {
      try {
        return new Function(`return ${defineOptionsMatch[1]}`)()
      }
      catch (e) {
        throw new Error(`Failed to parse defineOptions in ${filePath}: ${e}`)
      }
    }
  }
  return {}
}

export default VitePluginGeneroutes
