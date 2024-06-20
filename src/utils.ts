export function toPascalCase(str: string) {
  return str
    .toLowerCase()
    .replace(/(?:^|-)([a-z])/g, (_, p1) => {
      return p1.toUpperCase()
    })
}

export function convertToTree(routes: any[]): any[] {
  const nodeMap: Record<string, any> = {}
  const result: any[] = []

  routes.forEach((route) => {
    const { parent, ...node } = route
    nodeMap[node.name] = node
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

export function findDuplicateRoutes(routes: any[]) {
  const nameSet = new Set()
  const pathSet = new Set()
  const duplicateNames = []
  const duplicatePaths = []

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
