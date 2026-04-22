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

const HOTEL_PHOTOS: Record<string, string[]> = {
  'Four Seasons George V': [
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=70',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=70',
  ],
  'Shangri-La Paris': [
    'https://images.unsplash.com/photo-1551887373-6db7240c93f1?auto=format&fit=crop&w=1200&q=70',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=70',
  ],
  'Le Bristol Paris': [
    'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&w=1200&q=70',
    'https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=1200&q=70',
  ],
  'Villa Florentine': [
    'https://images.unsplash.com/photo-1549294413-26f195471cc6?auto=format&fit=crop&w=1200&q=70',
    'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=70',
  ],
  'InterContinental Lyon - Hotel Dieu': [
    'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=70',
    'https://images.unsplash.com/photo-1535827841776-24afc1e255ac?auto=format&fit=crop&w=1200&q=70',
  ],
  'Cour des Loges': [
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=70',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=70',
  ],
  'Balthazar Hotel & Spa': [
    'https://images.unsplash.com/photo-1551918120-9739cb430c6d?auto=format&fit=crop&w=1200&q=70',
    'https://images.unsplash.com/photo-1521783593447-5702b9bfd267?auto=format&fit=crop&w=1200&q=70',
  ],
  'Le Saint-Antoine Hotel & Spa': [
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=70',
    'https://images.unsplash.com/photo-1496412705862-e0088f16f791?auto=format&fit=crop&w=1200&q=70',
  ],
  'Mama Shelter Rennes': [
    'https://images.unsplash.com/photo-1552902019-a1b3a2b44c07?auto=format&fit=crop&w=1200&q=70',
    'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=70',
  ],
}

function escapeHtml(input: string) {
  return input
    .split('&').join('&amp;')
    .split('<').join('&lt;')
    .split('>').join('&gt;')
    .split('"').join('&quot;')
    .split("'").join('&#039;')
}

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
    const iconLabel = iconType === 'end' ? 'A' : undefined
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

    const hotelPhotos = etape.type === 'hotel'
      ? (HOTEL_PHOTOS[etape.nom] ?? [])
      : []

    const mediaHtml = (etape.type === 'hotel' && hotelPhotos.length)
      ? `
        <div class="popup-media">
          <div class="popup-media-strip">
            ${hotelPhotos
              .slice(0, 3)
              .map((src) => `<img class="popup-photo" src="${src}" alt="${escapeHtml(etape.nom)}" loading="lazy" />`)
              .join('')}
          </div>
        </div>
      `
      : ''

    const ambianceHtml = (etape.ambiance && etape.ambiance.length)
      ? `
        <div class="popup-chips">
          ${etape.ambiance.slice(0, 6).map(a => `<span class="popup-chip">${escapeHtml(a)}</span>`).join('')}
        </div>
      `
      : ''

    const longDescription =
      etape.type === 'hotel'
        ? `${etape.description} Idéal pour une nuit premium avant une table étoilée, avec services bien-être et emplacement pratique pour explorer la ville.`
        : etape.description

    const popupContent = `
      <div class="marker-popup">
        <div class="popup-role">${roleLabel}</div>
        <h3 class="popup-title">${etape.nom}</h3>
        <p class="popup-subtitle">${etape.ville}</p>
        ${mediaHtml}
        <div class="popup-rating">
          ${ratingHtml}
        </div>
        ${ambianceHtml}
        ${etape.cuisine ? `<p class="popup-cuisine">${etape.cuisine}</p>` : ''}
        <p class="popup-description">${escapeHtml(longDescription)}</p>
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
  color: #000000;
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

.popup-media {
  margin: 0.5rem 0 0.75rem;
}

.popup-media-strip {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 78%;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

.popup-photo {
  width: 100%;
  height: 118px;
  object-fit: cover;
  border-radius: 10px;
  scroll-snap-align: start;
  border: 1px solid rgba(10, 10, 8, 0.08);
}

.popup-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin: 0.25rem 0 0.5rem;
}

.popup-chip {
  font-family: var(--font-sans);
  font-size: 0.72rem;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  background: rgba(200, 16, 46, 0.08);
  border: 1px solid rgba(200, 16, 46, 0.18);
  color: #c8102e;
  white-space: nowrap;
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
  color: #000000;
  margin: 0.5rem 0;
  line-height: 1.4;
}

/* Mobile popup layout */
@media (max-width: 480px) {
  .leaflet-popup-content-wrapper {
    border-radius: 14px;
  }

  .leaflet-popup-content {
    margin: 10px 10px;
    width: min(86vw, 360px);
  }

  .popup-title {
    font-size: 1.1rem;
  }

  .popup-description {
    font-size: 0.9rem;
    line-height: 1.5;
  }

  .popup-photo {
    height: 132px;
  }
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
  color: #ffffff;
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

