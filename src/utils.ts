/**
 * Route meta information
 */
export interface RouteMeta {
  /** Page layout */
  layout?: string | false
  /** Whether to keep alive */
  keepAlive?: boolean
  /** Whether the route is enabled */
  enabled?: boolean
  /** Custom properties */
  [key: string]: unknown
}

/**
 * Internal route representation used during generation
 */
export interface InternalRoute {
  /** Route name */
  name?: string
  /** Route path */
  path: string
  /** Redirect path */
  redirect?: string
  /** Route component placeholder */
  component?: string
  /** Route meta information */
  meta?: RouteMeta
  /** Child routes */
  children?: InternalRoute[]
}

export function toPascalCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/(?:^|-)([a-z])/g, (_, p1) => {
      return p1.toUpperCase()
    })
}

export function assertUniqueRoutes(routes: InternalRoute[]) {
  const names = new Map<string, InternalRoute>()
  const paths = new Map<string, InternalRoute>()

  function visit(route: InternalRoute, parentPath = '') {
    if (route.name) {
      const nameMatch = names.get(route.name)
      if (nameMatch)
        throw new Error(`Duplicate route name "${route.name}" for paths "${nameMatch.path}" and "${route.path}"`)
      names.set(route.name, route)
    }

    const basePath = parentPath === '/' ? '' : parentPath.replace(/\/$/, '')
    const fullPath = route.path.startsWith('/') ? route.path : `${basePath}/${route.path}`
    const normalizedPath = fullPath.length > 1 ? fullPath.replace(/\/$/, '') : fullPath
    const routePattern = normalizedPath.replace(/:[a-z_]\w*/gi, ':')
    const pathMatch = paths.get(routePattern)
    if (pathMatch)
      throw new Error(`Duplicate route path "${normalizedPath}" for routes "${pathMatch.name || '(unnamed)'}" and "${route.name || '(unnamed)'}"`)
    if (!pathMatch)
      paths.set(routePattern, route)

    route.children?.forEach(child => visit(child, normalizedPath))
  }

  routes.forEach(route => visit(route))
}
