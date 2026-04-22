<script setup lang="ts">
import { useRoadtrip } from '~/composables/useRoadtrip'
import pin from '~/assets/pin.webp'
import food from '~/assets/food.webp'
import travel from '~/assets/travel.webp'

const { getAllRoadtrips } = useRoadtrip()

const roadtrips = getAllRoadtrips()
const activeTab = ref<'predefined' | 'custom'>('predefined')

const myTrips = ref([
  {
    id: 'my-1',
    name: 'Week-end en Bourgogne',
    date: 'Mars 2025',
    steps: 4,
    status: 'Terminé',
    cover: food,
  },
  {
    id: 'my-2',
    name: 'Route des Vins d\'Alsace',
    date: 'Janvier 2025',
    steps: 6,
    status: 'Terminé',
    cover: travel,
  },
])
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
        <span class="tab-label">Mes voyages</span>
      </button>
    </div>

    <!-- PREDEFINED -->
    <div v-if="activeTab === 'predefined'" class="content-section">
      <div class="section-header">
        <h2 class="section-title">Notre sélection d'itinéraires Culinaires</h2>
        <p class="section-desc">Des parcours pensés par nos équipes pour vivre la gastronomie française au rythme de la route.</p>
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

    <!-- MY TRIPS -->
    <div v-if="activeTab === 'custom'" class="content-section">
      <div class="section-header">
        <h2 class="section-title">Voyager au goût de vos envies</h2>
        <p class="section-desc">Créez, personnalisez et retrouvez ici tous vos voyages culinaires.</p>
      </div>

      <div class="my-trips-layout">
        <!-- New trip CTA -->
        <NuxtLink to="/aventure/custom/select" class="new-trip-card">
          <div class="new-trip-icon">
            <img width="44" height="44" :src="pin" alt="pin">
          </div>
          <div class="new-trip-body">
            <h3 class="new-trip-title">Préparer un nouveau voyage</h3>
            <p class="new-trip-desc">Choisissez vos hôtels et restaurants selon votre destination et vos envies.</p>
          </div>
          <span class="new-trip-arrow">→</span>
        </NuxtLink>

        <!-- Past trips list -->
        <div class="past-trips-section">
          <h4 class="past-trips-heading">Mes voyages passés</h4>
          <div class="past-trips-list">
            <div v-for="trip in myTrips" :key="trip.id" class="past-trip-card">
              <div class="past-trip-cover">
                <img :src="trip.cover" :alt="trip.name">
                <span class="past-trip-status">{{ trip.status }}</span>
              </div>
              <div class="past-trip-info">
                <h4 class="past-trip-name">{{ trip.name }}</h4>
                <div class="past-trip-meta">
                  <span class="past-trip-date">{{ trip.date }}</span>
                  <span class="past-trip-dot">·</span>
                  <span class="past-trip-steps">{{ trip.steps }} étapes</span>
                </div>
              </div>
              <button class="past-trip-edit">Modifier</button>
            </div>
          </div>
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

/* ---- NAV ---- */
.category-nav {
  display: flex;
  gap: 2rem;
  justify-content: center;
  padding: 3rem 0;
}

.tab-button {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 220px;
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

/* ---- CONTENT ---- */
.content-section {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 2rem 4rem;
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-family: var(--font-serif);
  font-size: 2.25rem;
  font-weight: 300;
  margin-bottom: 0.75rem;
}

.section-desc {
  font-family: var(--font-sans);
  font-size: 1rem;
  color: var(--color-muted);
  margin: 0;
}

/* ---- PREDEFINED GRID ---- */
.roadtrips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
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
  background-color: rgba(200, 16, 46, 0.12);
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
  border-top: 1px solid rgba(200, 16, 46, 0.15);
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

/* ---- MY TRIPS LAYOUT ---- */
.my-trips-layout {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

/* New trip CTA */
.new-trip-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: rgba(200, 16, 46, 0.06);
  border: 1.5px dashed rgba(200, 16, 46, 0.35);
  border-radius: 12px;
  padding: 1.75rem 2rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

.new-trip-card:hover {
  background: rgba(200, 16, 46, 0.1);
  border-color: var(--color-red);
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(200, 16, 46, 0.12);
}

.new-trip-icon {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.new-trip-body {
  flex: 1;
}

.new-trip-title {
  font-family: var(--font-serif);
  font-size: 1.4rem;
  font-weight: 400;
  margin: 0 0 0.35rem;
  color: var(--color-red);
}

.new-trip-desc {
  font-family: var(--font-sans);
  font-size: 0.95rem;
  color: var(--color-muted);
  margin: 0;
}

.new-trip-arrow {
  font-size: 1.5rem;
  color: var(--color-red);
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.new-trip-card:hover .new-trip-arrow {
  transform: translateX(5px);
}

/* Past trips */
.past-trips-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.past-trips-heading {
  font-family: var(--font-sans);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-muted);
  margin: 0;
}

.past-trips-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.past-trip-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  padding: 1rem 1.25rem;
  transition: all 0.25s ease;
}

.past-trip-card:hover {
  border-color: rgba(184, 151, 90, 0.4);
  box-shadow: 0 6px 20px rgba(184, 151, 90, 0.12);
}

.past-trip-cover {
  position: relative;
  flex-shrink: 0;
  width: 72px;
  height: 72px;
  border-radius: 8px;
  overflow: hidden;
}

.past-trip-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.past-trip-status {
  position: absolute;
  bottom: 4px;
  left: 4px;
  background: rgba(26, 34, 36, 0.75);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: var(--font-sans);
}

.past-trip-info {
  flex: 1;
  min-width: 0;
}

.past-trip-name {
  font-family: var(--font-serif);
  font-size: 1.2rem;
  font-weight: 400;
  margin: 0 0 0.3rem;
  color: var(--color-ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.past-trip-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: var(--color-muted-soft);
}

.past-trip-dot {
  opacity: 0.5;
}

.past-trip-edit {
  flex-shrink: 0;
  padding: 0.5rem 1.1rem;
  background: transparent;
  border: 1px solid rgba(184, 151, 90, 0.45);
  color: var(--color-gold);
  font-family: var(--font-sans);
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.past-trip-edit:hover {
  background: rgba(184, 151, 90, 0.1);
  border-color: var(--color-gold);
}

/* ---- MOBILE ---- */
@media (max-width: 768px) {
  .category-nav {
    gap: 1rem;
    padding: 1.5rem 1rem;
  }

  .tab-button {
    min-width: unset;
    flex: 1;
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }

  .content-section {
    padding: 0 1rem 3rem;
  }

  .section-title {
    font-size: 1.75rem;
  }

  .roadtrips-grid {
    gap: 1.25rem;
  }

  .new-trip-card {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }

  .new-trip-arrow {
    display: none;
  }

  .past-trip-edit {
    padding: 0.45rem 0.85rem;
  }
}
</style>
