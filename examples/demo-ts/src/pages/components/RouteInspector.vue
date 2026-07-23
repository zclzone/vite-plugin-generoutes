<script setup lang="ts">
import type { RouteMeta } from 'vue-auto-pages'
import routes from 'virtual:vue-auto-pages'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

interface FlatRoute {
  depth: number
  meta?: RouteMeta
  name?: string
  path: string
  redirect?: string
}

function flattenRoutes(records: typeof routes, depth = 0): FlatRoute[] {
  return records.flatMap(record => [
    {
      depth,
      meta: record.meta,
      name: record.name === undefined ? undefined : String(record.name),
      path: record.path,
      redirect: typeof record.redirect === 'string' ? record.redirect : undefined,
    },
    ...flattenRoutes(record.children || [], depth + 1),
  ])
}

function metaNotes(meta?: RouteMeta) {
  if (!meta)
    return []
  return Object.entries(meta).map(([key, value]) => `${key}: ${String(value)}`)
}

const currentRoute = useRoute()
const routeRecords = flattenRoutes(routes)
const matchedNames = computed(() => new Set(currentRoute.matched.map(record => String(record.name))))
const pageCount = routeRecords.filter(record => !record.name?.startsWith('__LAYOUT_')).length
</script>

<template>
  <aside class="route-inspector">
    <div class="inspector-heading">
      <div>
        <span>VIRTUAL MODULE</span>
        <strong>生成路由</strong>
      </div>
      <output>{{ pageCount }} pages</output>
    </div>
    <p class="ignore-note">
      本组件位于 <code>pages/components</code>，已被 ignoreFolders 排除。
    </p>
    <ol>
      <li
        v-for="record in routeRecords"
        :key="`${record.depth}:${record.path}:${record.name || 'directory'}`"
        :class="{ matched: record.name !== undefined && matchedNames.has(record.name) }"
        :style="{ '--depth': record.depth }"
      >
        <span class="route-line" />
        <div>
          <strong>{{ record.name || '(仅组织路径的目录)' }}</strong>
          <code>{{ record.path }}</code>
          <small v-if="record.redirect">redirect → {{ record.redirect }}</small>
          <small v-for="note in metaNotes(record.meta)" :key="note">{{ note }}</small>
        </div>
      </li>
    </ol>
  </aside>
</template>

<style scoped>
.route-inspector {
  max-height: calc(100vh - 210px);
  overflow: auto;
}

.inspector-heading {
  position: sticky;
  z-index: 1;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #9cafbd;
  background: #f8fbfc;
}

.inspector-heading div {
  display: grid;
  gap: 5px;
}

.inspector-heading span {
  color: #2d6cdf;
  font: 700 0.65rem/1 'Cascadia Code', Consolas, monospace;
  letter-spacing: 0.12em;
}

.inspector-heading strong {
  font-size: 0.88rem;
}

output {
  color: #157d79;
  font: 700 0.7rem/1 'Cascadia Code', Consolas, monospace;
}

.ignore-note {
  margin: 0;
  padding: 12px 16px;
  border-bottom: 1px solid #ccd6dd;
  color: #667889;
  font-size: 0.75rem;
  line-height: 1.5;
}

.ignore-note code {
  color: #2d6cdf;
  font-family: 'Cascadia Code', Consolas, monospace;
}

ol {
  margin: 0;
  padding: 10px 0;
  list-style: none;
}

li {
  --indent: calc(var(--depth) * 14px);
  position: relative;
  display: grid;
  grid-template-columns: 12px minmax(0, 1fr);
  gap: 8px;
  margin-left: var(--indent);
  padding: 8px 14px;
  color: #596d7f;
}

li.matched {
  background: #dfeaff;
  color: #13283f;
}

.route-line {
  width: 9px;
  height: 9px;
  margin-top: 3px;
  border: 2px solid #91a5b5;
  border-radius: 50%;
  background: #f8fbfc;
}

.matched .route-line {
  border-color: #2d6cdf;
  background: #2d6cdf;
}

li div {
  display: grid;
  min-width: 0;
  gap: 4px;
}

li strong,
li code,
li small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

li strong {
  font-size: 0.75rem;
}

li code,
li small {
  font: 0.66rem/1.3 'Cascadia Code', Consolas, monospace;
}

li code {
  color: #2d6cdf;
}

li small {
  color: #8393a0;
}

@media (max-width: 1180px) {
  .route-inspector {
    max-height: 480px;
  }
}
</style>
