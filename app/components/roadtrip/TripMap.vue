<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import type { EtapeRoadtrip } from '../../types'
import restaurantLogoSrc from '../../assets/logo.svg'

interface Props {
  etapes: EtapeRoadtrip[]
}

const props = withDefaults(
  defineProps<Props>(),
  {
    etapes: () => [],
  }
)

const mapContainer = ref<HTMLElement | null>(null)
let map: import('leaflet').Map | null = null
let leafletModule: typeof import('leaflet') | null = null

// Créer des icônes personnalisées pour chaque type
const createIcon = (
  L: typeof import('leaflet'),
  type: 'start' | 'end' | 'step',
  label?: string
) => {
  let html = ''

  if (type === 'start') {
    html = `
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" fill="#b8975a" stroke="#f0ead6" stroke-width="2"/>
        <circle cx="20" cy="20" r="6" fill="#f0ead6"/>
        ${label ? `<text x="20" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#0a0a08" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif">${label}</text>` : ''}
      </svg>
    `
  } else if (type === 'end') {
    html = `
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" fill="#c8102e" stroke="#f0ead6" stroke-width="2"/>
        <circle cx="20" cy="20" r="6" fill="#f0ead6"/>
        ${label ? `<text x="20" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#f0ead6" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif">${label}</text>` : ''}
      </svg>
    `
  } else {
    html = `
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" fill="#8a8680" stroke="#f0ead6" stroke-width="2"/>
        <circle cx="20" cy="20" r="6" fill="#f0ead6"/>
      </svg>
    `
  }

  return L.divIcon({
    html,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
    className: 'custom-marker',
  })
}

// Calculer le centre de la carte basé sur toutes les étapes
const mapCenter = computed(() => {
  if (!props.etapes || props.etapes.length === 0) return [48.8566, 2.3522]

  const lats = props.etapes.map(e => e.lat)
  const lngs = props.etapes.map(e => e.lng)

  const centerLat = (Math.max(...lats) + Math.min(...lats)) / 2
  const centerLng = (Math.max(...lngs) + Math.min(...lngs)) / 2

  return [centerLat, centerLng]
})

// Créer les points pour la ligne de trajet
const routePoints = computed(() => {
  return props.etapes.map(e => [e.lat, e.lng])
})

// Initialiser la carte
const initMap = async () => {
  if (!mapContainer.value || map) return
  if (typeof window === 'undefined') return

  if (!leafletModule) {
    leafletModule = await import('leaflet')
  }
  const L = leafletModule

  map = L.map(mapContainer.value).setView(mapCenter.value as L.LatLngExpression, 7)

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; CartoDB',
    subdomains: 'abcd',
    maxZoom: 16,
    minZoom: 5,
  }).addTo(map)

  // Ajouter les marqueurs
  props.etapes.forEach((etape, index) => {
    const iconType = index === 0 ? 'start' : index === props.etapes.length - 1 ? 'end' : 'step'
    const iconLabel = iconType === 'start' ? 'D' : iconType === 'end' ? 'A' : undefined
    const marker = L.marker([etape.lat, etape.lng], {
      icon: createIcon(L, iconType, iconLabel),
    })

    const roleLabel =
      index === 0
        ? '🚀 Départ'
        : index === props.etapes.length - 1
          ? '🏁 Arrivée'
          : `⭐ Étape ${index}`

    const ratingHtml =
      etape.type === 'restaurant'
        ? `<span class="logo-stars">${Array.from({ length: etape.etoiles })
            .map(() => `<img src="${restaurantLogoSrc}" alt="" class="logo-star" />`)
            .join('')}</span>`
        : `<span class="stars">${'★'.repeat(etape.etoiles)}</span>`

    const popupContent = `
      <div class="marker-popup">
        <div class="popup-role">${roleLabel}</div>
        <h3 class="popup-title">${etape.nom}</h3>
        <p class="popup-subtitle">${etape.ville}</p>
        <div class="popup-rating">
          ${ratingHtml}
        </div>
        ${etape.cuisine ? `<p class="popup-cuisine">${etape.cuisine}</p>` : ''}
        <p class="popup-description">${etape.description}</p>
        ${index === 0 ? '<span class="badge badge-start">Départ</span>' : ''}
        ${index === props.etapes.length - 1 ? '<span class="badge badge-end">Arrivée</span>' : ''}
        ${index > 0 && index < props.etapes.length - 1 ? `<span class="badge badge-step">Étape ${index}</span>` : ''}
      </div>
    `

    marker.bindPopup(popupContent).addTo(map!)
  })

  // Ajouter la ligne de trajet
  if (routePoints.value.length > 1) {
    L.polyline(routePoints.value as L.LatLngExpression[], {
      color: '#c8102e',
      weight: 3,
      opacity: 0.7,
      dashArray: '5, 5',
    }).addTo(map!)
  }

  // Ajuster la vue pour voir tous les marqueurs
  if (props.etapes.length > 0) {
    const bounds = L.latLngBounds(routePoints.value as L.LatLngExpression[])
    map.fitBounds(bounds, { padding: [50, 50] })
  }
}

// Initialiser la carte au mount
onMounted(() => {
  initMap()
})

// Nettoyer la carte au unmount
onBeforeUnmount(() => {
  if (map) {
    map.off()
    map.remove()
    map = null
  }
})

// Mettre à jour la carte si les étapes changent
watch(() => props.etapes, () => {
  if (map) {
    map.off()
    map.remove()
    map = null
  }
  initMap()
})
</script>

<template>
  <div class="trip-map-container">
    <div class="trip-map-legend" aria-hidden="true">
      <div class="legend-title">Légende</div>
      <div class="legend-items">
        <div class="legend-item">
          <span class="legend-dot legend-dot-start" />
          <span>Départ (D)</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot legend-dot-step" />
          <span>Étape</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot legend-dot-end" />
          <span>Arrivée (A)</span>
        </div>
      </div>
    </div>
    <div ref="mapContainer" class="trip-map" />
  </div>
</template>

<style scoped>
.trip-map-container {
  width: 100%;
  height: 600px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(10, 10, 8, 0.3);
  position: relative;
}

.trip-map-legend {
  position: absolute;
  z-index: 500;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(10, 10, 8, 0.12);
  border-radius: 10px;
  padding: 0.75rem 0.85rem;
  backdrop-filter: blur(6px);
  color: #0a0a08;
  font-family: var(--font-sans);
  font-size: 0.85rem;
  box-shadow: 0 10px 30px rgba(10, 10, 8, 0.12);
  user-select: none;
  pointer-events: none;
}

.legend-title {
  font-family: var(--font-serif);
  font-size: 0.95rem;
  margin-bottom: 0.35rem;
}

.legend-items {
  display: grid;
  gap: 0.25rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  display: inline-block;
}

.legend-dot-start { background: #b8975a; }
.legend-dot-step { background: #8a8680; }
.legend-dot-end { background: #c8102e; }

.trip-map {
  width: 100%;
  height: 100%;
  background-color: var(--color-black);
}
</style>

<style>
.leaflet-container {
  background-color: #f5f5f5;
}

.leaflet-control-attribution {
  background-color: var(--color-cream);
  color: var(--color-black);
}

.marker-popup {
  font-family: var(--font-sans);
  color: var(--color-black);
}

.popup-title {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-black);
  margin: 0 0 0.5rem 0;
}

.popup-subtitle {
  font-size: 0.875rem;
  color: var(--color-gray);
  margin: 0 0 0.5rem 0;
}

.popup-role {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: rgba(10, 10, 8, 0.06);
  color: rgba(10, 10, 8, 0.8);
  margin: 0 0 0.5rem 0;
}

.popup-rating {
  margin: 0.5rem 0;
}

.stars {
  color: var(--color-red);
  font-size: 1rem;
  letter-spacing: 0.2rem;
}

.logo-stars {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  line-height: 1;
}

.logo-star {
  width: 14px;
  height: 14px;
  display: inline-block;
}

.popup-cuisine {
  font-size: 0.875rem;
  color: var(--color-gold);
  margin: 0.5rem 0;
  font-style: italic;
}

.popup-description {
  font-size: 0.875rem;
  color: var(--color-black);
  margin: 0.5rem 0;
  line-height: 1.4;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-top: 0.5rem;
  margin-right: 0.25rem;
}

.badge-start {
  background-color: var(--color-gold);
  color: var(--color-black);
}

.badge-end {
  background-color: var(--color-red);
  color: var(--color-cream);
}

.badge-step {
  background-color: var(--color-gray);
  color: var(--color-cream);
}

.custom-marker {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
</style>

