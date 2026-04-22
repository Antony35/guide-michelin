<script setup lang="ts">
import { ref, computed } from 'vue'

const emit = defineEmits(['close'])

const allBadges = ref([
  { id: 'paris', name: 'Paris', obtained: true },
  { id: 'lyon', name: 'Lyon', obtained: true },
  { id: 'marseille', name: 'Marseille', obtained: false },
  { id: 'bordeaux', name: 'Bordeaux', obtained: false },
  { id: 'lille', name: 'Lille', obtained: true },
  { id: 'strasbourg', name: 'Strasbourg', obtained: false },
  { id: 'nice', name: 'Nice', obtained: false },
  { id: 'toulouse', name: 'Toulouse', obtained: false },
  { id: 'nantes', name: 'Nantes', obtained: true },
  { id: 'limoges', name: 'Limoges', obtained: false },
  { id: 'reims', name: 'Reims', obtained: false },
  { id: 'dijon', name: 'Dijon', obtained: false },
])

type FilterOption = 'all' | 'obtained' | 'missing'
const activeFilter = ref<FilterOption>('all')

const filteredBadges = computed(() => {
  if (activeFilter.value === 'obtained') {
    return allBadges.value.filter(badge => badge.obtained)
  }
  if (activeFilter.value === 'missing') {
    return allBadges.value.filter(badge => !badge.obtained)
  }
  return allBadges.value
})
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content">
      <button class="close-button" @click="emit('close')">&times;</button>
      <h2>Tous les tampons</h2>

      <div class="filter-controls">
        <button :class="{ active: activeFilter === 'all' }" @click="activeFilter = 'all'">Tous</button>
        <button :class="{ active: activeFilter === 'obtained' }" @click="activeFilter = 'obtained'">Obtenus</button>
        <button :class="{ active: activeFilter === 'missing' }" @click="activeFilter = 'missing'">Manquants</button>
      </div>

      <div class="badge-grid">
        <div
          v-for="badge in filteredBadges"
          :key="badge.id"
          class="badge"
          :class="{ 'not-obtained': !badge.obtained }"
        >
          <span class="badge-text">{{ badge.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-content {
  position: relative;
  background-color: var(--color-cream);
  padding: 2rem;
  border-radius: 16px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: var(--color-black);
}

h2 {
  font-family: var(--font-serif), sans-serif;
  font-size: 2rem;
  font-weight: 400;
  text-align: center;
  margin-bottom: 2rem;
  color: #BA0B2F;
}

.filter-controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.filter-controls button {
  font-family: var(--font-sans), sans-serif;
  background: none;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-controls button.active {
  background-color: #BA0B2F;
  color: white;
  border-color: #BA0B2F;
}

.badge-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1.5rem;
  overflow-y: auto;
  padding: 0.5rem;
}

.badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border: 1px solid #BA0B2F;
  border-radius: 50%;
  background-color: #fff;
  font-weight: 600;
  color: #BA0B2F;
  text-align: center;
}

.badge.not-obtained {
  border-color: rgba(0, 0, 0, 0.2);
  background-color: transparent;
  color: rgba(0, 0, 0, 0.4);
  filter: grayscale(1);
}
</style>
