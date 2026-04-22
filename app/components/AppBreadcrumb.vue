<script setup lang="ts">
import type { PropType } from 'vue'

interface BreadcrumbItem {
  label: string
  to?: string
}

defineProps({
  items: {
    type: Array as PropType<BreadcrumbItem[]>,
    required: true,
    default: () => []
  }
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
