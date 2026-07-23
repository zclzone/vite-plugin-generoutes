declare module 'virtual:vue-auto-pages' {
  type GeneratedRoute = import('vue-router').RouteRecordRaw & {
    meta?: import('vue-auto-pages').RouteMeta
    children?: GeneratedRoute[]
  }

  const routes: GeneratedRoute[]
  export default routes
}
