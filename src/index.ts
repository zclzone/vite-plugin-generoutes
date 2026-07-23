/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2025/03/13 16:42:47
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite'
import type { InternalRoute, RouteMeta } from './utils'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { debounce, slash } from '@antfu/utils'
import { parse as parseScript } from '@babel/parser'
import { parse as parseSfc } from '@vue/compiler-sfc'
import { glob } from 'glob'
import { assertUniqueRoutes, toPascalCase } from './utils'

export type { RouteMeta }

export const virtualModuleId = 'virtual:vue-auto-pages'
const resolvedVirtualModuleId = `\0${virtualModuleId}`

interface ParsedDefineOptions {
  name?: string
  redirect?: string
  meta?: RouteMeta
}

export interface Options {
  /**
   * pages folder
   *
   * @default src/pages
   */
  pagesFolder: string
  /**
   * layouts folder
   *
   * @default src/layouts
   */
  layoutsFolder: string
  /**
   * ignore folders, ignore these folders when generating routes
   *
   * @default ['components']
   */
  ignoreFolders: string[]
  /**
   * default layout for pages without meta.layout
   *
   * @default 'default'
   */
  defaultLayout: string | false
}

function segmentToRoutePath(segment: string) {
  const paramName = '[a-z_]\\w*'
  const catchAll = segment.match(new RegExp(`^\\[\\.\\.\\.(${paramName})\\]$`, 'i'))
  if (catchAll)
    return `:${catchAll[1] === 'all' ? 'pathMatch' : catchAll[1]}(.*)*`

  const optional = segment.match(new RegExp(`^\\[\\[(${paramName})\\]\\]$`, 'i'))
  if (optional)
    return `:${optional[1]}?`

  const dynamic = segment.match(/^\[([^\]]+)\]$/)
  if (dynamic) {
    const params = dynamic[1].split(',')
    if (params.every(param => new RegExp(`^${paramName}$`, 'i').test(param)))
      return params.map(param => `:${param}`).join('/')
  }

  if (segment.includes('[') || segment.includes(']'))
    throw new Error(`Invalid dynamic route segment "${segment}"`)
  return segment
}

function serializeComponent(component: string) {
  if (component.startsWith('##') && component.endsWith('##')) {
    const { path: importPath, name } = JSON.parse(decodeURIComponent(component.slice(2, -2)))
    return `async () => ({...(await import(${JSON.stringify(importPath)})).default, name: ${JSON.stringify(name)}})`
  }
  if (component.startsWith('@@layout@@') && component.endsWith('@@')) {
    const importPath = decodeURIComponent(component.slice('@@layout@@'.length, -2))
    return `() => import(${JSON.stringify(importPath)})`
  }
  return JSON.stringify(component)
}

function serializeRoute(route: InternalRoute, level = 0): string {
  const indent = '  '.repeat(level)
  const childIndent = '  '.repeat(level + 1)
  const properties = [`path: ${JSON.stringify(route.path)}`]
  if (route.name !== undefined)
    properties.unshift(`name: ${JSON.stringify(route.name)}`)
  if (route.redirect !== undefined)
    properties.push(`redirect: ${JSON.stringify(route.redirect)}`)
  if (route.component !== undefined)
    properties.push(`component: ${serializeComponent(route.component)}`)
  if (route.meta !== undefined)
    properties.push(`meta: ${JSON.stringify(route.meta)}`)
  if (route.children?.length) {
    properties.push(`children: [\n${route.children.map(child => serializeRoute(child, level + 2)).join(',\n')}\n${childIndent}]`)
  }
  return `${indent}{\n${properties.map(property => `${childIndent}${property}`).join(',\n')}\n${indent}}`
}

function isInsideDirectory(filePath: string, directory: string) {
  const relativePath = path.relative(directory, filePath)
  return relativePath !== '..'
    && !relativePath.startsWith(`..${path.sep}`)
    && !path.isAbsolute(relativePath)
}

function VueAutoPages(options: Partial<Options> = {}) {
  let rootDir: string
  let pagesRoot: string
  let layoutsRoot: string
  let generatedCode = ''
  let devServer: ViteDevServer | undefined
  const pageRouteCache = new Map<string, InternalRoute | null>()

  const pagesFolder = options.pagesFolder || 'src/pages'
  const layoutsFolder = options.layoutsFolder || 'src/layouts'
  const ignoreFolders = options.ignoreFolders || ['components']
  const defaultLayout = options.defaultLayout === undefined ? 'default' : options.defaultLayout
  const normalizedIgnoreFolders = ignoreFolders.map(folder => slash(folder).replace(/^\/+|\/+$/g, ''))

  function isIgnoredPage(relativePath: string) {
    return normalizedIgnoreFolders.some(folder =>
      relativePath.startsWith(`${folder}/`) || relativePath.includes(`/${folder}/`),
    )
  }

  function toViteImportPath(filePath: string) {
    const relativePath = slash(path.relative(rootDir, filePath))
    return relativePath.startsWith('.') ? relativePath : `/${relativePath}`
  }

  async function createPageRoute(filePath: string, content?: string): Promise<InternalRoute | null> {
    const source = content ?? await readFile(filePath, 'utf-8')
    const { descriptor, errors } = parseSfc(source, { filename: filePath })
    if (errors.length)
      throw new Error(`Failed to parse ${filePath}: ${errors[0] instanceof Error ? errors[0].message : String(errors[0])}`)

    const relativePath = slash(path.relative(pagesRoot, filePath))
    const defineOptions = parseDefineOptions(filePath, descriptor.scriptSetup?.content)
    const meta: RouteMeta = defineOptions.meta || {}
    const sourceSegments = relativePath
      .slice(0, -'.vue'.length)
      .split('/')
      .filter(Boolean)
    const routeSegments = sourceSegments.filter(segment => !/^\(.*\)$/.test(segment))
    const name = defineOptions.name || routeSegments.map(item => toPascalCase(item)).join('_') || 'Index'

    let routePath: string
    try {
      routePath = `/${routeSegments
        .map(segment => segment.toLowerCase() === 'index' ? '' : segmentToRoutePath(segment))
        .filter(Boolean)
        .join('/')}`
    }
    catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      throw new Error(`Invalid route path in ${filePath}: ${message}`, { cause: error })
    }

    if (meta.enabled === false)
      return null
    return {
      name,
      path: routePath,
      redirect: defineOptions.redirect,
      component: defineOptions.redirect === undefined
        ? `##${encodeURIComponent(JSON.stringify({ path: toViteImportPath(filePath), name }))}##`
        : undefined,
      meta,
    }
  }

  async function initializePageRoutes() {
    const pages = await glob('**/*.vue', {
      cwd: pagesRoot,
      ignore: normalizedIgnoreFolders.map(folder => `**/${folder}/**`),
    })
    pageRouteCache.clear()
    await Promise.all(pages.map(async (relativeFilePath) => {
      const filePath = slash(path.resolve(pagesRoot, relativeFilePath))
      pageRouteCache.set(filePath, await createPageRoute(filePath))
    }))
  }

  function generateRoutes(): InternalRoute[] {
    const rank = (routePath: string) => routePath.includes('(.*)*') ? 2 : routePath.includes(':') ? 1 : 0
    const routes = Array.from(pageRouteCache.values())
      .filter((route): route is InternalRoute => route !== null)
      .sort((a, b) => rank(a.path) - rank(b.path) || a.path.localeCompare(b.path))

    // 按 layout 分组路由
    const wrappedRoutes = wrapRoutesWithLayout(routes)
    assertUniqueRoutes(wrappedRoutes)
    return wrappedRoutes
  }

  /**
   * 将路由按 meta.layout 分组并包裹到布局路由中
   * meta.layout 为 false 的路由不使用布局
   * meta.layout 未设置时默认使用 'default'
   */
  function wrapRoutesWithLayout(routes: InternalRoute[]): InternalRoute[] {
    const layoutGroups = new Map<string, InternalRoute[]>()
    const noLayoutRoutes: InternalRoute[] = []

    for (const route of routes) {
      const layout = route.meta?.layout

      if (layout === false) {
        noLayoutRoutes.push(route)
      }
      else {
        const layoutName = layout === undefined ? defaultLayout : layout
        if (layoutName === false) {
          noLayoutRoutes.push(route)
          continue
        }
        if (typeof layoutName !== 'string')
          throw new TypeError(`Invalid meta.layout: expected a string or false`)
        const group = layoutGroups.get(layoutName)
        if (group) {
          group.push(route)
        }
        else {
          const layoutPath = path.resolve(layoutsRoot, `${layoutName}.vue`)
          const relativeLayoutPath = path.relative(layoutsRoot, layoutPath)
          if (relativeLayoutPath === '..' || relativeLayoutPath.startsWith(`..${path.sep}`) || path.isAbsolute(relativeLayoutPath))
            throw new Error(`Layout path must stay inside layoutsFolder: ${layoutName}`)
          if (!existsSync(layoutPath))
            throw new Error(`Layout file not found for layout "${layoutName}": ${layoutPath}`)
          layoutGroups.set(layoutName, [route])
        }
      }
    }

    // 为每个 layout 分组创建父级路由
    const layoutRoutes: InternalRoute[] = Array.from(layoutGroups, ([layoutName, children]) => ({
      name: `__LAYOUT_${layoutName.toUpperCase()}__`,
      path: `/__layout_${layoutName}__`,
      component: `@@layout@@${encodeURIComponent(toViteImportPath(path.resolve(layoutsRoot, `${layoutName}.vue`)))}@@`,
      children,
    }))

    return layoutRoutes.concat(noLayoutRoutes)
  }

  function generateRoutesModule() {
    const routes = generateRoutes()
    return `const routes = [\n${routes.map(route => serializeRoute(route, 1)).join(',\n')}\n]\n\nexport default routes\n`
  }

  async function refreshVirtualModule() {
    try {
      generatedCode = generateRoutesModule()
      if (devServer) {
        const module = devServer.moduleGraph.getModuleById(resolvedVirtualModuleId)
        if (module) {
          devServer.moduleGraph.invalidateModule(module)
          await devServer.reloadModule(module)
        }
      }
    }
    catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      console.error(`[vue-auto-pages] ${err.message}`)
      devServer?.ws.send({ type: 'error', err: { message: err.message, stack: err.stack || err.message } })
    }
  }

  const debouncedRefresh = debounce(100, refreshVirtualModule)

  return {
    name: 'vue-auto-pages',
    resolveId(id: string) {
      return id === virtualModuleId ? resolvedVirtualModuleId : undefined
    },
    load(id: string) {
      if (id === resolvedVirtualModuleId)
        return generatedCode || generateRoutesModule()
    },
    async configResolved(config: ResolvedConfig) {
      rootDir = config.root
      pagesRoot = path.resolve(rootDir, pagesFolder)
      layoutsRoot = path.resolve(rootDir, layoutsFolder)
      await initializePageRoutes()
      generatedCode = generateRoutesModule()
    },
    configureServer(server: ViteDevServer) {
      devServer = server
      const { watcher } = server

      watcher.on('all', async (event: string, filePath: string) => {
        try {
          filePath = slash(filePath)
          if (!filePath.endsWith('.vue'))
            return
          if (event === 'change')
            return

          const absoluteFilePath = slash(path.resolve(filePath))
          const relativePagePath = slash(path.relative(pagesRoot, absoluteFilePath))
          const isPageFile = isInsideDirectory(absoluteFilePath, pagesRoot)
          const ignored = isIgnoredPage(relativePagePath)
          const isLayoutFile = isInsideDirectory(absoluteFilePath, layoutsRoot)
          if ((!isPageFile || ignored) && !isLayoutFile)
            return

          if (isPageFile) {
            if (event === 'unlink') {
              pageRouteCache.delete(absoluteFilePath)
              debouncedRefresh()
            }
            else if (event === 'add' && existsSync(absoluteFilePath)) {
              const previousRoute = pageRouteCache.get(absoluteFilePath)
              const nextRoute = await createPageRoute(absoluteFilePath)
              pageRouteCache.set(absoluteFilePath, nextRoute)
              if (JSON.stringify(previousRoute) !== JSON.stringify(nextRoute))
                debouncedRefresh()
            }
          }
          else if (event === 'add' || event === 'unlink') {
            debouncedRefresh()
          }
        }
        catch (error) {
          const err = error instanceof Error ? error : new Error(String(error))
          console.error(`[vue-auto-pages] ${err.message}`)
          server.ws.send({ type: 'error', err: { message: err.message, stack: err.stack || err.message } })
        }
      })
    },
    async handleHotUpdate(context) {
      const absoluteFilePath = slash(path.resolve(context.file))
      if (!absoluteFilePath.endsWith('.vue') || !isInsideDirectory(absoluteFilePath, pagesRoot))
        return

      const relativePagePath = slash(path.relative(pagesRoot, absoluteFilePath))
      if (isIgnoredPage(relativePagePath))
        return

      const previousRoute = pageRouteCache.get(absoluteFilePath)
      const nextRoute = await createPageRoute(absoluteFilePath, await context.read())
      pageRouteCache.set(absoluteFilePath, nextRoute)
      if (JSON.stringify(previousRoute) !== JSON.stringify(nextRoute))
        await refreshVirtualModule()
    },
  } as Plugin
}

function unwrapExpression(node: any): any {
  if (['TSAsExpression', 'TSTypeAssertion', 'TSNonNullExpression', 'TSSatisfiesExpression', 'ParenthesizedExpression'].includes(node.type))
    return unwrapExpression(node.expression)
  return node
}

function staticPropertyKey(node: any) {
  node = unwrapExpression(node)
  if (node.type === 'Identifier' || node.type === 'StringLiteral' || node.type === 'NumericLiteral')
    return String(node.name ?? node.value)
  throw new Error(`Unsupported computed property key in defineOptions`)
}

function evaluateStatic(node: any): unknown {
  node = unwrapExpression(node)
  switch (node.type) {
    case 'StringLiteral':
    case 'NumericLiteral':
    case 'BooleanLiteral':
      return node.value
    case 'NullLiteral':
      return null
    case 'TemplateLiteral':
      if (node.expressions.length)
        throw new Error('Dynamic template expressions are not supported in defineOptions')
      return node.quasis.map((quasi: any) => quasi.value.cooked).join('')
    case 'ArrayExpression':
      return node.elements.map((element: any) => {
        if (!element)
          return null
        return evaluateStatic(element)
      })
    case 'ObjectExpression': {
      const value: Record<string, unknown> = {}
      for (const property of node.properties) {
        if (property.type === 'SpreadElement')
          throw new Error('Object spread is not supported in defineOptions')
        if (property.type !== 'ObjectProperty' || property.computed)
          throw new Error('Only static object properties are supported in defineOptions')
        value[staticPropertyKey(property.key)] = evaluateStatic(property.value)
      }
      return value
    }
    case 'UnaryExpression': {
      const argument = evaluateStatic(node.argument)
      if (node.operator === '!' && typeof argument === 'boolean')
        return !argument
      if ((node.operator === '+' || node.operator === '-') && typeof argument === 'number')
        return node.operator === '+' ? argument : -argument
      throw new Error(`Unsupported unary expression in defineOptions`)
    }
    default:
      throw new Error(`Only static values are supported in defineOptions, received ${node.type}`)
  }
}

function validateRouteMeta(filePath: string, meta: RouteMeta) {
  if (Object.prototype.hasOwnProperty.call(meta, 'layout') && meta.layout !== false && typeof meta.layout !== 'string')
    throw new TypeError(`Invalid meta.layout in ${filePath}: expected a string or false`)
  if (Object.prototype.hasOwnProperty.call(meta, 'enabled') && typeof meta.enabled !== 'boolean')
    throw new TypeError(`Invalid meta.enabled in ${filePath}: expected a boolean`)
  if (Object.prototype.hasOwnProperty.call(meta, 'keepAlive') && typeof meta.keepAlive !== 'boolean')
    throw new TypeError(`Invalid meta.keepAlive in ${filePath}: expected a boolean`)
}

/** Parse route fields from the Vue defineOptions macro without executing source code. */
function parseDefineOptions(filePath: string, content?: string): ParsedDefineOptions {
  if (!content)
    return {}

  let ast
  try {
    ast = parseScript(content, {
      sourceType: 'module',
      plugins: ['typescript'],
    })
  }
  catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Failed to parse script in ${filePath}: ${message}`, { cause: error })
  }
  const calls = ast.program.body
    .filter(statement => statement.type === 'ExpressionStatement')
    .map(statement => (statement as any).expression)
    .filter(expression => expression?.type === 'CallExpression' && expression.callee.type === 'Identifier' && expression.callee.name === 'defineOptions')

  if (!calls.length)
    return {}
  if (calls.length > 1)
    throw new Error(`Multiple defineOptions calls found in ${filePath}`)

  const argument = unwrapExpression(calls[0].arguments[0])
  if (!argument || argument.type !== 'ObjectExpression')
    throw new Error(`defineOptions in ${filePath} must receive a static object`)

  const result: ParsedDefineOptions = {}
  for (const property of argument.properties) {
    if (property.type === 'SpreadElement')
      throw new Error(`Object spread is not supported in defineOptions: ${filePath}`)
    if (property.type !== 'ObjectProperty')
      continue
    if (property.computed)
      throw new Error(`Computed properties are not supported in defineOptions: ${filePath}`)

    let key: string
    try {
      key = staticPropertyKey(property.key)
    }
    catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      throw new Error(`Invalid defineOptions property in ${filePath}: ${message}`, { cause: error })
    }
    if (!['name', 'redirect', 'meta'].includes(key))
      continue
    let value: unknown
    try {
      value = evaluateStatic(property.value)
    }
    catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      throw new Error(`Invalid ${key} in ${filePath}: ${message}`, { cause: error })
    }
    if (key === 'meta') {
      if (!value || typeof value !== 'object' || Array.isArray(value))
        throw new Error(`meta in ${filePath} must be a static object`)
    }
    else if (typeof value !== 'string') {
      throw new TypeError(`${key} in ${filePath} must be a static string`)
    }
    if (key === 'meta')
      result.meta = value as RouteMeta
    else if (key === 'name')
      result.name = value as string
    else
      result.redirect = value as string
  }

  if (result.meta)
    validateRouteMeta(filePath, result.meta)

  return result
}

export default VueAutoPages
export { VueAutoPages }
