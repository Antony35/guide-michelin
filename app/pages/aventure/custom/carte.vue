<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVoyageStore } from '~/stores/voyage'
import { useVoyageData, CITIES } from '~/composables/useVoyageData'
import type { Restaurant, Hotel, JourVoyage } from '~/types'

definePageMeta({ layout: false })

const route = useRoute()
const router = useRouter()
const store = useVoyageStore()
const { getCity, getItemsForCities } = useVoyageData()

const showEtapeModal = ref(false)
const newEtapeNom = ref('')
const newEtapeDate = ref('')

// ─── Bottom sheet drag ────────────────────────────────────────────────────────

const SHEET_CLOSED = 52
const SHEET_PEEK   = 235

const sheetHeight  = ref(SHEET_CLOSED)
const isDragging   = ref(false)
let dragStartY     = 0
let dragStartH     = 0
let sheetMaxH      = 0

function getClientY(e: TouchEvent | MouseEvent): number {
  return 'touches' in e ? e.touches[0].clientY : e.clientY
}

function onHandleDown(e: TouchEvent | MouseEvent) {
  isDragging.value = true
  dragStartY = getClientY(e)
  dragStartH = sheetHeight.value
  sheetMaxH  = window.innerHeight * 0.6

  document.addEventListener('touchmove', onDragMove, { passive: false })
  document.addEventListener('touchend',  onDragEnd)
  document.addEventListener('mousemove', onDragMove)
  document.addEventListener('mouseup',   onDragEnd)
}

function onDragMove(e: TouchEvent | MouseEvent) {
  if (!isDragging.value) return
  if (e.cancelable) e.preventDefault()
  const delta = dragStartY - getClientY(e)
  sheetHeight.value = Math.max(SHEET_CLOSED, Math.min(sheetMaxH, dragStartH + delta))
}

function onDragEnd() {
  isDragging.value = false
  snapToNearest()
  document.removeEventListener('touchmove', onDragMove)
  document.removeEventListener('touchend',  onDragEnd)
  document.removeEventListener('mousemove', onDragMove)
  document.removeEventListener('mouseup',   onDragEnd)
}

function snapToNearest() {
  const max  = window.innerHeight * 0.6
  const mid1 = (SHEET_CLOSED + SHEET_PEEK) / 2
  const mid2 = (SHEET_PEEK + max) / 2
  if      (sheetHeight.value < mid1) sheetHeight.value = SHEET_CLOSED
  else if (sheetHeight.value > mid2) sheetHeight.value = max
  else                               sheetHeight.value = SHEET_PEEK
}

// Auto-open to peek when item selected
watch(() => store.selectedItem, (item) => {
  if (item) {
    sheetMaxH = window.innerHeight * 0.6
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
  return getItemsForCities(store.allCityNames)
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
    ? new Date(new Date(last).getTime() - 86400000).toISOString().split('T')[0]
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
          :show-restaurants="store.showRestaurants"
          :show-hotels="store.showHotels"
          @item-clicked="onItemClicked"
        />

        <!-- Filtres -->
        <div class="map-filters">
          <button class="filter-chip" :class="{ active: store.showRestaurants }" @click="store.toggleRestaurants()">🍽️ Restos</button>
          <button class="filter-chip" :class="{ active: store.showHotels }"      @click="store.toggleHotels()">🏨 Hôtels</button>
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

          <div class="sheet-divider" />

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
.map-filters {
  position: absolute;
  top: 0.85rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 500;
  display: flex;
  gap: 0.5rem;
}
.filter-chip {
  padding: 0.45rem 0.9rem;
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
}
.filter-chip.active {
  background: #fff;
  border-color: #c8102e;
  color: #c8102e;
  box-shadow: 0 2px 10px rgba(200,16,46,0.2);
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
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -4px 30px rgba(10,10,8,0.18);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  will-change: height;
}
.sheet-handle {
  display: flex;
  justify-content: center;
  padding: 0.75rem 0 0.5rem;
  cursor: grab;
  flex-shrink: 0;
  user-select: none;
}
.sheet-handle:active { cursor: grabbing; }
.handle-bar {
  width: 40px;
  height: 4px;
  background: #d0d8da;
  border-radius: 99px;
  pointer-events: none;
}
.sheet-scroll {
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 0 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* ── Selected panel ──────────────────────────────── */
.selected-panel {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding-bottom: 0.25rem;
}
.selected-header {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}
.selected-emoji { font-size: 1.6rem; line-height: 1; margin-top: 0.1rem; }
.selected-info { flex: 1; min-width: 0; }
.selected-name {
  font-family: var(--font-serif);
  font-size: 1rem;
  font-weight: 600;
  color: #1a2224;
  margin: 0 0 0.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.selected-sub {
  font-family: var(--font-sans);
  font-size: 0.78rem;
  color: #7a8a8c;
  margin: 0;
}
.selected-close {
  background: none;
  border: none;
  color: #9aabae;
  font-size: 1.3rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  flex-shrink: 0;
}
.selected-close:hover { color: #c8102e; }

/* ── Day chips ───────────────────────────────────── */
.day-chips-area {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.day-chips-label {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 600;
  color: #9aabae;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.day-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}
.day-chip {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.8rem;
  border-radius: 999px;
  border: 1.5px solid rgba(10,10,8,0.15);
  background: #f4f7f8;
  color: #1a2224;
  font-family: var(--font-sans);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s;
}
.day-chip:hover:not(:disabled) {
  border-color: #c8102e;
  background: rgba(200,16,46,0.06);
  color: #c8102e;
}
.day-chip.chip-added {
  background: rgba(34,139,34,0.1);
  border-color: rgba(34,139,34,0.5);
  color: #228b22;
}
.day-chip.chip-disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.chip-badge {
  font-size: 0.7rem;
  font-weight: 700;
}
.chip-badge-added { color: #228b22; }
.chip-badge-count { color: inherit; opacity: 0.6; }

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
.itineraire { display: flex; flex-direction: column; gap: 0; }
.sheet-title {
  font-family: var(--font-serif);
  font-size: 1rem;
  font-weight: 600;
  color: #1a2224;
  margin: 0 0 0.75rem;
}
.jour-block {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding-bottom: 0.9rem;
  margin-bottom: 0.1rem;
  border-bottom: 1px dashed #eef2f3;
}
.jour-block:last-of-type { border-bottom: none; }

.jour-row {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  font-family: var(--font-sans);
  font-size: 0.88rem;
  color: #1a2224;
}
.jour-dot {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.62rem;
  font-weight: 700;
  color: #fff;
}
.dot-d { background: #b8975a; }
.dot-a { background: #c8102e; }
.dot-e { background: #8a8680; }

.jour-city { font-weight: 700; }
.jour-date { font-size: 0.72rem; color: #9aabae; margin-left: auto; }
.jour-remove {
  background: none;
  border: none;
  color: #9aabae;
  font-size: 1rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}
.jour-remove:hover { color: #c8102e; }

.jour-poi-row {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding-left: 0.2rem;
  font-family: var(--font-sans);
  font-size: 0.82rem;
  color: #1a2224;
  min-height: 1.4rem;
}
.poi-emoji { font-size: 0.95rem; flex-shrink: 0; margin-top: 0.05rem; }
.poi-name { flex: 1; }
.poi-empty { color: #c8d0d2; font-style: italic; flex: 1; }
.poi-remove {
  background: none;
  border: none;
  color: #9aabae;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  flex-shrink: 0;
}
.poi-remove:hover { color: #c8102e; }

.poi-resto-list {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  min-width: 0;
}
.poi-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: rgba(200,16,46,0.07);
  border: 1px solid rgba(200,16,46,0.2);
  border-radius: 6px;
  padding: 0.2rem 0.5rem;
  font-size: 0.75rem;
  color: #1a2224;
  font-family: var(--font-sans);
}
.poi-tag-stars { color: #c8102e; font-size: 0.7rem; }
.poi-tag-remove {
  background: none;
  border: none;
  color: #9aabae;
  font-size: 0.8rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}
.poi-tag-remove:hover { color: #c8102e; }

.poi-count {
  font-size: 0.7rem;
  color: #9aabae;
  font-family: var(--font-sans);
  flex-shrink: 0;
  align-self: flex-start;
  margin-top: 0.1rem;
}
.poi-count.count-full { color: #c8102e; font-weight: 700; }

.add-etape-btn {
  margin-top: 0.75rem;
  background: none;
  border: 1.5px dashed rgba(200,16,46,0.35);
  border-radius: 8px;
  padding: 0.6rem 1rem;
  width: 100%;
  font-family: var(--font-sans);
  font-size: 0.85rem;
  font-weight: 600;
  color: #c8102e;
  cursor: pointer;
  transition: background 0.2s;
}
.add-etape-btn:hover { background: rgba(200,16,46,0.05); }

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
</style>
