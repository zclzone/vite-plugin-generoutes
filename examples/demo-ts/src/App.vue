<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import RouteInspector from './pages/components/RouteInspector.vue'

interface NavigationItem {
  behavior: string
  case?: string
  file: string
  generated: string
  label: string
  note: string
  routePath: string
  to: string
}

interface NavigationGroup {
  label: string
  items: NavigationItem[]
}

const route = useRoute()
const matchedNames = computed(() => route.matched.map(record => String(record.name)))
const leafRoutePath = computed(() => route.matched.at(-1)?.path || '')
const navigation: NavigationGroup[] = [
  {
    label: '基础与布局',
    items: [
      { behavior: 'defaultLayout: false，全局默认不包裹布局', file: 'pages/index.vue', generated: '/ · IndexPage', label: '根页面', note: '默认无布局', routePath: '/', to: '/' },
      { behavior: '页面主动加入 home.vue 布局分组', file: 'pages/home.vue', generated: '/home · HomePage', label: 'Home', note: 'home 布局', routePath: '/home', to: '/home' },
      { behavior: 'meta.layout: false，页面直接作为顶层路由', file: 'pages/about.vue', generated: '/about · AboutPage', label: '关于', note: 'layout: false', routePath: '/about', to: '/about' },
      { behavior: '(admin) 不进入 URL，页面使用 default.vue', file: 'pages/(admin)/dashboard.vue', generated: '/dashboard · AdminDashboard', label: '管理面板', note: '虚拟目录 + default 布局', routePath: '/dashboard', to: '/dashboard' },
      { behavior: '不加载页面组件，Vue Router 立即跳转到 /home', case: 'redirect', file: 'pages/redirect.vue', generated: '/redirect → /home', label: '重定向', note: 'redirect → /home', routePath: '/home', to: '/redirect' },
    ],
  },
  {
    label: '动态参数',
    items: [
      { behavior: 'id = 42；未写 defineOptions，名称自动生成', file: 'pages/product/[id].vue', generated: '/product/:id', label: '单参数', note: '/product/:id', routePath: '/product/:id', to: '/product/42' },
      { behavior: '依次得到 id = 7、name = ada', file: 'pages/user/[id,name].vue', generated: '/user/:id/:name', label: '多参数', note: '/user/:id/:name', routePath: '/user/:id/:name', to: '/user/7/ada' },
      { behavior: '不提供 id 也能匹配，组件中得到 undefined', case: 'optional-empty', file: 'pages/optional/[[id]].vue', generated: '/optional/:id?', label: '可选参数', note: '/optional/:id?', routePath: '/optional/:id?', to: '/optional?case=optional-empty' },
      { behavior: '提供 id = 88，同一个可选参数路由继续匹配', case: 'optional-value', file: 'pages/optional/[[id]].vue', generated: '/optional/:id?', label: '可选参数有值', note: 'id = 88', routePath: '/optional/:id?', to: '/optional/88?case=optional-value' },
      { behavior: 'docs/api 被收集到命名参数 segments', file: 'pages/files/[...segments].vue', generated: '/files/:segments(.*)*', label: '命名通配符', note: '/files/:segments(.*)*', routePath: '/files/:segments(.*)*', to: '/files/docs/api' },
    ],
  },
  {
    label: '目录路由',
    items: [
      { behavior: 'index.vue 不增加 URL 片段，直接生成完整路径 /user', file: 'pages/user/index.vue', generated: '/user · UserIndex', label: 'index 路由', note: '/user', routePath: '/user', to: '/user' },
      { behavior: '目录仅参与完整 URL，不会生成父子路由关系', file: 'pages/user/profile.vue', generated: '/user/profile · UserProfile', label: '目录页面', note: '扁平路由', routePath: '/user/profile', to: '/user/profile' },
      { behavior: '多层目录同样直接生成完整路径的页面路由', file: 'pages/user/team/members.vue', generated: '/user/team/members · User_Team_Members', label: '深层目录', note: '扁平路由', routePath: '/user/team/members', to: '/user/team/members' },
      { behavior: '仅兜底 /user 下未匹配的路径', file: 'pages/user/[...all].vue', generated: '/user/:pathMatch(.*)*', label: '用户级兜底', note: '目录通配符', routePath: '/user/:pathMatch(.*)*', to: '/user/missing/page' },
    ],
  },
  {
    label: '排除与兜底',
    items: [
      { behavior: 'enabled: false，路由树中不存在该页面，最终进入根级 404', case: 'disabled', file: 'pages/disabled.vue', generated: '不生成路由', label: '禁用页面', note: 'enabled: false → 404', routePath: '/:pathMatch(.*)*', to: '/disabled?case=disabled' },
      { behavior: 'components 命中 ignoreFolders，仅作为普通组件参与应用构建', case: 'ignored', file: 'pages/components/RouteInspector.vue', generated: '不生成路由', label: '忽略目录', note: 'ignoreFolders → 404', routePath: '/:pathMatch(.*)*', to: '/components/RouteInspector?case=ignored' },
      { behavior: '未命中其他页面后，由根级 catch-all 负责展示', case: 'not-found', file: 'pages/[...all].vue', generated: '/:pathMatch(.*)*', label: '全局兜底', note: '根级 [...all]', routePath: '/:pathMatch(.*)*', to: '/not-found?case=not-found' },
    ],
  },
]
const activeScenario = computed(() => {
  const currentCase = typeof route.query.case === 'string' ? route.query.case : undefined
  const items = navigation.flatMap(group => group.items)
  if (currentCase)
    return items.find(item => item.case === currentCase)
  return items.find(item => !item.case && item.routePath === leafRoutePath.value)
})
</script>

<template>
  <div class="app-shell">
    <header class="masthead">
      <div>
        <p class="overline">
          Vite plugin / TypeScript reference
        </p>
        <h1>Vue Auto Pages <span>route lab</span></h1>
        <p class="intro">
          点击一个文件场景，同时观察页面、匹配链和 virtual module 生成结果。
        </p>
      </div>
      <div class="capabilities" aria-label="演示能力">
        <span>virtual:vue-auto-pages</span>
        <span>strict TS</span>
        <span>HMR ready</span>
      </div>
    </header>

    <div class="lab-grid">
      <aside class="scenario-panel">
        <div class="panel-heading">
          <span>SCENARIOS</span>
          <strong>场景导航</strong>
        </div>
        <nav aria-label="插件功能场景">
          <section v-for="group in navigation" :key="group.label" class="nav-group">
            <h2>{{ group.label }}</h2>
            <RouterLink v-for="item in group.items" :key="item.to" :to="item.to">
              <span>{{ item.label }}</span>
              <small>{{ item.note }}</small>
            </RouterLink>
          </section>
        </nav>
      </aside>

      <main class="workspace">
        <div class="route-trace" aria-label="当前路由匹配链">
          <span class="trace-label">MATCHED</span>
          <div class="trace-nodes">
            <span v-for="name in matchedNames" :key="name">{{ name }}</span>
          </div>
          <code>{{ route.path }}</code>
        </div>
        <section v-if="activeScenario" class="scenario-proof" aria-label="当前场景生成过程">
          <div class="proof-title">
            <span>WHY IT MATCHED</span>
            <strong>{{ activeScenario.label }}</strong>
          </div>
          <div class="proof-flow">
            <div>
              <span>源文件</span>
              <code>{{ activeScenario.file }}</code>
            </div>
            <b aria-hidden="true">→</b>
            <div>
              <span>生成结果</span>
              <code>{{ activeScenario.generated }}</code>
            </div>
            <b aria-hidden="true">→</b>
            <div>
              <span>实际行为</span>
              <p>{{ activeScenario.behavior }}</p>
            </div>
          </div>
        </section>
        <div class="viewport">
          <RouterView />
        </div>
      </main>

      <RouteInspector />
    </div>

    <footer class="footer">
      <span>路由来自内存中的 virtual module，没有生成文件。</span>
      <span>编辑 defineOptions，或增删页面文件，可直接验证路由 HMR。</span>
    </footer>
  </div>
</template>

<style>
:root {
  color: #13283f;
  background: #eaf0f3;
  font-family: Aptos, 'Segoe UI', sans-serif;
  font-synthesis: none;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  background-color: #eaf0f3;
  background-image:
    linear-gradient(rgba(45, 108, 223, 0.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(45, 108, 223, 0.055) 1px, transparent 1px);
  background-size: 24px 24px;
}

.app-shell {
  width: min(1600px, 100%);
  margin: 0 auto;
  padding: 32px;
}

.masthead {
  display: flex;
  justify-content: space-between;
  gap: 32px;
  align-items: end;
  padding: 8px 4px 24px;
  border-bottom: 3px solid #13283f;
}

.overline,
.panel-heading span,
.trace-label {
  margin: 0 0 8px;
  color: #2d6cdf;
  font: 700 0.7rem/1.2 'Cascadia Code', Consolas, monospace;
  letter-spacing: 0.14em;
}

.masthead h1 {
  margin: 0;
  font-family: 'Arial Narrow', 'Bahnschrift SemiCondensed', sans-serif;
  font-size: clamp(2.8rem, 6vw, 5.8rem);
  font-stretch: condensed;
  line-height: 0.85;
  letter-spacing: -0.055em;
  text-transform: uppercase;
}

.masthead h1 span {
  color: #2d6cdf;
}

.intro {
  margin: 18px 0 0;
  max-width: 620px;
  color: #526579;
}

.capabilities {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
}

.capabilities span {
  padding: 8px 10px;
  border: 1px solid #91a5b5;
  background: rgba(248, 251, 252, 0.7);
  font: 600 0.72rem/1 'Cascadia Code', Consolas, monospace;
}

.lab-grid {
  display: grid;
  grid-template-columns: 250px minmax(420px, 1fr) 320px;
  align-items: start;
  gap: 18px;
  padding: 20px 0;
}

.scenario-panel,
.workspace,
.route-inspector {
  border: 1px solid #9cafbd;
  background: rgba(248, 251, 252, 0.94);
  box-shadow: 5px 5px 0 rgba(19, 40, 63, 0.08);
}

.panel-heading {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 16px;
  border-bottom: 1px solid #9cafbd;
}

.panel-heading span {
  margin: 0;
}

.panel-heading strong {
  font-size: 0.88rem;
}

.scenario-panel nav {
  max-height: calc(100vh - 210px);
  padding: 8px;
  overflow-y: auto;
}

.nav-group + .nav-group {
  margin-top: 14px;
}

.nav-group h2 {
  margin: 0 8px 5px;
  color: #667889;
  font-size: 0.72rem;
  font-weight: 700;
}

.nav-group a {
  display: grid;
  gap: 2px;
  padding: 9px 10px;
  border-left: 3px solid transparent;
  color: #13283f;
  text-decoration: none;
}

.nav-group a:hover {
  background: #edf4ff;
}

.nav-group a.router-link-exact-active {
  border-color: #2d6cdf;
  background: #dfeaff;
}

.nav-group small {
  color: #6d7f90;
  font: 0.68rem/1.35 'Cascadia Code', Consolas, monospace;
}

.route-trace {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px 12px;
  align-items: center;
  min-height: 76px;
  padding: 14px 18px;
  border-bottom: 1px solid #9cafbd;
  background: #13283f;
  color: white;
}

.trace-label {
  margin: 0;
  color: #72d8d2;
}

.trace-nodes {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.trace-nodes span {
  display: flex;
  align-items: center;
  gap: 6px;
  font: 0.75rem/1 'Cascadia Code', Consolas, monospace;
}

.trace-nodes span:not(:last-child)::after {
  color: #72d8d2;
  content: '→';
}

.route-trace code {
  grid-column: 2;
  color: #b9c8d6;
  font-size: 0.72rem;
}

.scenario-proof {
  padding: 16px 18px 18px;
  border-bottom: 1px solid #9cafbd;
  background: #f3f8ff;
}

.proof-title {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.proof-title span,
.proof-flow span {
  color: #2d6cdf;
  font: 700 0.65rem/1.2 'Cascadia Code', Consolas, monospace;
  letter-spacing: 0.1em;
}

.proof-title strong {
  font-size: 0.82rem;
}

.proof-flow {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1.35fr);
  gap: 10px;
  align-items: center;
}

.proof-flow > div {
  display: grid;
  align-content: center;
  min-height: 72px;
  padding: 10px 12px;
  border: 1px solid #b5c4cf;
  background: white;
}

.proof-flow b {
  color: #15938e;
  font-family: 'Cascadia Code', Consolas, monospace;
}

.proof-flow code,
.proof-flow p {
  margin: 7px 0 0;
  color: #314b63;
  font-size: 0.75rem;
  line-height: 1.45;
  overflow-wrap: anywhere;
}

.proof-flow code {
  font-family: 'Cascadia Code', Consolas, monospace;
}

.viewport {
  min-height: 560px;
  padding: clamp(18px, 4vw, 42px);
}

.demo-page h2 {
  margin: 6px 0 12px;
  font: 700 clamp(1.8rem, 4vw, 3.1rem)/1 'Arial Narrow', 'Bahnschrift SemiCondensed', sans-serif;
  letter-spacing: -0.025em;
}

.demo-page > p {
  max-width: 65ch;
  color: #526579;
  line-height: 1.7;
}

.page-kicker {
  margin: 0;
  color: #15938e;
  font: 700 0.72rem/1.3 'Cascadia Code', Consolas, monospace;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.fact-grid,
.param-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
  margin-top: 24px;
}

.fact,
.param {
  min-width: 0;
  padding: 13px;
  border: 1px solid #b5c4cf;
  background: white;
}

.fact span,
.param span {
  display: block;
  margin-bottom: 6px;
  color: #738493;
  font-size: 0.72rem;
}

.fact code,
.param strong,
.demo-page code {
  color: #2d6cdf;
  font-family: 'Cascadia Code', Consolas, monospace;
  overflow-wrap: anywhere;
}

.callout {
  margin-top: 24px;
  padding: 14px 16px;
  border-left: 4px solid #ff8a4c;
  background: #fff4ed;
  color: #4d5e6e;
  line-height: 1.6;
}

.outlet {
  margin-top: 26px;
  padding-top: 22px;
  border-top: 1px dashed #91a5b5;
}

.footer {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 4px;
  border-top: 1px solid #91a5b5;
  color: #667889;
  font-size: 0.78rem;
}

a:focus-visible {
  outline: 3px solid #ff8a4c;
  outline-offset: 2px;
}

@media (max-width: 1180px) {
  .lab-grid {
    grid-template-columns: 230px minmax(0, 1fr);
  }

  .route-inspector {
    grid-column: 1 / -1;
  }

  .scenario-panel nav {
    max-height: none;
  }
}

@media (max-width: 760px) {
  .app-shell {
    padding: 18px;
  }

  .masthead,
  .footer {
    align-items: start;
    flex-direction: column;
  }

  .capabilities {
    justify-content: flex-start;
  }

  .lab-grid {
    grid-template-columns: 1fr;
  }

  .route-inspector {
    grid-column: auto;
  }

  .viewport {
    min-height: 420px;
  }

  .proof-flow {
    grid-template-columns: 1fr;
  }

  .proof-flow b {
    justify-self: center;
    transform: rotate(90deg);
  }
}

@media (prefers-reduced-motion: no-preference) {
  .viewport > * {
    animation: enter 180ms ease-out;
  }
}

@keyframes enter {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
}
</style>
