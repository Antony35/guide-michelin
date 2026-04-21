<script setup lang="ts">
import { ref } from 'vue'
import type { Roadtrip } from '../../../types'
import { useRoute } from 'vue-router'
import { useRoadtrip } from '../../../composables/useRoadtrip'

const route = useRoute()
const roadtripId = route.params.id as string
const { getRoadtripById } = useRoadtrip()
const roadtrip = ref<Roadtrip | undefined>(getRoadtripById(roadtripId))
</script>

<template>
  <div v-if="roadtrip" class="roadtrip-detail">
    <!-- Header -->
    <div class="detail-header">
      <NuxtLink to="/aventure" class="back-button">
        ← Retour aux aventures
      </NuxtLink>
      <h1 class="detail-title">{{ roadtrip.titre }}</h1>
      <p class="detail-description">{{ roadtrip.description }}</p>
      <div class="detail-meta">
        <span class="meta-duration">⏱ {{ roadtrip.duree }}</span>
        <span class="meta-steps">📍 {{ roadtrip.etapes.length }} étapes</span>
      </div>
    </div>

    <!-- Carte interactive -->
    <div class="map-section">
      <h2 class="section-title">Votre Itinéraire Complet</h2>
      <TripMap :etapes="roadtrip.etapes" />
    </div>

    <!-- Timeline des étapes -->
    <div class="timeline-section">
      <h2 class="section-title">Détail des Étapes</h2>
      <div class="timeline">
        <div
          v-for="(etape, index) in roadtrip.etapes"
          :key="`etape-${index}`"
          class="timeline-item"
        >
          <!-- Connecteur -->
          <div v-if="index < roadtrip.etapes.length - 1" class="timeline-connector" />

          <!-- Marqueur -->
          <div class="timeline-marker">
            <span v-if="index === 0" class="marker-icon">🚀</span>
            <span v-else-if="index === roadtrip.etapes.length - 1" class="marker-icon">🏁</span>
            <span v-else class="marker-icon">⭐</span>
          </div>

          <!-- Contenu -->
          <div class="timeline-content">
            <div class="content-header">
              <h3 class="content-title">{{ etape.nom }}</h3>
              <span class="content-type" :class="`type-${etape.type}`">
                {{ etape.type === 'restaurant' ? 'Restaurant' : 'Hôtel' }}
              </span>
            </div>

            <p class="content-location">📍 {{ etape.ville }}</p>

            <div class="content-rating">
              <span class="stars">
                <StarRating :count="etape.etoiles" :use-logo="etape.type === 'restaurant'" />
              </span>
              <span class="rating-text">{{ etape.etoiles }} étoile{{ etape.etoiles > 1 ? 's' : '' }}</span>
            </div>

            <p v-if="etape.cuisine" class="content-cuisine">{{ etape.cuisine }}</p>
            <p class="content-description">{{ etape.description }}</p>

            <div class="badges">
              <span v-if="index === 0" class="badge badge-start">Départ</span>
              <span v-else-if="index === roadtrip.etapes.length - 1" class="badge badge-end">
                Destination finale
              </span>
              <span v-else class="badge badge-intermediate">Étape {{ index }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Appel à l'action -->
    <div class="cta-section">
      <NuxtLink to="/aventure" class="cta-button">
        Découvrir d'autres itinéraires
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.roadtrip-detail {
  --color-black: #ffffff;
  --color-cream: #0a0a08;
  --color-gold: #111111;
  min-height: 100vh;
  background-color: var(--color-black);
  color: var(--color-cream);
}

/* Header */
.detail-header {
  background: linear-gradient(135deg, rgba(184, 151, 90, 0.1) 0%, rgba(200, 16, 46, 0.05) 100%);
  border-bottom: 1px solid rgba(200, 16, 46, 0.2);
  padding: 3rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.back-button {
  display: inline-block;
  color: var(--color-gold);
  text-decoration: none;
  font-family: var(--font-sans);
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
  transition: color 0.3s ease;
}

.back-button:hover {
  color: var(--color-red);
}

.detail-title {
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 300;
  margin: 0 0 1rem 0;
}

.detail-description {
  font-family: var(--font-sans);
  font-size: 1.125rem;
  color: var(--color-gray);
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
}

.detail-meta {
  display: flex;
  gap: 2rem;
  font-family: var(--font-sans);
  font-size: 0.95rem;
}

.meta-duration,
.meta-steps {
  color: var(--color-gold);
}

/* Map Section */
.map-section {
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-family: var(--font-serif);
  font-size: 2rem;
  font-weight: 300;
  margin: 0 0 2rem 0;
  color: var(--color-cream);
}

/* Timeline */
.timeline-section {
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  border-top: 1px solid rgba(200, 16, 46, 0.2);
}

.timeline {
  position: relative;
  padding: 0;
}

.timeline-item {
  position: relative;
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
  animation: slideIn 0.6s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.timeline-connector {
  position: absolute;
  left: 20px;
  top: 60px;
  width: 2px;
  height: calc(100% + 20px);
  background: linear-gradient(180deg, var(--color-red) 0%, transparent 100%);
}

.timeline-marker {
  min-width: 40px;
  height: 40px;
  background: linear-gradient(135deg, rgba(200, 16, 46, 0.2) 0%, rgba(184, 151, 90, 0.2) 100%);
  border: 2px solid var(--color-red);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.timeline-content {
  flex: 1;
  background: rgba(240, 234, 214, 0.02);
  border: 1px solid rgba(200, 16, 46, 0.15);
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.timeline-content:hover {
  border-color: var(--color-red);
  background: rgba(200, 16, 46, 0.05);
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.content-title {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  font-weight: 400;
  margin: 0;
}

.content-type {
  display: inline-block;
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background-color: rgba(200, 16, 46, 0.2);
  color: var(--color-red);
  text-transform: uppercase;
  white-space: nowrap;
}

.type-hotel {
  background-color: rgba(184, 151, 90, 0.2);
  color: var(--color-gold);
}

.content-location {
  font-family: var(--font-sans);
  color: var(--color-gold);
  margin: 0.5rem 0;
  font-size: 0.95rem;
}

.content-rating {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 1rem 0;
}

.stars {
  color: var(--color-red);
  font-size: 1.125rem;
  letter-spacing: 0.2rem;
}

.rating-text {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  color: var(--color-gray);
}

.content-cuisine {
  font-family: var(--font-sans);
  color: var(--color-gold);
  font-style: italic;
  margin: 0.75rem 0;
  font-size: 0.95rem;
}

.content-description {
  font-family: var(--font-sans);
  color: var(--color-gray);
  line-height: 1.6;
  margin: 1rem 0;
  font-size: 0.95rem;
}

.badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.badge {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 4px;
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-start {
  background-color: transparent;
  border: 2px solid var(--color-red);
  color: var(--color-red);
}

.badge-end {
  background-color: transparent;
  border: 2px solid var(--color-red);
  color: var(--color-red);
}

.badge-intermediate {
  background-color: transparent;
  border: 2px solid rgba(200, 16, 46, 0.3);
  color: var(--color-red);
}

/* CTA Section */
.cta-section {
  padding: 4rem 2rem;
  text-align: center;
  border-top: 1px solid rgba(200, 16, 46, 0.2);
}

.cta-button {
  display: inline-block;
  padding: 0.875rem 1.75rem;
  background-color: transparent;
  border: 2px solid rgba(200, 16, 46, 0.3);
  color: var(--color-red);
  text-decoration: none;
  font-family: var(--font-sans);
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.cta-button:hover {
  transform: translateY(-2px);
  border-color: var(--color-red);
  box-shadow: 0 10px 30px rgba(200, 16, 46, 0.15);
}

@media (max-width: 768px) {
  .detail-header {
    padding: 2rem 1rem;
  }

  .detail-title {
    font-size: 1.75rem;
  }

  .detail-meta {
    flex-direction: column;
    gap: 0.75rem;
  }

  .map-section,
  .timeline-section {
    padding: 2rem 1rem;
  }

  .timeline-item {
    gap: 1rem;
  }

  .timeline-connector {
    left: 18px;
  }

  .timeline-marker {
    min-width: 36px;
    height: 36px;
  }

  .timeline-content {
    padding: 1rem;
  }

  .content-header {
    flex-direction: column;
  }

  .content-type {
    align-self: flex-start;
  }
}
</style>

