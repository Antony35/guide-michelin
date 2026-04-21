<script setup lang="ts">
import type { City, Restaurant, Hotel } from '~/types'
import restaurantLogoSrc from '~/assets/logo.svg'

interface Props {
  depart: City
  arrivee: City
  etapes?: City[]
  restaurants?: Restaurant[]
  hotels?: Hotel[]
  selectedRestaurant?: Restaurant | null
  selectedHotel?: Hotel | null
}

const props = withDefaults(defineProps<Props>(), {
  etapes: () => [],
  restaurants: () => [],
  hotels: () => [],
  selectedRestaurant: null,
  selectedHotel: null,
})

const emit = defineEmits<{
  'select-restaurant': [item: Restaurant]
  'select-hotel': [item: Hotel]
}>()

const mapContainer = ref<HTMLElement | null>(null)
let map: import('leaflet').Map | null = null
let L: typeof import('leaflet') | null = null

// ─── Icon builders ───────────────────────────────────────────────────────────

function cityIcon(leaflet: typeof import('leaflet'), color: string, label: string) {
  const html = `
    <svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
      <circle cx="22" cy="22" r="20" fill="${color}" stroke="#f0ead6" stroke-width="2.5"/>
      <text x="22" y="27" text-anchor="middle" font-size="14" font-weight="700"
        fill="#f0ead6" font-family="system-ui, sans-serif">${label}</text>
    </svg>`
  return leaflet.divIcon({ html, iconSize: [44, 44], iconAnchor: [22, 22], popupAnchor: [0, -24], className: '' })
}

function etapeIcon(leaflet: typeof import('leaflet'), label: string) {
  const html = `
    <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="18" r="16" fill="#8a8680" stroke="#f0ead6" stroke-width="2"/>
      <text x="18" y="23" text-anchor="middle" font-size="12" font-weight="700"
        fill="#f0ead6" font-family="system-ui, sans-serif">${label}</text>
    </svg>`
  return leaflet.divIcon({ html, iconSize: [36, 36], iconAnchor: [18, 18], popupAnchor: [0, -20], className: '' })
}

function poiIcon(leaflet: typeof import('leaflet'), type: 'restaurant' | 'hotel', selected: boolean) {
  const bgColor = type === 'restaurant'
    ? (selected ? '#c8102e' : '#e8556a')
    : (selected ? '#b8975a' : '#d4b07a')
  const ring = selected ? 'stroke="#ffffff" stroke-width="3"' : 'stroke="#f0ead6" stroke-width="1.5"'
  const emoji = type === 'restaurant' ? '🍽' : '🏨'
  const size = selected ? 40 : 34
  const half = size / 2
  const r = half - 2
  const html = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${half}" cy="${half}" r="${r}" fill="${bgColor}" ${ring}/>
      <text x="${half}" y="${half + 5}" text-anchor="middle" font-size="${selected ? 15 : 13}">${emoji}</text>
    </svg>`
  return leaflet.divIcon({ html, iconSize: [size, size], iconAnchor: [half, half], popupAnchor: [0, -half - 2], className: '' })
}

// ─── Map lifecycle ────────────────────────────────────────────────────────────

const routePoints = computed<[number, number][]>(() => {
  const pts: [number, number][] = [[props.depart.lat, props.depart.lng]]
  props.etapes.forEach(e => pts.push([e.lat, e.lng]))
  pts.push([props.arrivee.lat, props.arrivee.lng])
  return pts
})

async function buildMap() {
  if (!mapContainer.value || typeof window === 'undefined') return
  if (!L) L = await import('leaflet')

  map = L.map(mapContainer.value, { zoomControl: false })

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; CartoDB',
    subdomains: 'abcd',
    maxZoom: 16,
    minZoom: 4,
  }).addTo(map)

  L.control.zoom({ position: 'topright' }).addTo(map)

  drawAll()
}

function drawAll() {
  if (!map || !L) return

  // Départ
  L.marker([props.depart.lat, props.depart.lng], { icon: cityIcon(L, '#b8975a', 'D') })
    .bindPopup(`<div class="vmap-popup"><strong>${props.depart.city}</strong><br><span class="vmap-badge vmap-badge-depart">Départ</span></div>`)
    .addTo(map)

  // Arrivée
  L.marker([props.arrivee.lat, props.arrivee.lng], { icon: cityIcon(L, '#c8102e', 'A') })
    .bindPopup(`<div class="vmap-popup"><strong>${props.arrivee.city}</strong><br><span class="vmap-badge vmap-badge-arrivee">Arrivée</span></div>`)
    .addTo(map)

  // Étapes intermédiaires
  props.etapes.forEach((ville, i) => {
    L!.marker([ville.lat, ville.lng], { icon: etapeIcon(L!, String(i + 1)) })
      .bindPopup(`<div class="vmap-popup"><strong>${ville.city}</strong><br><span class="vmap-badge">Étape ${i + 1}</span></div>`)
      .addTo(map!)
  })

  // Ligne de trajet
  L.polyline(routePoints.value, {
    color: '#c8102e',
    weight: 3,
    opacity: 0.65,
    dashArray: '8, 8',
  }).addTo(map)

  const starsLabel: Record<string, string> = {
    none: '', bib: 'Bib Gourmand', one: '★', two: '★★', three: '★★★',
  }

  // Restaurants
  props.restaurants.forEach(r => {
    const isSelected = props.selectedRestaurant?.id === r.id
    const rating = starsLabel[r.stars] ?? ''
    const ratingHtml = ['one', 'two', 'three'].includes(r.stars)
      ? Array.from({ length: r.stars === 'one' ? 1 : r.stars === 'two' ? 2 : 3 })
          .map(() => `<img src="${restaurantLogoSrc}" class="vmap-logo-star" alt=""/>`)
          .join('')
      : `<span style="font-size:0.75rem;color:#b8975a">${rating}</span>`
    const popup = `
      <div class="vmap-popup">
        <div class="vmap-popup-type">Restaurant Michelin</div>
        <strong class="vmap-popup-name">${r.name}</strong>
        <div class="vmap-popup-rating">${ratingHtml}</div>
        <em class="vmap-popup-cuisine">${r.style}</em>
        <p class="vmap-popup-desc">${r.description}</p>
        <button class="vmap-select-btn" data-type="restaurant" data-id="${r.id}">
          ${isSelected ? '✓ Sélectionné' : 'Choisir ce restaurant'}
        </button>
      </div>`
    const marker = L!.marker([r.lat, r.lng], { icon: poiIcon(L!, 'restaurant', isSelected) })
    marker.bindPopup(popup, { maxWidth: 240 })
    marker.on('popupopen', () => {
      const btn = marker.getPopup()?.getElement()?.querySelector('.vmap-select-btn')
      btn?.addEventListener('click', () => emit('select-restaurant', r))
    })
    marker.addTo(map!)
  })

  // Hôtels
  props.hotels.forEach(h => {
    const isSelected = props.selectedHotel?.id === h.id
    const stars = '★'.repeat(Number(h.stars))
    const popup = `
      <div class="vmap-popup">
        <div class="vmap-popup-type">Hôtel</div>
        <strong class="vmap-popup-name">${h.name}</strong>
        <div class="vmap-popup-stars">${stars}</div>
        <p class="vmap-popup-desc">${h.description}</p>
        <button class="vmap-select-btn" data-type="hotel" data-id="${h.id}">
          ${isSelected ? '✓ Sélectionné' : 'Choisir cet hôtel'}
        </button>
      </div>`
    const marker = L!.marker([h.lat, h.lng], { icon: poiIcon(L!, 'hotel', isSelected) })
    marker.bindPopup(popup, { maxWidth: 240 })
    marker.on('popupopen', () => {
      const btn = marker.getPopup()?.getElement()?.querySelector('.vmap-select-btn')
      btn?.addEventListener('click', () => emit('select-hotel', h))
    })
    marker.addTo(map!)
  })

  // Fit bounds sur D + étapes + A
  const bounds = L.latLngBounds(routePoints.value)
  map.fitBounds(bounds, { padding: [60, 60] })
}

function destroyMap() {
  if (map) {
    map.off()
    map.remove()
    map = null
  }
}

function rebuild() {
  destroyMap()
  buildMap()
}

onMounted(() => buildMap())
onBeforeUnmount(() => destroyMap())

watch(
  () => [props.depart, props.arrivee, props.etapes, props.restaurants, props.hotels, props.selectedRestaurant, props.selectedHotel],
  () => rebuild(),
  { deep: true }
)
</script>

<template>
  <div class="voyage-map-wrapper">
    <div ref="mapContainer" class="voyage-map" />
  </div>
</template>

<style scoped>
.voyage-map-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}
.voyage-map {
  width: 100%;
  height: 100%;
}
</style>

<style>
.vmap-popup {
  font-family: var(--font-sans, system-ui, sans-serif);
  color: #1a2224;
  min-width: 180px;
}
.vmap-popup-type {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #7a8a8c;
  margin-bottom: 0.25rem;
}
.vmap-popup-name {
  display: block;
  font-family: var(--font-serif, Georgia, serif);
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 0.35rem;
}
.vmap-popup-rating {
  display: flex;
  gap: 3px;
  margin-bottom: 0.25rem;
}
.vmap-logo-star {
  width: 13px;
  height: 13px;
}
.vmap-popup-stars {
  color: #c8102e;
  letter-spacing: 0.1em;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}
.vmap-popup-cuisine {
  font-size: 0.8rem;
  color: #b8975a;
  display: block;
  margin-bottom: 0.35rem;
}
.vmap-popup-desc {
  font-size: 0.8rem;
  color: #4a5a5c;
  line-height: 1.4;
  margin: 0 0 0.6rem;
}
.vmap-badge {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.2rem 0.55rem;
  border-radius: 4px;
  background: rgba(10, 10, 8, 0.1);
  color: #1a2224;
}
.vmap-badge-depart { background: #b8975a22; color: #8a6830; }
.vmap-badge-arrivee { background: #c8102e22; color: #c8102e; }
.vmap-select-btn {
  display: block;
  width: 100%;
  padding: 0.45rem 0.75rem;
  background: rgba(200, 16, 46, 0.12);
  color: #c8102e;
  border: 1.5px solid rgba(200, 16, 46, 0.4);
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.vmap-select-btn:hover {
  background: rgba(200, 16, 46, 0.22);
}
</style>
