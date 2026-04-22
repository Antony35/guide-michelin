<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVoyageStore } from '~/stores/voyage'
import { CITIES } from '~/composables/useVoyageData'
import type { Restaurant, Hotel, JourVoyage } from '~/types'

definePageMeta({ layout: false })

const route = useRoute()
const router = useRouter()
const store = useVoyageStore()
const { getCity, getItemsForCities } = useVoyageData()

const showEtapeModal  = ref(false)
const newEtapeNom     = ref('')
const newEtapeDate    = ref('')
const activeDropdown  = ref<'restos' | 'hotels' | null>(null)

const restaurantOptions = [
  { value: 'bib',   label: 'Bib Gourmand' },
  { value: 'one',   label: '★ Une étoile' },
  { value: 'two',   label: '★★ Deux étoiles' },
  { value: 'three', label: '★★★ Trois étoiles' },
  { value: 'none',  label: 'Sans distinction' },
] as const

const hotelOptions = [
  { value: '3', label: '★★★' },
  { value: '4', label: '★★★★' },
  { value: '5', label: '★★★★★' },
] as const

// ─── Bottom sheet drag ────────────────────────────────────────────────────────

const SHEET_CLOSED = 48
const SHEET_PEEK   = 280

const sheetHeight  = ref(SHEET_CLOSED)
const isDragging   = ref(false)
let dragStartY     = 0
let dragStartH     = 0
let sheetMaxH      = 0
let lastVelocity   = 0

function getClientY(e: TouchEvent | MouseEvent): number {
  return 'touches' in e ? (e.touches[0]?.clientY ?? 0) : e.clientY
}

function onHandleDown(e: TouchEvent | MouseEvent) {
  isDragging.value = true
  dragStartY = getClientY(e)
  dragStartH = sheetHeight.value
  sheetMaxH = Math.max(window.innerHeight * 0.75, window.innerHeight - 120)
  lastVelocity = 0

  document.addEventListener('touchmove', onDragMove, { passive: false })
  document.addEventListener('touchend', onDragEnd)
  document.addEventListener('mousemove', onDragMove)
  document.addEventListener('mouseup', onDragEnd)
}

function onDragMove(e: TouchEvent | MouseEvent) {
  if (!isDragging.value) return
  if (e.cancelable) e.preventDefault()
  const delta = dragStartY - getClientY(e)
  lastVelocity = delta
  sheetHeight.value = Math.max(SHEET_CLOSED, Math.min(sheetMaxH, dragStartH + delta))
}

function onDragEnd() {
  isDragging.value = false
  snapToNearest(lastVelocity)
  document.removeEventListener('touchmove', onDragMove)
  document.removeEventListener('touchend', onDragEnd)
  document.removeEventListener('mousemove', onDragMove)
  document.removeEventListener('mouseup', onDragEnd)
}

function snapToNearest(velocity: number = 0) {
  const max = sheetMaxH
  const mid1 = (SHEET_CLOSED + SHEET_PEEK) / 2
  const mid2 = (SHEET_PEEK + max) / 2

  // With velocity, prefer the direction of movement
  if (Math.abs(velocity) > 5) {
    if (velocity > 0) {
      // Dragging up (positive velocity)
      sheetHeight.value = sheetHeight.value > mid1 ? max : SHEET_CLOSED
    } else {
      // Dragging down (negative velocity)
      sheetHeight.value = sheetHeight.value < mid2 ? SHEET_PEEK : max
    }
  } else {
    // Without velocity, snap to nearest snap point
    if (sheetHeight.value < mid1) sheetHeight.value = SHEET_CLOSED
    else if (sheetHeight.value > mid2) sheetHeight.value = max
    else sheetHeight.value = SHEET_PEEK
  }
}

// Auto-open to peek when item selected
watch(() => store.selectedItem, (item) => {
  if (item) {
    sheetMaxH = Math.max(window.innerHeight * 0.75, window.innerHeight - 120)
    sheetHeight.value = SHEET_PEEK
  }
})

// ─── Initialisation depuis query params ───────────────────────────────────────

onMounted(() => {
  const departNom  = route.query.depart  as string
  const arriveeNom = route.query.arrivee as string

  if (!departNom || !arriveeNom) { router.replace('/aventure/custom/select'); return }

  const depart  = getCity(departNom)
  const arrivee = getCity(arriveeNom)
  if (!depart || !arrivee) { router.replace('/aventure/custom/select'); return }

  store.initVoyage(
    depart, arrivee,
    route.query.dateDepart  as string | undefined,
    route.query.dateArrivee as string | undefined,
  )
})

// ─── Data réactive ────────────────────────────────────────────────────────────

const mapData = computed(() => {
  if (!store.depart || !store.arrivee) return null
  const { restaurants, hotels } = getItemsForCities(store.allCityNames)
  return {
    restaurants: store.restaurantStarFilters.length
      ? restaurants.filter((r: Restaurant) => store.restaurantStarFilters.includes(r.stars))
      : restaurants,
    hotels: store.hotelStarFilters.length
      ? hotels.filter((h: Hotel) => store.hotelStarFilters.includes(h.stars))
      : hotels,
  }
})

const etapesDisponibles = computed(() =>
  CITIES.filter(c => !store.allCityNames.includes(c.city))
)

// ─── Helpers ──────────────────────────────────────────────────────────────────

const starLabels: Record<string, string> = {
  none: '', bib: 'Bib', one: '★', two: '★★', three: '★★★',
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
}

// ─── Logique chips "Ajouter au jour" ─────────────────────────────────────────

function isItemInJour(jour: JourVoyage): boolean {
  if (store.selectedItemType === 'restaurant' && store.selectedRestaurant)
    return jour.restaurants.some(r => r.id === store.selectedRestaurant!.id)
  if (store.selectedItemType === 'hotel' && store.selectedHotel)
    return jour.hotel?.id === store.selectedHotel.id
  return false
}

function canAddToJour(jour: JourVoyage): boolean {
  // Vérifier que l'item et le jour sont dans la même ville
  if (!store.selectedItem) return false
  if (store.selectedItem.city.toLowerCase() !== jour.city.city.toLowerCase()) return false

  if (store.selectedItemType === 'restaurant') return jour.restaurants.length < 3
  if (store.selectedItemType === 'hotel')      return jour.hotel === null
  return false
}

function toggleItemInJour(jour: JourVoyage) {
  if (store.selectedItemType === 'restaurant' && store.selectedRestaurant) {
    isItemInJour(jour)
      ? store.removeRestaurant(jour.id, store.selectedRestaurant.id)
      : store.addRestaurant(jour.id, store.selectedRestaurant)
  } else if (store.selectedItemType === 'hotel' && store.selectedHotel) {
    store.setHotel(jour.id, store.selectedHotel)
  }
}

// ─── Actions modales ──────────────────────────────────────────────────────────

function onItemClicked(item: Restaurant | Hotel, type: 'restaurant' | 'hotel') {
  store.setSelectedItem(item, type)
}

function ouvrirModalEtape() {
  const last = store.jours[store.jours.length - 1]?.date
  newEtapeDate.value = last
    ? (new Date(new Date(last).getTime() - 86400000).toISOString().split('T')[0] ?? '')
    : ''
  showEtapeModal.value = true
}

function ajouterEtape() {
  if (!newEtapeNom.value) return
  const ville = getCity(newEtapeNom.value)
  if (ville) store.addEtape(ville, newEtapeDate.value || undefined)
  newEtapeNom.value = ''
  newEtapeDate.value = ''
  showEtapeModal.value = false
}
</script>

<template>
  <div class="carte-page">
    <div class="carte-body" v-if="store.depart && store.arrivee && mapData">

      <!-- Carte -->
      <div class="map-area">
        <CarteVoyageMap
          :depart="store.depart"
          :arrivee="store.arrivee"
          :etapes="store.etapes"
          :restaurants="mapData.restaurants"
          :hotels="mapData.hotels"
          :selected-restaurant="store.selectedRestaurant"
          :selected-hotel="store.selectedHotel"
          @item-clicked="onItemClicked"
        />

        <!-- Backdrop ferme les dropdowns -->
        <div v-if="activeDropdown" class="filter-backdrop" @click="activeDropdown = null" />

        <!-- Filtres dropdowns -->
        <div class="map-filters">

          <!-- Restaurants -->
          <div class="filter-wrap">
            <button
              class="filter-chip"
              :class="{ active: store.restaurantFilterActive }"
              @click.stop="activeDropdown = activeDropdown === 'restos' ? null : 'restos'"
            >
              🍽️ Restos
              <span v-if="store.restaurantFilterActive" class="filter-count">{{ store.restaurantStarFilters.length }}</span>
              <span class="filter-caret">▾</span>
            </button>
            <div v-if="activeDropdown === 'restos'" class="filter-panel" @click.stop>
              <button
                v-for="opt in restaurantOptions"
                :key="opt.value"
                class="filter-opt"
                :class="{ 'filter-opt-on': store.restaurantStarFilters.includes(opt.value as StarLevel) }"
                @click="store.toggleRestaurantStar(opt.value as StarLevel)"
              >
                <span class="opt-check">{{ store.restaurantStarFilters.includes(opt.value as any) ? '✓' : '' }}</span>
                {{ opt.label }}
              </button>
            </div>
          </div>

          <!-- Hôtels -->
          <div class="filter-wrap">
            <button
              class="filter-chip"
              :class="{ active: store.hotelFilterActive }"
              @click.stop="activeDropdown = activeDropdown === 'hotels' ? null : 'hotels'"
            >
              🏨 Hôtels
              <span v-if="store.hotelFilterActive" class="filter-count">{{ store.hotelStarFilters.length }}</span>
              <span class="filter-caret">▾</span>
            </button>
            <div v-if="activeDropdown === 'hotels'" class="filter-panel" @click.stop>
              <button
                v-for="opt in hotelOptions"
                :key="opt.value"
                class="filter-opt"
                :class="{ 'filter-opt-on': store.hotelStarFilters.includes(opt.value) }"
                @click="store.toggleHotelStar(opt.value)"
              >
                <span class="opt-check">{{ store.hotelStarFilters.includes(opt.value) ? '✓' : '' }}</span>
                {{ opt.label }}
              </button>
            </div>
          </div>

        </div>

        <!-- FAB étape -->
        <button class="fab-etape" @click="ouvrirModalEtape">
          <span class="fab-icon">+</span>
          <span class="fab-label">Étape</span>
        </button>
      </div>

      <!-- ── Bottom Sheet ── -->
      <div
        class="bottom-sheet"
        :style="{
          height: sheetHeight + 'px',
          transition: isDragging ? 'none' : 'height 0.32s cubic-bezier(0.4,0,0.2,1)',
        }"
      >
        <!-- Handle draggable -->
        <div
          class="sheet-handle"
          @touchstart.prevent="onHandleDown"
          @mousedown="onHandleDown"
        >
          <span class="handle-bar" />
        </div>

        <!-- Contenu scrollable -->
        <div class="sheet-scroll">

          <!-- ── Item sélectionné ── -->
          <div v-if="store.selectedItem" class="selected-panel">
            <div class="selected-header">
              <span class="selected-emoji">{{ store.selectedItemType === 'restaurant' ? '🍽️' : '🏨' }}</span>
              <div class="selected-info">
                <p class="selected-name">
                  {{ store.selectedRestaurant?.name ?? store.selectedHotel?.name }}
                </p>
                <p class="selected-sub">
                  <template v-if="store.selectedRestaurant">
                    {{ store.selectedRestaurant.city }} · {{ store.selectedRestaurant.style }}
                    <span v-if="store.selectedRestaurant.stars !== 'none'"> · {{ starLabels[store.selectedRestaurant.stars] }}</span>
                  </template>
                  <template v-else-if="store.selectedHotel">
                    {{ store.selectedHotel.city }} · {{ '★'.repeat(Number(store.selectedHotel.stars)) }}
                  </template>
                </p>
              </div>
              <button class="selected-close" @click="store.setSelectedItem(null)">×</button>
            </div>

            <!-- Chips jours -->
            <div class="day-chips-area">
              <span class="day-chips-label">Ajouter au :</span>
              <div class="day-chips">
                <button
                  v-for="(jour, i) in store.jours"
                  :key="jour.id"
                  class="day-chip"
                  :class="{
                    'chip-added':    isItemInJour(jour),
                    'chip-disabled': !isItemInJour(jour) && !canAddToJour(jour),
                  }"
                  :disabled="!isItemInJour(jour) && !canAddToJour(jour)"
                  @click="toggleItemInJour(jour)"
                >
                  <span>J{{ i + 1 }} · {{ jour.city.city }}</span>
                  <span v-if="isItemInJour(jour)" class="chip-badge chip-badge-added">✓</span>
                  <span v-else-if="store.selectedItemType === 'restaurant'" class="chip-badge chip-badge-count">{{ jour.restaurants.length }}/3</span>
                  <span v-else-if="store.selectedItemType === 'hotel' && jour.hotel" class="chip-badge chip-badge-count">✓</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Hint quand rien sélectionné -->
          <p v-else class="sheet-hint">
            Appuyez sur un restaurant 🍽️ ou hôtel 🏨 pour l'ajouter à votre voyage.
          </p>

          <div class="sheet-divider" ></div >

          <!-- ── Itinéraire ── -->
          <div class="itineraire">
            <h3 class="sheet-title">Itinéraire</h3>

            <div v-for="(jour, i) in store.jours" :key="jour.id" class="jour-block">

              <!-- En-tête jour -->
              <div class="jour-row">
                <span class="jour-dot" :class="i === 0 ? 'dot-d' : i === store.jours.length - 1 ? 'dot-a' : 'dot-e'">
                  {{ i === 0 ? 'D' : i === store.jours.length - 1 ? 'A' : i }}
                </span>
                <span class="jour-city">{{ jour.city.city }}</span>
                <span class="jour-date">{{ formatDate(jour.date) }}</span>
                <button v-if="i > 0 && i < store.jours.length - 1" class="jour-remove" @click="store.removeJour(jour.id)">×</button>
              </div>

              <!-- Hôtel du jour -->
              <div class="jour-poi-row">
                <span class="poi-emoji">🏨</span>
                <template v-if="jour.hotel">
                  <span class="poi-name">{{ jour.hotel.name }}</span>
                  <button class="poi-remove" @click="store.setHotel(jour.id, jour.hotel)">×</button>
                </template>
                <span v-else class="poi-empty">—</span>
              </div>

              <!-- Restaurants du jour -->
              <div class="jour-poi-row">
                <span class="poi-emoji">🍽️</span>
                <div v-if="jour.restaurants.length" class="poi-resto-list">
                  <span v-for="r in jour.restaurants" :key="r.id" class="poi-tag">
                    {{ r.name }}
                    <span v-if="r.stars !== 'none'" class="poi-tag-stars">{{ starLabels[r.stars] }}</span>
                    <button class="poi-tag-remove" @click="store.removeRestaurant(jour.id, r.id)">×</button>
                  </span>
                </div>
                <span v-else class="poi-empty">—</span>
                <span class="poi-count" :class="{ 'count-full': jour.restaurants.length >= 3 }">
                  {{ jour.restaurants.length }}/3
                </span>
              </div>

            </div>

            <button class="add-etape-btn" @click="ouvrirModalEtape">+ Ajouter une étape</button>
          </div>

        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-else class="carte-loading"><p>Chargement de la carte…</p></div>

    <!-- Modal étape -->
    <Teleport to="body">
      <div v-if="showEtapeModal" class="modal-overlay" @click.self="showEtapeModal = false">
        <div class="modal-card">
          <h3 class="modal-title">Ajouter une étape</h3>
          <p class="modal-subtitle">Choisissez une ville intermédiaire</p>

          <select v-model="newEtapeNom" class="modal-input">
            <option value="">Sélectionner une ville</option>
            <option v-for="ville in etapesDisponibles" :key="ville.city" :value="ville.city">{{ ville.city }}</option>
          </select>

          <div class="modal-date-group">
            <label class="modal-date-label">Date de passage</label>
            <input v-model="newEtapeDate" type="date" class="modal-input"
              :min="store.jours[0]?.date"
              :max="store.jours[store.jours.length - 1]?.date"
            />
          </div>

          <div class="modal-actions">
            <button class="modal-btn modal-cancel" @click="showEtapeModal = false">Annuler</button>
            <button class="modal-btn modal-confirm" :disabled="!newEtapeNom" @click="ajouterEtape">Ajouter</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
/* ── Layout ─────────────────────────────────────── */
.carte-page {
  display: flex;
  flex-direction: column;
  height: calc(100dvh - 5.75rem);
  overflow: hidden;
}
.carte-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  min-height: 0;
}
.map-area {
  flex: 1;
  position: relative;
  overflow: hidden;
  min-height: 0;
}

/* ── Filtres ─────────────────────────────────────── */
.filter-backdrop {
  position: fixed;
  inset: 0;
  z-index: 499;
}
.map-filters {
  position: absolute;
  top: 0.85rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 500;
  display: flex;
  gap: 0.5rem;
}
.filter-wrap {
  position: relative;
}
.filter-chip {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.45rem 0.8rem;
  border-radius: 999px;
  font-family: var(--font-sans);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  border: 1.5px solid rgba(10,10,8,0.15);
  background: rgba(255,255,255,0.92);
  color: #9aabae;
  backdrop-filter: blur(8px);
  transition: all 0.2s;
  white-space: nowrap;
}
.filter-chip.active {
  background: #fff;
  border-color: #c8102e;
  color: #c8102e;
  box-shadow: 0 2px 10px rgba(200,16,46,0.2);
}
.filter-count {
  background: #c8102e;
  color: #fff;
  border-radius: 999px;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.1rem 0.4rem;
  line-height: 1.4;
}
.filter-caret { font-size: 0.65rem; opacity: 0.7; }

.filter-panel {
  position: absolute;
  top: calc(100% + 0.4rem);
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 28px rgba(10,10,8,0.16);
  border: 1px solid rgba(10,10,8,0.08);
  padding: 0.4rem;
  min-width: 170px;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  z-index: 501;
}
.filter-opt {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: none;
  background: none;
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: #1a2224;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;
}
.filter-opt:hover { background: #f4f7f8; }
.filter-opt.filter-opt-on { background: rgba(200,16,46,0.07); color: #c8102e; font-weight: 600; }
.opt-check {
  width: 14px;
  font-size: 0.75rem;
  color: #c8102e;
  font-weight: 700;
  flex-shrink: 0;
}

/* ── FAB ─────────────────────────────────────────── */
.fab-etape {
  position: absolute;
  bottom: 1.25rem;
  right: 1rem;
  z-index: 500;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.65rem 1rem;
  background: #c8102e;
  color: #fff;
  border: none;
  border-radius: 999px;
  font-family: var(--font-sans);
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(200,16,46,0.5);
  transition: transform 0.2s, box-shadow 0.2s;
}
.fab-etape:hover { transform: translateY(-2px); box-shadow: 0 6px 28px rgba(200,16,46,0.6); }
.fab-icon { font-size: 1.2rem; line-height: 1; font-weight: 400; }

/* ── Bottom Sheet ────────────────────────────────── */
.bottom-sheet {
  background: #ffffff;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -8px 40px rgba(10,10,8,0.15);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  will-change: height;
  backface-visibility: hidden;
}
.sheet-handle {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.85rem 0 0.65rem;
  cursor: grab;
  flex-shrink: 0;
  user-select: none;
  min-height: 44px;
  -webkit-touch-callout: none;
}
.sheet-handle:active { cursor: grabbing; }
.handle-bar {
  width: 44px;
  height: 5px;
  background: #dde3e5;
  border-radius: 99px;
  pointer-events: none;
  transition: background 0.2s;
}
.sheet-handle:hover .handle-bar { background: #c8d0d2; }
.sheet-scroll {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  padding: 0 1.25rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 0;
  scroll-behavior: smooth;
}

/* ── Selected panel ──────────────────────────────── */
.selected-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.5rem 0 0.75rem;
}
.selected-header {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
}
.selected-emoji {
  font-size: 2rem;
  line-height: 1;
  margin-top: 0.05rem;
  flex-shrink: 0;
}
.selected-info {
  flex: 1;
  min-width: 0;
  padding-top: 0.15rem;
}
.selected-name {
  font-family: var(--font-serif);
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a2224;
  margin: 0 0 0.3rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
}
.selected-sub {
  font-family: var(--font-sans);
  font-size: 0.8rem;
  color: #7a8a8c;
  margin: 0;
  line-height: 1.4;
}
.selected-close {
  background: none;
  border: none;
  color: #9aabae;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  line-height: 1;
  flex-shrink: 0;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-touch-callout: none;
}
.selected-close:active { color: #c8102e; }

/* ── Day chips ───────────────────────────────────── */
.day-chips-area {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}
.day-chips-label {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 700;
  color: #9aabae;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0;
}
.day-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.day-chip {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.9rem;
  border-radius: 999px;
  border: 1.5px solid rgba(10,10,8,0.12);
  background: #f8fafb;
  color: #1a2224;
  font-family: var(--font-sans);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s cubic-bezier(0.4,0,0.2,1);
  min-height: 40px;
  touch-action: manipulation;
  -webkit-user-select: none;
  user-select: none;
}
.day-chip:active:not(:disabled) {
  background: rgba(200,16,46,0.12);
  border-color: #c8102e;
  color: #c8102e;
}
.day-chip:hover:not(:disabled) {
  border-color: rgba(200,16,46,0.4);
  background: rgba(200,16,46,0.08);
  color: #c8102e;
}
.day-chip.chip-added {
  background: rgba(34,139,34,0.12);
  border-color: rgba(34,139,34,0.6);
  color: #228b22;
}
.day-chip.chip-disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.chip-badge {
  font-size: 0.7rem;
  font-weight: 700;
  line-height: 1;
}
.chip-badge-added { color: #228b22; }
.chip-badge-count { opacity: 0.65; }

/* ── Divider ─────────────────────────────────────── */
.sheet-divider {
  height: 1px;
  background: #eef2f3;
  margin: 0.9rem 0;
  flex-shrink: 0;
}

/* ── Hint ────────────────────────────────────────── */
.sheet-hint {
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: #9aabae;
  text-align: center;
  margin: 0.25rem 0;
  padding: 0.25rem 0;
}

/* ── Itinéraire ──────────────────────────────────── */
.itineraire {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.sheet-title {
  font-family: var(--font-serif);
  font-size: 1.05rem;
  font-weight: 600;
  color: #1a2224;
  margin: 0 0 0.95rem;
  padding: 0.25rem 0;
}
.jour-block {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  padding: 1rem 0;
  border-bottom: 1px solid #f0f3f4;
  position: relative;
}
.jour-block:first-child { padding-top: 0; }
.jour-block:last-child { border-bottom: none; padding-bottom: 0; }

.jour-row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: #1a2224;
  min-height: 36px;
}
.jour-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 800;
  color: #fff;
  line-height: 1;
}
.dot-d { background: #b8975a; }
.dot-a { background: #c8102e; }
.dot-e { background: #8a8680; }

.jour-city {
  font-weight: 700;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.jour-date {
  font-size: 0.75rem;
  color: #9aabae;
  white-space: nowrap;
  margin-left: auto;
  padding-left: 0.5rem;
}
.jour-remove {
  background: none;
  border: none;
  color: #9aabae;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  line-height: 1;
  flex-shrink: 0;
  min-width: 40px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-touch-callout: none;
  border-radius: 8px;
  transition: all 0.15s;
}
.jour-remove:active { background: rgba(200,16,46,0.1); color: #c8102e; }

.jour-poi-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.65rem;
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: #1a2224;
  min-height: 40px;
  background: #fafbfc;
  border-radius: 10px;
  position: relative;
  flex-wrap: wrap;
}
.poi-emoji {
  font-size: 1rem;
  flex-shrink: 0;
  line-height: 1;
}
.poi-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
}
.poi-empty {
  color: #c8d0d2;
  font-style: italic;
  flex: 1;
}
.poi-remove {
  background: none;
  border: none;
  color: #9aabae;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.45rem;
  line-height: 1;
  flex-shrink: 0;
  min-width: 36px;
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-touch-callout: none;
  border-radius: 6px;
  transition: all 0.15s;
}
.poi-remove:active { background: rgba(200,16,46,0.1); color: #c8102e; }

.poi-resto-list {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  min-width: 0;
  order: 3;
  width: 100%;
  margin-top: 0.25rem;
}
.poi-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: rgba(200,16,46,0.09);
  border: 1px solid rgba(200,16,46,0.22);
  border-radius: 8px;
  padding: 0.3rem 0.6rem;
  font-size: 0.77rem;
  color: #1a2224;
  font-family: var(--font-sans);
  font-weight: 500;
  white-space: nowrap;
  max-width: 100%;
}
.poi-tag-stars {
  color: #c8102e;
  font-size: 0.7rem;
  font-weight: 700;
}
.poi-tag-remove {
  background: none;
  border: none;
  color: #9aabae;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  margin-left: 0.15rem;
  flex-shrink: 0;
  -webkit-touch-callout: none;
}
.poi-tag-remove:active { color: #c8102e; }

.poi-count {
  font-size: 0.72rem;
  color: #9aabae;
  font-family: var(--font-sans);
  font-weight: 600;
  flex-shrink: 0;
  white-space: nowrap;
  padding: 0.25rem 0.5rem;
  background: rgba(200,16,46,0.05);
  border-radius: 6px;
}
.poi-count.count-full {
  background: rgba(200,16,46,0.15);
  color: #c8102e;
  font-weight: 800;
}

.add-etape-btn {
  margin-top: 1rem;
  background: none;
  border: 1.5px dashed rgba(200,16,46,0.35);
  border-radius: 10px;
  padding: 0.75rem 1.25rem;
  width: 100%;
  font-family: var(--font-sans);
  font-size: 0.87rem;
  font-weight: 700;
  color: #c8102e;
  cursor: pointer;
  transition: all 0.15s;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-touch-callout: none;
}
.add-etape-btn:active {
  background: rgba(200,16,46,0.1);
  border-color: rgba(200,16,46,0.6);
}

/* ── Divider ─────────────────────────────────────── */
.sheet-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, #f0f3f4, transparent);
  margin: 1rem 0;
  flex-shrink: 0;
}

/* ── Hint ────────────────────────────────────────── */
.sheet-hint {
  font-family: var(--font-sans);
  font-size: 0.88rem;
  color: #9aabae;
  text-align: center;
  margin: 0.5rem 0;
  padding: 1rem 0.5rem;
  line-height: 1.5;
}

/* ── Loading ─────────────────────────────────────── */
.carte-loading {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9aabae;
  font-family: var(--font-sans);
}

/* ── Modal ───────────────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10,10,8,0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1.5rem;
}
.modal-card {
  background: #fff;
  border-radius: 16px;
  padding: 1.75rem 1.5rem;
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 16px 48px rgba(10,10,8,0.25);
}
.modal-title {
  font-family: var(--font-serif);
  font-size: 1.35rem;
  font-weight: 400;
  margin: 0;
  color: #1a2224;
}
.modal-subtitle {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  color: #7a8a8c;
  margin: 0;
}
.modal-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.5px solid rgba(200,16,46,0.3);
  border-radius: 8px;
  background: #f8fafa;
  color: #1a2224;
  font-family: var(--font-sans);
  font-size: 1rem;
}
.modal-input:focus { outline: none; border-color: #c8102e; }
.modal-date-group { display: flex; flex-direction: column; gap: 0.4rem; }
.modal-date-label {
  font-family: var(--font-sans);
  font-size: 0.78rem;
  font-weight: 600;
  color: #7a8a8c;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.modal-actions { display: flex; gap: 0.75rem; }
.modal-btn {
  flex: 1;
  padding: 0.75rem;
  border-radius: 8px;
  font-family: var(--font-sans);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}
.modal-cancel { background: #eef2f3; color: #7a8a8c; }
.modal-cancel:hover { background: #e0e8ea; }
.modal-confirm {
  background: rgba(200,16,46,0.15);
  color: #c8102e;
  border: 1.5px solid rgba(200,16,46,0.4);
}
.modal-confirm:hover:not(:disabled) { background: rgba(200,16,46,0.25); }
.modal-confirm:disabled { opacity: 0.45; cursor: not-allowed; }

/* ── Responsive Media Queries ─────────────────────── */
@media (min-width: 640px) {
  .sheet-scroll {
    padding: 0 1.5rem 2rem;
  }

  .selected-panel {
    gap: 1.15rem;
    padding: 0.65rem 0 1rem;
  }

  .selected-name {
    font-size: 1.15rem;
  }

  .day-chips-area {
    gap: 0.75rem;
  }

  .day-chip {
    font-size: 0.84rem;
    padding: 0.55rem 1rem;
    min-height: 42px;
  }

  .jour-block {
    gap: 0.55rem;
    padding: 1.15rem 0;
  }

  .jour-row {
    font-size: 0.95rem;
    min-height: 40px;
  }

  .jour-dot {
    width: 30px;
    height: 30px;
    font-size: 0.7rem;
  }

  .jour-poi-row {
    gap: 0.7rem;
    padding: 0.6rem 0.75rem;
    font-size: 0.88rem;
    min-height: 44px;
    border-radius: 12px;
  }

  .poi-resto-list {
    gap: 0.5rem;
    margin-top: 0.35rem;
  }

  .poi-tag {
    padding: 0.35rem 0.7rem;
    font-size: 0.78rem;
    border-radius: 10px;
  }

  .add-etape-btn {
    margin-top: 1.25rem;
    padding: 0.85rem 1.5rem;
    font-size: 0.9rem;
    border-radius: 12px;
    min-height: 46px;
  }
}

@media (min-width: 768px) {
  .bottom-sheet {
    border-radius: 24px 24px 0 0;
    box-shadow: 0 -12px 50px rgba(10,10,8,0.12);
  }

  .sheet-handle {
    padding: 1rem 0 0.75rem;
  }

  .handle-bar {
    width: 48px;
    height: 6px;
  }

  .sheet-scroll {
    padding: 0 2rem 2.5rem;
  }

  .selected-panel {
    gap: 1.3rem;
    padding: 0.75rem 0 1.15rem;
  }

  .selected-header {
    gap: 1rem;
  }

  .selected-emoji {
    font-size: 2.25rem;
  }

  .selected-name {
    font-size: 1.25rem;
  }

  .sheet-title {
    font-size: 1.1rem;
    margin: 0 0 1.1rem;
  }

  .day-chips-area {
    gap: 0.85rem;
  }

  .day-chip {
    font-size: 0.86rem;
    padding: 0.6rem 1.1rem;
    min-height: 44px;
  }

  .jour-block {
    gap: 0.6rem;
    padding: 1.25rem 0;
  }

  .jour-row {
    font-size: 0.96rem;
    gap: 0.75rem;
  }

  .jour-date {
    font-size: 0.78rem;
  }

  .jour-poi-row {
    gap: 0.8rem;
    padding: 0.7rem 0.9rem;
    font-size: 0.9rem;
    min-height: 48px;
    border-radius: 14px;
  }

  .add-etape-btn {
    font-size: 0.95rem;
    padding: 0.95rem 1.75rem;
    min-height: 48px;
  }

  .sheet-hint {
    font-size: 0.9rem;
    padding: 1.25rem 1rem;
  }
}

@media (min-width: 1024px) {
  .sheet-scroll {
    padding: 0 2.5rem 3rem;
  }

  .selected-name {
    font-size: 1.3rem;
  }

  .day-chip {
    font-size: 0.88rem;
  }
}

/* ── Optimisation tactile sur mobile ────────────── */
@media (hover: none) and (pointer: coarse) {
  /* Désactiver les hover states sur mobile, garder seulement active */
  .day-chip:hover:not(:disabled),
  .jour-remove:hover,
  .poi-remove:hover,
  .poi-tag-remove:hover,
  .selected-close:hover,
  .add-etape-btn:hover {
    background: inherit;
    color: inherit;
  }

  /* Gardez les active states */
  .day-chip:active:not(:disabled),
  .jour-remove:active,
  .poi-remove:active,
  .poi-tag-remove:active,
  .selected-close:active {
    opacity: 0.8;
  }
}
</style>
