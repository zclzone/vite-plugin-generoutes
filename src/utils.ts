/**
 * Route meta information
 */
export interface RouteMeta {
  /** Route title */
  title?: string
  /** Route icon */
  icon?: string
  /** Whether authentication is required */
  requiresAuth?: boolean
  /** Whether the route is enabled */
  enabled?: boolean
  /** Layout component name, false to disable layout wrapping */
  layout?: string | false
  /** Custom properties */
  [key: string]: unknown
}

/**
 * Internal route representation used during generation
 */
export interface InternalRoute {
  /** Route name */
  name: string
  /** Route path */
  path: string
  /** Redirect path */
  redirect?: string
  /** Route component placeholder */
  component?: string
  /** Route meta information */
  meta: RouteMeta
  /** Parent route name (for nested routes) */
  parent?: string
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

export function convertToTree(routes: InternalRoute[]): InternalRoute[] {
  const nodeMap: Record<string, InternalRoute> = {}
  const result: InternalRoute[] = []

  routes.forEach((route) => {
    const { parent, ...node } = route
    nodeMap[node.name] = node as InternalRoute
  })

  routes.forEach((route) => {
    if (route.parent) {
      const parentNode = nodeMap[route.parent]
      if (parentNode) {
        if (!parentNode.children) {
          parentNode.children = []
        }
        parentNode.children.push(nodeMap[route.name])
      }
    }
    else {
      result.push(nodeMap[route.name])
    }
  })

  return result
}

export interface DuplicateRoutesResult {
  duplicateNames: string[]
  duplicatePaths: string[]
}

export function findDuplicateRoutes(routes: InternalRoute[]): DuplicateRoutesResult {
  const nameSet = new Set<string>()
  const pathSet = new Set<string>()
  const duplicateNames: string[] = []
  const duplicatePaths: string[] = []

  for (const route of routes) {
    if (nameSet.has(route.name)) {
      duplicateNames.push(route.name)
    }
    else {
      nameSet.add(route.name)
    }

    if (pathSet.has(route.path)) {
      duplicatePaths.push(route.path)
    }
    else {
      pathSet.add(route.path)
    }
  }

  return {
    duplicateNames,
    duplicatePaths,
  }
}
