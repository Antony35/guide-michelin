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
  'item-clicked': [item: Restaurant | Hotel, type: 'restaurant' | 'hotel']
  'ville-clicked': [ville: City]
}>()

const mapContainer = ref<HTMLElement | null>(null)
let map: import('leaflet').Map | null = null
let L: typeof import('leaflet') | null = null

// Couches persistantes — pas de rebuild sur chaque interaction
const cityMarkers = new Map<string, import('leaflet').Marker>()
const poiMarkers  = new Map<string, import('leaflet').Marker>()
let routeLine: import('leaflet').Polyline | null = null

// ─── Icon builders ────────────────────────────────────────────────────────────

function cityIcon(lf: typeof import('leaflet'), color: string, label: string) {
  const html = `
    <svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
      <circle cx="22" cy="22" r="20" fill="${color}" stroke="#f0ead6" stroke-width="2.5"/>
      <text x="22" y="27" text-anchor="middle" font-size="14" font-weight="700"
        fill="#f0ead6" font-family="system-ui, sans-serif">${label}</text>
    </svg>`
  return lf.divIcon({ html, iconSize: [44, 44], iconAnchor: [22, 22], className: '' })
}

function etapeIcon(lf: typeof import('leaflet'), label: string) {
  const html = `
    <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="18" r="16" fill="#8a8680" stroke="#f0ead6" stroke-width="2"/>
      <text x="18" y="23" text-anchor="middle" font-size="12" font-weight="700"
        fill="#f0ead6" font-family="system-ui, sans-serif">${label}</text>
    </svg>`
  return lf.divIcon({ html, iconSize: [36, 36], iconAnchor: [18, 18], className: '' })
}

function poiIcon(lf: typeof import('leaflet'), type: 'restaurant' | 'hotel', selected: boolean) {
  const bg = type === 'restaurant'
    ? (selected ? '#c8102e' : '#e8556a')
    : (selected ? '#b8975a' : '#d4b07a')
  const ring = selected ? 'stroke="#ffffff" stroke-width="3"' : 'stroke="#f0ead6" stroke-width="1.5"'
  const emoji = type === 'restaurant' ? '🍽' : '🏨'
  const size = selected ? 42 : 34
  const half = size / 2
  const r = half - 2
  const html = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${half}" cy="${half}" r="${r}" fill="${bg}" ${ring}/>
      <text x="${half}" y="${half + 5}" text-anchor="middle" font-size="${selected ? 15 : 13}">${emoji}</text>
    </svg>`
  return lf.divIcon({ html, iconSize: [size, size], iconAnchor: [half, half], className: '' })
}

// ─── Computed ─────────────────────────────────────────────────────────────────

const routePoints = computed<[number, number][]>(() => {
  const pts: [number, number][] = [[props.depart.lat, props.depart.lng]]
  props.etapes.forEach(e => pts.push([e.lat, e.lng]))
  pts.push([props.arrivee.lat, props.arrivee.lng])
  return pts
})

// ─── City layer ───────────────────────────────────────────────────────────────

function drawCities() {
  if (!map || !L) return
  cityMarkers.forEach(m => m.remove())
  cityMarkers.clear()

  const addCity = (ville: City, color: string, label: string) => {
    const m = L!.marker([ville.lat, ville.lng], { icon: cityIcon(L!, color, label) })
    m.on('click', () => emit('ville-clicked', ville))
    m.addTo(map!)
    cityMarkers.set(ville.city, m)
  }

  addCity(props.depart, '#b8975a', 'D')
  props.etapes.forEach((e, i) => {
    const m = L!.marker([e.lat, e.lng], { icon: etapeIcon(L!, String(i + 1)) })
    m.on('click', () => emit('ville-clicked', e))
    m.addTo(map!)
    cityMarkers.set(e.city, m)
  })
  addCity(props.arrivee, '#c8102e', 'A')
}

function drawRoute() {
  if (routeLine) { routeLine.remove(); routeLine = null }
  if (!map || !L || routePoints.value.length < 2) return
  routeLine = L.polyline(routePoints.value, {
    color: '#c8102e', weight: 3, opacity: 0.65, dashArray: '8, 8',
  }).addTo(map)
}

function fitBounds() {
  if (!map || !L || routePoints.value.length === 0) return
  map.fitBounds(L.latLngBounds(routePoints.value), { padding: [60, 60] })
}

// ─── POI layer ────────────────────────────────────────────────────────────────

function addRestaurantMarker(r: Restaurant) {
  if (!map || !L) return
  const key = `r-${r.id}`
  if (poiMarkers.has(key)) return
  const isSelected = props.selectedRestaurant?.id === r.id
  const marker = L.marker([r.lat, r.lng], { icon: poiIcon(L, 'restaurant', isSelected) })
  marker.on('click', () => {
    map!.flyTo([r.lat, r.lng], 15, { animate: true, duration: 0.6 })
    emit('item-clicked', r, 'restaurant')
  })
  marker.addTo(map)
  poiMarkers.set(key, marker)
}

function addHotelMarker(h: Hotel) {
  if (!map || !L) return
  const key = `h-${h.id}`
  if (poiMarkers.has(key)) return
  const isSelected = props.selectedHotel?.id === h.id
  const marker = L.marker([h.lat, h.lng], { icon: poiIcon(L, 'hotel', isSelected) })
  marker.on('click', () => {
    map!.flyTo([h.lat, h.lng], 15, { animate: true, duration: 0.6 })
    emit('item-clicked', h, 'hotel')
  })
  marker.addTo(map)
  poiMarkers.set(key, marker)
}

function updatePoiIcon(key: string, type: 'restaurant' | 'hotel', selected: boolean) {
  if (!L) return
  poiMarkers.get(key)?.setIcon(poiIcon(L, type, selected))
}

// ─── Map lifecycle ────────────────────────────────────────────────────────────

async function buildMap() {
  if (!mapContainer.value || typeof window === 'undefined') return
  if (!L) L = await import('leaflet')

  map = L.map(mapContainer.value, { zoomControl: false })
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; CartoDB', subdomains: 'abcd', maxZoom: 18, minZoom: 4,
  }).addTo(map)
  L.control.zoom({ position: 'topright' }).addTo(map)

  drawCities()
  drawRoute()
  props.restaurants.forEach(r => addRestaurantMarker(r))
  props.hotels.forEach(h => addHotelMarker(h))
  fitBounds()
}

function destroyMap() {
  if (map) { map.off(); map.remove(); map = null }
  cityMarkers.clear()
  poiMarkers.clear()
  routeLine = null
}

onMounted(() => buildMap())
onBeforeUnmount(() => destroyMap())

// ─── Watches séparés — pas de rebuild global ──────────────────────────────────

// Villes changées (étape ajoutée/retirée) → rebuild couche ville + tracé uniquement
watch(
  () => [props.depart, props.arrivee, props.etapes] as const,
  () => { drawCities(); drawRoute(); fitBounds() },
  { deep: true }
)

// Restaurants : diff — seulement ajouter/retirer les markers concernés
watch(
  () => props.restaurants,
  (newList) => {
    if (!map) return
    for (const [key, marker] of poiMarkers) {
      if (!key.startsWith('r-')) continue
      const id = Number(key.slice(2))
      if (!newList.find(r => r.id === id)) { marker.remove(); poiMarkers.delete(key) }
    }
    newList.forEach(r => addRestaurantMarker(r))
  },
  { deep: true }
)

// Hôtels : diff
watch(
  () => props.hotels,
  (newList) => {
    if (!map) return
    for (const [key, marker] of poiMarkers) {
      if (!key.startsWith('h-')) continue
      const id = Number(key.slice(2))
      if (!newList.find(h => h.id === id)) { marker.remove(); poiMarkers.delete(key) }
    }
    newList.forEach(h => addHotelMarker(h))
  },
  { deep: true }
)

// Sélection changée → setIcon uniquement, zero rebuild
watch(
  [() => props.selectedRestaurant, () => props.selectedHotel],
  ([newR, newH], [oldR, oldH]) => {
    if (oldR) updatePoiIcon(`r-${oldR.id}`, 'restaurant', false)
    if (oldH) updatePoiIcon(`h-${oldH.id}`, 'hotel', false)
    if (newR) updatePoiIcon(`r-${newR.id}`, 'restaurant', true)
    if (newH) updatePoiIcon(`h-${newH.id}`, 'hotel', true)
  }
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
