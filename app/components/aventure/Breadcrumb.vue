<script setup lang="ts">
import { useRoadtrip } from '~/composables/useRoadtrip'

const route = useRoute()
const { getRoadtripById } = useRoadtrip()

interface BreadcrumbItem {
  label: string
  to?: string
}

const items = computed<BreadcrumbItem[]>(() => {
  const crumbs: BreadcrumbItem[] = [{ label: 'Votre voyage', to: '/aventure' }]
  const segments = route.path.replace(/^\/aventure\/?/, '').split('/').filter(Boolean)

  if (segments.length === 0) return []

  if (segments[0] === 'custom' && segments[1] === 'select') {
    crumbs.push({ label: 'Créer mon voyage' })
    return crumbs
  }

  if (segments[0] === 'custom' && segments[1] === 'carte') {
    crumbs.push({ label: 'Créer mon voyage', to: '/aventure/custom/select' })
    crumbs.push({ label: 'Carte' })
    return crumbs
  }

  if (segments[0] === 'predefined' && segments[1]) {
    const trip = getRoadtripById(segments[1])
    crumbs.push({ label: trip?.titre ?? segments[1] })
    return crumbs
  }

  if (segments[0] && segments[0] !== 'predefined' && segments[0] !== 'custom') {
    const trip = getRoadtripById(segments[0])
    crumbs.push({ label: trip?.titre ?? segments[0] })
    return crumbs
  }

  return crumbs
})
</script>

<template>
  <nav v-if="items.length > 0" class="breadcrumb" aria-label="Fil d'Ariane">
    <ol class="breadcrumb-list">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="breadcrumb-item"
      >
        <span v-if="index > 0" class="breadcrumb-sep" aria-hidden="true">›</span>
        <NuxtLink v-if="item.to && index < items.length - 1" :to="item.to" class="breadcrumb-link">
          {{ item.label }}
        </NuxtLink>
        <span v-else class="breadcrumb-current">{{ item.label }}</span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.breadcrumb {
  background: var(--color-cream);
  border-bottom: 1px solid rgba(26, 34, 36, 0.06);
  padding: 0.6rem 0;
}

.breadcrumb-list {
  max-width: 72rem;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  list-style: none;
  flex-wrap: wrap;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.breadcrumb-sep {
  color: rgba(26, 34, 36, 0.3);
  font-size: 0.8rem;
  line-height: 1;
}

.breadcrumb-link {
  font-family: var(--font-sans), sans-serif;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-muted, #7a8a8c);
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb-link:hover {
  color: var(--color-ink, #1a2224);
}

.breadcrumb-current {
  font-family: var(--font-sans), sans-serif;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-ink, #1a2224);
}

@media (max-width: 640px) {
  .breadcrumb-list {
    padding: 0 1.25rem;
  }
}
</style>
