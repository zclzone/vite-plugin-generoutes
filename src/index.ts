/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2025/03/13 16:42:47
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite'
import type { InternalRoute, RouteMeta } from './utils'
import path from 'node:path'
import { debounce, slash } from '@antfu/utils'
import { parse } from '@vue/compiler-sfc'
import chalk from 'chalk'
import fs from 'fs-extra'
import { globSync } from 'glob'
import prettier from 'prettier'
import { convertToTree, findDuplicateRoutes, toPascalCase } from './utils'

export type { InternalRoute, RouteMeta }

/**
 * Generated route record with proper typing for vue-router
 */
export interface GeneratedRoute {
  /** Route name */
  name: string
  /** Route path */
  path: string
  /** Redirect path */
  redirect?: string
  /** Route component */
  component?: () => Promise<any>
  /** Route meta information */
  meta: RouteMeta
  /** Parent route name (for nested routes) */
  parent?: string
  /** Child routes */
  children?: GeneratedRoute[]
}

export interface Options {
  /**
   * pages folder
   *
   * @default src/pages
   */
  pagesFolder: string
  /**
   * ignore folders, ignore these folders when generating routes
   *
   * @default ['components']
   */
  ignoreFolders: string[]
  /**
   * routes file path, It can also be a ts file，such as `src/router/routes.ts`
   * Auto-detected based on tsconfig.json presence if not specified
   *
   * @default src/router/routes.ts (if tsconfig.json exists) or src/router/routes.js
   */
  routesPath: string
  /**
   * nested routes
   *
   * @default false
   */
  nested: boolean
}

function VitePluginGeneroutes(options: Partial<Options> = {}) {
  if (options.routesPath && !(['.ts', '.js'].includes(path.extname(options.routesPath))))
    throw new Error('routesPath must be a js or ts file path, such as src/router/routes.js')

  let rootDir: string
  let routesPath: string
  let isTypeScript: boolean

  const pagesFolder = options.pagesFolder || 'src/pages'
  const ignoreFolders = options.ignoreFolders || ['components']
  const nested = options.nested || false

  const defineOptionsCache = new Map()

  /**
   * Detect if the project is a TypeScript project by checking for tsconfig.json
   */
  function detectTypeScriptProject(): boolean {
    const tsconfigPath = path.resolve(rootDir, 'tsconfig.json')
    return fs.existsSync(tsconfigPath)
  }

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
      const pathSegments = filePath.replace(`${pagesFolder}`, '').replace('.vue', '').replace('index', '').split('/').filter(item => !!item && !/^\(.*\)$/.test(item)) // 过滤掉带括号的路径

      const name = defineOptions.name || pathSegments.map(item => toPascalCase(item)).join('_') || 'Index'

      // component作个标记，方便转化成 () => import('${pagePath}')
      const component = `##/${filePath}@@${name}##`

      const routePath = `/${pathSegments.map(item => item.replace(/\[(.*?)\]/g, (_, p1) => p1 === '...all' ? ':pathMatch(.*)*' : p1.split(',').map((i: any) => `:${i}`).join('/'))).join('/')}`

      return {
        name,
        path: routePath,
        redirect: defineOptions.redirect,
        component: defineOptions.redirect ? undefined : component,
        meta,
        parent: defineOptions.parent,
      } as InternalRoute
    }).filter((route): route is InternalRoute => route !== null)

    const { duplicateNames, duplicatePaths } = findDuplicateRoutes(routes)
    if (duplicateNames.length)
      console.warn(`Warning: Duplicate names found in routes: ${duplicateNames.join(', ')}`)
    if (duplicatePaths.length)
      console.warn(`Warning: Duplicate paths found in routes: ${duplicatePaths.join(', ')}`)

    return {
      routes: nested ? convertToTree(routes) : routes,
    }
  }

  async function writerRoutesFile(isInit: boolean = false) {
    const { routes } = generateMenusAndRoutes()

    // Generate TypeScript type definitions
    const typeDefinitions = isTypeScript
      ? `
import type { RouteRecordRaw } from 'vue-router'

/**
 * Route meta information
 */
export interface RouteMeta {
  /** Page title */
  title?: string
  /** Page icon */
  icon?: string
  /** Page code */
  code?: string
  /** Page layout */
  layout?: string | boolean
  /** Whether authentication is required */
  requireAuth?: boolean
  /** Whether to keep alive */
  keepAlive?: boolean
  /** Whether it's the home page */
  isHome?: boolean
  /** Whether it's a login page */
  isLogin?: boolean
  /** Custom properties */
  [key: string]: unknown
}

/**
 * Generated route type with proper typing
 */
export type GeneratedRoute = RouteRecordRaw & {
  meta?: RouteMeta
  children?: GeneratedRoute[]
}
`
      : ''

    const routesType = isTypeScript ? ': GeneratedRoute[]' : ''

    let routesStr = `
    // Generated by vite-plugin-generoutes, don't modify it directly.
    ${typeDefinitions}
    export const routes${routesType} = ${JSON.stringify(routes, null, 2)}
    `

    // 转化component为 () => import('${pagePath}')
    routesStr = routesStr.replace(/"##(.*)##"/g, (_, p1) => `async () => ({...(await import('${p1.split('@@')[0]}')).default, name: '${p1.split('@@')[1]}'})`)

    // Use appropriate parser based on file type
    const parser = isTypeScript ? 'typescript' : 'babel'
    // 格式化
    routesStr = await prettier.format(routesStr, { parser, semi: false, singleQuote: true })

    const filePath = path.resolve(rootDir, routesPath)
    await fs.ensureDir(path.dirname(filePath))
    fs.writeFileSync(filePath, routesStr)
    // eslint-disable-next-line no-console
    console.log(`  ✅  ${isInit ? 'routes generated:' : 'routes updated:'} ${chalk.cyan(routesPath)}`)
  }

  const debounceWriter = debounce(500, writerRoutesFile)

  return {
    name: 'vite-plugin-generoutes',
    async configResolved(config: ResolvedConfig) {
      rootDir = config.root

      // Auto-detect TypeScript project and set routesPath accordingly
      const isTs = detectTypeScriptProject()
      routesPath = options.routesPath || (isTs ? 'src/router/routes.ts' : 'src/router/routes.js')
      isTypeScript = routesPath.endsWith('.ts')

      await writerRoutesFile(true)
    },
    configureServer(server: ViteDevServer) {
      const { watcher } = server

      watcher.on('all', async (event: string, filePath: string) => {
        filePath = slash(filePath)

        if (!filePath.endsWith('.vue') || ignoreFolders.some(folder => filePath.includes(`/${folder}/`)))
          return

        if (filePath.includes(pagesFolder)) {
          if (event === 'change') {
            // 处理文件内容变化事件，与原 handleHotUpdate 逻辑相同
            const relativePath = path.relative(rootDir, filePath)
            const slashedPath = slash(relativePath)
            const prevDefineOptions = defineOptionsCache.get(slashedPath)
            const content = await fs.readFile(filePath, 'utf-8')
            const defineOptions = JSON.stringify(parseDefineOptions(filePath, content))

            // 仅当 defineOptions 变化时更新路由
            if (prevDefineOptions !== defineOptions) {
              debounceWriter()
            }
          }
          else if (event === 'add' || event === 'unlink') {
            // 只处理文件的添加和删除事件
            debounceWriter()
          }
        }
      })
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
export { VitePluginGeneroutes }
