<script setup lang="ts">
import { useRoadtrip } from '~/composables/useRoadtrip'
import pin from '~/assets/pin.webp'
const { getAllRoadtrips } = useRoadtrip()

const roadtrips = getAllRoadtrips()
const activeTab = ref<'predefined' | 'custom'>('predefined')
</script>

<template>
  <div class="aventure-container">
    <div class="category-nav">
      <button
        @click="activeTab = 'predefined'"
        :class="['tab-button', { active: activeTab === 'predefined' }]"
      >
        <span class="tab-label">Voyages Prédéfinis</span>
      </button>
      <button
        @click="activeTab = 'custom'"
        :class="['tab-button', { active: activeTab === 'custom' }]"
      >
        <span class="tab-label">Créer Mon Voyage</span>
      </button>
    </div>
    <div v-if="activeTab === 'predefined'" class="content-section">
      <div class="section-header">
        <h2 class="section-title">Notre sélection d'itinéraires Culinaires</h2>
      </div>
      <div class="roadtrips-grid">
        <NuxtLink
          v-for="trip in roadtrips"
          :key="trip.id"
          :to="`/aventure/predefined/${trip.id}`"
          class="trip-card"
        >
          <div class="trip-card-header">
            <h3 class="trip-title">{{ trip.titre }}</h3>
            <span class="trip-duration">{{ trip.duree }}</span>
          </div>
          <p class="trip-description">{{ trip.description }}</p>
          <div class="trip-footer">
            <span class="trip-steps">{{ trip.etapes.length }} étapes</span>
            <span class="trip-cta">Découvrir →</span>
          </div>
        </NuxtLink>
      </div>
    </div>
    <div v-if="activeTab === 'custom'" class="content-section">
      <div class="section-header">
        <h2 class="section-title">Voyager au goût de vos envies</h2>
      </div>
      <div class="custom-journey-container">
        <div class="custom-card">
          <div class="custom-icon">
            <img width="40" height="40" :src="pin" alt="pin">
          </div>
          <h3 class="custom-title">Préparer votre voyage</h3>
          <p class="custom-desc">Choisissez les hôtels et restaurants en fonction de votre déstination</p>
          <NuxtLink to="/aventure/custom/select" class="custom-button">
            Commencer →
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.aventure-container {
  min-height: 100vh;
  --color-ink: #1a2224;
  --color-muted: #7a8a8c;
  --color-muted-soft: #9aabae;
  background-color: #eef2f3;
  color: var(--color-ink);
}

.category-nav {
  display: flex;
  gap: 1rem;
  justify-content: center;
  padding: 1.5rem 0;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.75rem;
  background-color: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(26, 34, 36, 0.12);
  color: var(--color-ink);
  font-family: var(--font-sans), sans-serif;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-button:hover {
  border-color: var(--color-red);
  color: var(--color-red);
}

.tab-button.active {
  background-color: transparent;
  border-color: var(--color-red);
  color: var(--color-red);
}

/* Content Section */
.content-section {
  max-width: 1200px;
  margin: 0 auto;
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-header {
  text-align: center;
}

.section-title {
  font-family: var(--font-serif);
  font-size: 2.25rem;
  font-weight: 300;
  margin-bottom: 1.5rem;
}

.section-desc {
  font-family: var(--font-sans);
  font-size: 1rem;
  color: var(--color-muted);
  margin: 0;
}

/* Road Trips Grid */
.roadtrips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.trip-card {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 8px;
  padding: 2rem;
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.trip-card:hover {
  border-color: var(--color-red);
  transform: translateY(-4px);
  box-shadow: 0 10px 40px rgba(200, 16, 46, 0.2);
}

.trip-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.trip-title {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  font-weight: 400;
  margin: 0;
  color: var(--color-ink);
  flex: 1;
}

.trip-duration {
  display: inline-block;
  background-color: rgba(200, 16, 46, 0.2);
  color: var(--color-red);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
}

.trip-description {
  font-family: var(--font-sans);
  font-size: 1rem;
  color: var(--color-muted);
  margin: 0;
  line-height: 1.6;
  flex: 1;
}

.trip-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(200, 16, 46, 0.2);
}

.trip-steps {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  color: var(--color-muted-soft);
}

.trip-cta {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  color: var(--color-red);
  font-weight: 600;
  transition: transform 0.3s ease;
}

.trip-card:hover .trip-cta {
  transform: translateX(4px);
}

.custom-journey-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.custom-card {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  padding: 1.5rem 1.5rem;
  margin: 0 1rem;
  text-align: center;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.custom-card:hover {
  border-color: var(--color-gold);
  transform: translateY(-4px);
  box-shadow: 0 10px 40px rgba(184, 151, 90, 0.2);
}

.custom-icon {
  font-size: 2.5rem;
  line-height: 1;
}

.custom-title {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  font-weight: 400;
  margin: 0;
  color: var(--color-ink);
}

.custom-desc {
  font-family: var(--font-sans);
  font-size: 0.95rem;
  color: var(--color-muted);
  margin: 0;
  line-height: 1.5;
}

.custom-button {
  display: inline-block;
  padding: 0.875rem 1.75rem;
  background-color: rgba(200, 16, 46, 0.2);
  color: var(--color-red);
  text-decoration: none;
  font-family: var(--font-sans);
  font-weight: 600;
  border: 2px solid rgba(200, 16, 46, 0.35);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  margin-top: 0.5rem;
}

.custom-button:hover:not(.disabled) {
  background-color: rgba(200, 16, 46, 0.28);
  border-color: var(--color-red);
  color: var(--color-red);
  transform: translateY(-2px);
}

.custom-button.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .tab-button {
    padding: 0.75rem 1.25rem;
    font-size: 0.9rem;
  }

  .section-title {
    font-size: 1.75rem;
  }

  .roadtrips-grid,
  .custom-journey-container {
    gap: 1.5rem;
  }
}
</style>

