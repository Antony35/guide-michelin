<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVoyageStore } from '~/stores/voyage'
import { useVoyageData, CITIES } from '~/composables/useVoyageData'
import type { Restaurant, Hotel } from '~/types'


definePageMeta({ layout: false })

const route = useRoute()
const router = useRouter()
const store = useVoyageStore()
const { getCity, getItemsForCities } = useVoyageData()

const showEtapeModal = ref(false)
const sheetOpen = ref(false)
const newEtapeNom = ref('')
const newEtapeDate = ref('')

// ─── Initialisation depuis query params ───────────────────────────────────────

onMounted(() => {
  const departNom = route.query.depart as string
  const arriveeNom = route.query.arrivee as string

  if (!departNom || !arriveeNom) {
    router.replace('/aventure/custom/select')
    return
  }

  const depart = getCity(departNom)
  const arrivee = getCity(arriveeNom)

  if (!depart || !arrivee) {
    router.replace('/aventure/custom/select')
    return
  }

  const dateDepart = route.query.dateDepart as string | undefined
  const dateArrivee = route.query.dateArrivee as string | undefined
  store.initVoyage(depart, arrivee, dateDepart, dateArrivee)
})

// ─── Data réactive ────────────────────────────────────────────────────────────

const mapData = computed(() => {
  if (!store.depart || !store.arrivee) return null
  const { restaurants, hotels } = getItemsForCities(store.allCityNames)
  return { restaurants, hotels }
})

const etapesDisponibles = computed(() =>
  CITIES.filter(c => !store.allCityNames.includes(c.city))
)

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
}

// ─── Actions ──────────────────────────────────────────────────────────────────

function onItemClicked(item: Restaurant | Hotel, type: 'restaurant' | 'hotel') {
  store.setSelectedItem(item, type)
  sheetOpen.value = true
}

function ouvrirModalEtape() {
  const arriveeDate = store.jours[store.jours.length - 1]?.date
  newEtapeDate.value = arriveeDate
    ? new Date(new Date(arriveeDate).getTime() - 86400000).toISOString().split('T')[0]
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
    <!-- Contenu principal -->
    <div class="carte-body" v-if="store.depart && store.arrivee && mapData">
      <!-- Carte Leaflet -->
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
          <button
            class="filter-chip"
            :class="{ active: store.showRestaurants }"
            @click="store.toggleRestaurants()"
          >🍽️ Restos</button>
          <button
            class="filter-chip"
            :class="{ active: store.showHotels }"
            @click="store.toggleHotels()"
          >🏨 Hôtels</button>
        </div>

        <!-- FAB ajouter étape -->
        <button class="fab-etape" @click="ouvrirModalEtape" title="Ajouter une étape">
          <span class="fab-icon">+</span>
          <span class="fab-label">Étape</span>
        </button>
      </div>

      <!-- Bottom Sheet -->
      <div :class="['bottom-sheet', { open: sheetOpen }]">
        <button class="sheet-handle" @click="sheetOpen = !sheetOpen" aria-label="Toggle itinéraire">
          <span class="handle-bar" />
        </button>

        <div class="sheet-content">
          <!-- Itinéraire -->
          <div class="sheet-section">
            <h3 class="sheet-title">Votre itinéraire</h3>
            <div class="route-summary">
              <div
                v-for="(jour, i) in store.jours"
                :key="jour.id"
                class="route-jour"
              >
                <div class="jour-header">
                  <span
                    class="city-dot"
                    :class="i === 0 ? 'depart' : i === store.jours.length - 1 ? 'arrivee' : 'etape'"
                  >{{ i === 0 ? 'D' : i === store.jours.length - 1 ? 'A' : i }}</span>
                  <span class="jour-city">{{ jour.city.city }}</span>
                  <span class="jour-date">{{ formatDate(jour.date) }}</span>
                  <button
                    v-if="i > 0 && i < store.jours.length - 1"
                    class="remove-etape"
                    @click="store.removeJour(jour.id)"
                  >×</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Restaurant sélectionné -->
          <div v-if="store.selectedRestaurant" class="sheet-section">
            <h3 class="sheet-title">Restaurant</h3>
            <div class="selected-item">
              <div class="selected-header">
                <span class="selected-emoji">🍽️</span>
                <div>
                  <p class="selected-name">{{ store.selectedRestaurant.name }}</p>
                  <p class="selected-sub">{{ store.selectedRestaurant.city }} · {{ store.selectedRestaurant.style }}</p>
                </div>
                <button class="deselect-btn" @click="store.setSelectedItem(null)">×</button>
              </div>
            </div>
          </div>

          <!-- Hôtel sélectionné -->
          <div v-if="store.selectedHotel" class="sheet-section">
            <h3 class="sheet-title">Hôtel</h3>
            <div class="selected-item">
              <div class="selected-header">
                <span class="selected-emoji">🏨</span>
                <div>
                  <p class="selected-name">{{ store.selectedHotel.name }}</p>
                  <p class="selected-sub">{{ store.selectedHotel.city }} · {{ '★'.repeat(Number(store.selectedHotel.stars)) }}</p>
                </div>
                <button class="deselect-btn" @click="store.setSelectedItem(null)">×</button>
              </div>
            </div>
          </div>

          <p v-if="!store.selectedRestaurant && !store.selectedHotel" class="sheet-hint">
            Appuyez sur un restaurant 🍽️ ou hôtel 🏨 pour l'ajouter à votre voyage.
          </p>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-else class="carte-loading">
      <p>Chargement de la carte…</p>
    </div>

    <!-- Modale ajouter étape -->
    <Teleport to="body">
      <div v-if="showEtapeModal" class="modal-overlay" @click.self="showEtapeModal = false">
        <div class="modal-card">
          <h3 class="modal-title">Ajouter une étape</h3>
          <p class="modal-subtitle">Choisissez une ville intermédiaire</p>

          <select v-model="newEtapeNom" class="modal-select">
            <option value="">Sélectionner une ville</option>
            <option v-for="ville in etapesDisponibles" :key="ville.city" :value="ville.city">
              {{ ville.city }}
            </option>
          </select>

          <div class="modal-date-group">
            <label class="modal-date-label">Date de passage</label>
            <input
              v-model="newEtapeDate"
              type="date"
              class="modal-select"
              :min="store.jours[0]?.date"
              :max="store.jours[store.jours.length - 1]?.date"
            />
          </div>

          <div class="modal-actions">
            <button class="modal-btn modal-cancel" @click="showEtapeModal = false">Annuler</button>
            <button class="modal-btn modal-confirm" :disabled="!newEtapeNom" @click="ajouterEtape">
              Ajouter
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.carte-page {
  display: flex;
  flex-direction: column;
  /* header ~3.75rem + breadcrumb ~2rem */
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

/* ── Map ────────────────────────────────────────── */
.map-area {
  flex: 1;
  position: relative;
  overflow: hidden;
}

/* ── Filtres ────────────────────────────────────── */
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
  border: 1.5px solid rgba(10, 10, 8, 0.15);
  background: rgba(255, 255, 255, 0.92);
  color: #9aabae;
  backdrop-filter: blur(8px);
  transition: all 0.2s;
}
.filter-chip.active {
  background: #ffffff;
  border-color: #c8102e;
  color: #c8102e;
  box-shadow: 0 2px 10px rgba(200, 16, 46, 0.2);
}

/* ── FAB étape ──────────────────────────────────── */
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
  color: #ffffff;
  border: none;
  border-radius: 999px;
  font-family: var(--font-sans);
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(200, 16, 46, 0.5);
  transition: transform 0.2s, box-shadow 0.2s;
}
.fab-etape:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 28px rgba(200, 16, 46, 0.6);
}
.fab-icon { font-size: 1.2rem; line-height: 1; font-weight: 400; }

/* ── Bottom Sheet ───────────────────────────────── */
.bottom-sheet {
  background: #ffffff;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -4px 30px rgba(10, 10, 8, 0.2);
  transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 56px;
  overflow: hidden;
  flex-shrink: 0;
}
.bottom-sheet.open {
  max-height: 55vh;
  overflow-y: auto;
}

.sheet-handle {
  display: flex;
  justify-content: center;
  padding: 0.75rem 0 0.5rem;
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
}
.handle-bar {
  width: 40px;
  height: 4px;
  background: #d0d8da;
  border-radius: 99px;
}

.sheet-content {
  padding: 0 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sheet-section {}

.sheet-title {
  font-family: var(--font-serif);
  font-size: 1rem;
  font-weight: 600;
  color: #1a2224;
  margin: 0 0 0.6rem;
}

.route-summary {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.route-jour {}

.jour-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: #1a2224;
}

.jour-city {
  font-weight: 600;
}

.jour-date {
  font-size: 0.75rem;
  color: #9aabae;
  margin-left: auto;
}

.city-dot {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 700;
  color: #fff;
  font-family: var(--font-sans);
}
.city-dot.depart { background: #b8975a; }
.city-dot.arrivee { background: #c8102e; }
.city-dot.etape { background: #8a8680; }

.remove-etape {
  margin-left: auto;
  background: none;
  border: none;
  color: #9aabae;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}
.remove-etape:hover { color: #c8102e; }

.selected-item {
  background: rgba(200, 16, 46, 0.06);
  border: 1px solid rgba(200, 16, 46, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
}
.selected-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.selected-emoji { font-size: 1.4rem; }
.selected-name {
  font-family: var(--font-serif);
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0;
  color: #1a2224;
}
.selected-sub {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  color: #7a8a8c;
  margin: 0.15rem 0 0;
}
.deselect-btn {
  margin-left: auto;
  background: none;
  border: none;
  color: #9aabae;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}
.deselect-btn:hover { color: #c8102e; }

.sheet-hint {
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: #9aabae;
  text-align: center;
  margin: 0;
  padding: 0.5rem 0;
}

/* ── Loading ────────────────────────────────────── */
.carte-loading {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9aabae;
  font-family: var(--font-sans);
}

/* ── Modal ──────────────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 10, 8, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1.5rem;
}
.modal-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 1.75rem 1.5rem;
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 16px 48px rgba(10, 10, 8, 0.25);
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
.modal-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.5px solid rgba(200, 16, 46, 0.3);
  border-radius: 8px;
  background: #f8fafa;
  color: #1a2224;
  font-family: var(--font-sans);
  font-size: 1rem;
}
.modal-select:focus { outline: none; border-color: #c8102e; }

.modal-date-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.modal-date-label {
  font-family: var(--font-sans);
  font-size: 0.78rem;
  font-weight: 600;
  color: #7a8a8c;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
}
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
.modal-cancel {
  background: #eef2f3;
  color: #7a8a8c;
}
.modal-cancel:hover { background: #e0e8ea; }
.modal-confirm {
  background: rgba(200, 16, 46, 0.15);
  color: #c8102e;
  border: 1.5px solid rgba(200, 16, 46, 0.4);
}
.modal-confirm:hover:not(:disabled) { background: rgba(200, 16, 46, 0.25); }
.modal-confirm:disabled { opacity: 0.45; cursor: not-allowed; }
</style>
