<script setup lang="ts">
import { computed, ref } from 'vue'
import type { EtapeRoadtrip } from '../../../types'

// 3 villes cibles (restaurants et hôtels séparés)
const cities = ['Paris', 'Lyon', 'Rennes'] as const

const restaurants: EtapeRoadtrip[] = [
  { ordre: 1, type: 'restaurant', ville: 'Paris', lat: 48.8709, lng: 2.3030, nom: 'Le Cinq', etoiles: 3, cuisine: 'Française contemporaine', description: 'Institution parisienne à la cuisine précise et raffinée.' },
  { ordre: 2, type: 'restaurant', ville: 'Paris', lat: 48.8656, lng: 2.3294, nom: 'Epicure', etoiles: 3, cuisine: 'Haute gastronomie française', description: 'Adresse de prestige aux produits d’exception et sauces magistrales.' },
  { ordre: 3, type: 'restaurant', ville: 'Paris', lat: 48.8778, lng: 2.3190, nom: 'Guy Savoy', etoiles: 2, cuisine: 'Française', description: 'Cuisine emblématique, service d’excellence et expérience mémorable.' },
  { ordre: 4, type: 'restaurant', ville: 'Paris', lat: 48.8725, lng: 2.3007, nom: 'Le Jules Verne', etoiles: 2, cuisine: 'Française moderne', description: 'Table gastronomique avec vue spectaculaire sur Paris.' },

  { ordre: 5, type: 'restaurant', ville: 'Lyon', lat: 45.7677, lng: 4.8331, nom: 'Paul Bocuse', etoiles: 2, cuisine: 'Gastronomie lyonnaise', description: 'Maison iconique de la tradition culinaire lyonnaise.' },
  { ordre: 6, type: 'restaurant', ville: 'Lyon', lat: 45.7590, lng: 4.8266, nom: 'La Mère Brazier', etoiles: 2, cuisine: 'Française classique', description: 'Grande maison lyonnaise au patrimoine culinaire exceptionnel.' },
  { ordre: 7, type: 'restaurant', ville: 'Lyon', lat: 45.7580, lng: 4.8216, nom: 'Takao Takano', etoiles: 2, cuisine: 'Franco-japonaise', description: 'Cuisine d’auteur subtile, moderne et très technique.' },
  { ordre: 8, type: 'restaurant', ville: 'Lyon', lat: 45.7648, lng: 4.8353, nom: 'Le Neuvième Art', etoiles: 2, cuisine: 'Créative', description: 'Assiettes graphiques et créativité gastronomique affirmée.' },

  { ordre: 9, type: 'restaurant', ville: 'Rennes', lat: 48.1118, lng: -1.6803, nom: 'Racines', etoiles: 1, cuisine: 'Française contemporaine', description: 'Table rennaise raffinée, produits bretons et assiettes précises.' },
  { ordre: 10, type: 'restaurant', ville: 'Rennes', lat: 48.1124, lng: -1.6791, nom: 'Ima', etoiles: 1, cuisine: 'Créative', description: 'Cuisine inventive, dressages modernes et belle lecture des saisons.' },
  { ordre: 11, type: 'restaurant', ville: 'Rennes', lat: 48.1099, lng: -1.6781, nom: 'Le Ciel de Rennes', etoiles: 1, cuisine: 'Gastronomique française', description: 'Expérience gastronomique élégante avec forte identité locale.' },
  { ordre: 12, type: 'restaurant', ville: 'Rennes', lat: 48.1141, lng: -1.6727, nom: 'Maison Kervarrec', etoiles: 2, cuisine: 'Bretonne contemporaine', description: 'Cuisine d’auteur en Bretagne, précise et profondément territoriale.' },
]

const hotels: EtapeRoadtrip[] = [
  { ordre: 1, type: 'hotel', ville: 'Paris', lat: 48.8683, lng: 2.3000, nom: 'Four Seasons George V', etoiles: 5, ambiance: ['Luxe', 'Palace'], description: 'Palace parisien avec offre gastronomique de très haut niveau.' },
  { ordre: 2, type: 'hotel', ville: 'Paris', lat: 48.8753, lng: 2.2945, nom: 'Shangri-La Paris', etoiles: 5, ambiance: ['Vue', 'Prestige'], description: 'Hôtel d’exception alliant raffinement asiatique et art de vivre français.' },
  { ordre: 3, type: 'hotel', ville: 'Paris', lat: 48.8668, lng: 2.3286, nom: 'Le Bristol Paris', etoiles: 5, ambiance: ['Élégant', 'Classique'], description: 'Référence parisienne, service irréprochable et hospitalité premium.' },

  { ordre: 4, type: 'hotel', ville: 'Lyon', lat: 45.7640, lng: 4.8270, nom: 'Villa Florentine', etoiles: 5, ambiance: ['Panoramique', 'Romantique'], description: 'Adresse de charme sur les hauteurs du Vieux Lyon.' },
  { ordre: 5, type: 'hotel', ville: 'Lyon', lat: 45.7665, lng: 4.8502, nom: 'InterContinental Lyon - Hotel Dieu', etoiles: 5, ambiance: ['Patrimonial', 'Urbain'], description: 'Bâtiment historique emblématique au confort contemporain.' },
  { ordre: 6, type: 'hotel', ville: 'Lyon', lat: 45.7706, lng: 4.8360, nom: 'Cour des Loges', etoiles: 5, ambiance: ['Historique', 'Intimiste'], description: 'Charme Renaissance et ambiance feutrée au cœur de la ville.' },

  { ordre: 7, type: 'hotel', ville: 'Rennes', lat: 48.1110, lng: -1.6769, nom: 'Balthazar Hotel & Spa', etoiles: 5, ambiance: ['Spa', 'Élégant'], description: 'Hôtel de prestige au centre de Rennes, ambiance feutrée.' },
  { ordre: 8, type: 'hotel', ville: 'Rennes', lat: 48.1093, lng: -1.6788, nom: 'Le Saint-Antoine Hotel & Spa', etoiles: 4, ambiance: ['Design', 'Bien-être'], description: 'Adresse contemporaine avec spa, idéale pour un séjour gastronomique.' },
  { ordre: 9, type: 'hotel', ville: 'Rennes', lat: 48.1160, lng: -1.6800, nom: 'Mama Shelter Rennes', etoiles: 4, ambiance: ['Urbain', 'Lifestyle'], description: 'Hôtel moderne et vivant, confort premium au cœur de la ville.' },
]

const startCity = ref<(typeof cities)[number] | ''>('')
const endCity = ref<(typeof cities)[number] | ''>('')
const showMap = ref(false)

const selectedRestaurantsForRoute = computed(() => {
  if (!startCity.value || !endCity.value || startCity.value === endCity.value) {
    return [] as EtapeRoadtrip[]
  }

  const startCityRestaurants = restaurants
    .filter(r => r.ville === startCity.value)
    .sort((a, b) => b.etoiles - a.etoiles)

  const endCityRestaurants = restaurants
    .filter(r => r.ville === endCity.value)
    .sort((a, b) => b.etoiles - a.etoiles)

  return [...startCityRestaurants, ...endCityRestaurants]
})

const selectedRouteEtapes = computed<EtapeRoadtrip[]>(() => {
  return selectedRestaurantsForRoute.value.map((item, index) => ({
    ...item,
    ordre: index + 1,
  }))
})

const selectedItems = selectedRouteEtapes

const toggleSelection = (item: EtapeRoadtrip) => {
  const index = selectedItems.value.findIndex(
    sel => sel.nom === item.nom && sel.type === item.type
  )
  if (index > -1) {
    selectedItems.value.splice(index, 1)
  } else {
    selectedItems.value.push(item)
  }
  // Ouvre automatiquement la carte dès qu'un trajet complet
  // (départ + arrivée) est sélectionné.
  showMap.value = selectedItems.value.length >= 2
}

const isSelected = (item: EtapeRoadtrip) => {
  return selectedItems.value.some(sel => sel.nom === item.nom && sel.type === item.type)
}

const canViewMap = computed(() => {
  return !!startCity.value && !!endCity.value && startCity.value !== endCity.value
})

const viewMap = () => {
  if (canViewMap.value) {
    showMap.value = true
  }
}

const groupedRestaurantsByVille = computed(() => {
  return cities.map((ville) => ({
    ville,
    items: restaurants.filter(r => r.ville === ville),
  }))
})

const groupedHotelsByVille = computed(() => {
  return cities.map((ville) => ({
    ville,
    items: hotels.filter(h => h.ville === ville),
  }))
})
</script>

<template>
  <div class="custom-select-container">
    <div class="custom-header">
      <NuxtLink to="/aventure" class="back-button">
        ← Retour aux aventures
      </NuxtLink>
      <h1 class="title">Créez Votre Voyage Gastronomique</h1>
      <p class="subtitle">Sélectionnez les restaurants et hôtels qui vous tentent</p>
    </div>

    <!-- Selection Panel -->
    <div v-if="!showMap" class="selection-view">
      <div class="sidebar">
        <div class="selection-info">
          <h3 class="info-title">Votre Trajet</h3>
          <p class="info-count">Choisissez votre ville de départ et d'arrivée</p>

          <div class="city-selectors">
            <label class="selector-label" for="startCity">Ville de départ</label>
            <select id="startCity" v-model="startCity" class="city-select">
              <option value="">Choisir une ville</option>
              <option v-for="ville in cities" :key="`start-${ville}`" :value="ville">{{ ville }}</option>
            </select>

            <label class="selector-label" for="endCity">Ville d'arrivée</label>
            <select id="endCity" v-model="endCity" class="city-select">
              <option value="">Choisir une ville</option>
              <option v-for="ville in cities" :key="`end-${ville}`" :value="ville">{{ ville }}</option>
            </select>
          </div>

          <div v-if="canViewMap" class="selected-list">
            <div class="selected-item">
              <span class="selected-index">✓</span>
              <div class="selected-info">
                <p class="selected-name">{{ startCity }} → {{ endCity }}</p>
                <p class="selected-location">{{ selectedRouteEtapes.length }} restaurants affichés sur la carte</p>
              </div>
            </div>
          </div>

          <button
            @click="viewMap"
            class="view-map-button"
            :disabled="!canViewMap"
          >
            {{ !canViewMap ? 'Choisissez 2 villes différentes' : 'Voir la carte des restaurants' }}
          </button>
        </div>
      </div>

      <!-- Items Grid -->
      <div class="items-view">
        <h2 class="group-title">Restaurants etoiles & gastronomiques</h2>
        <div v-for="group in groupedRestaurantsByVille" :key="`restaurant-${group.ville}`" class="ville-section">
          <h3 class="ville-title">{{ group.ville }}</h3>
          <div class="items-grid">
            <div
              v-for="item in group.items"
              :key="`restaurant-${item.nom}`"
              :class="['item-card', { selected: isSelected(item) }]"
            >
              <div class="item-header">
                <span class="item-type">🍽️</span>
                <span class="item-rating">
                  <StarRating :count="item.etoiles" :use-logo="true" />
                </span>
              </div>

              <h3 class="item-name">{{ item.nom }}</h3>
              <p v-if="item.cuisine" class="item-cuisine">{{ item.cuisine }}</p>
              <p class="item-description">{{ item.description }}</p>

              <div class="item-footer">
                <span class="item-badge">Restaurant</span>
                <span v-if="isSelected(item)" class="item-check">✓ Sur l'itinéraire</span>
              </div>
            </div>
          </div>
        </div>

        <h2 class="group-title">Hotels</h2>
        <div v-for="group in groupedHotelsByVille" :key="`hotel-${group.ville}`" class="ville-section">
          <h3 class="ville-title">{{ group.ville }}</h3>
          <div class="items-grid">
            <div
              v-for="item in group.items"
              :key="`hotel-${item.nom}`"
              :class="['item-card']"
            >
              <div class="item-header">
                <span class="item-type">🏨</span>
                <span class="item-rating">{{ '★'.repeat(item.etoiles) }}</span>
              </div>

              <h3 class="item-name">{{ item.nom }}</h3>
              <p class="item-description">{{ item.description }}</p>

              <div class="item-footer">
                <span class="item-badge">Hôtel</span>
                <span class="item-check">Hors itinéraire map</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Map View -->
    <div v-else class="map-view">
      <button @click="showMap = false" class="back-to-list">
        ← Retour à la sélection
      </button>
      <RoadtripTripMap :etapes="selectedRouteEtapes" />
    </div>
  </div>
</template>

<style scoped>
.custom-select-container {
  --color-black: #ffffff;
  --color-cream: #0a0a08;
  --color-gold: #111111;
  min-height: 100vh;
  background-color: var(--color-black);
  color: var(--color-cream);
  padding: 2rem;
}

.custom-header {
  max-width: 1400px;
  margin: 0 auto 3rem;
}

.back-button {
  display: inline-block;
  color: var(--color-gold);
  text-decoration: none;
  font-family: var(--font-sans);
  font-size: 0.875rem;
  margin-bottom: 1rem;
  transition: color 0.3s ease;
}

.back-button:hover {
  color: var(--color-red);
}

.title {
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5vw, 2.75rem);
  font-weight: 300;
  color: #000000;
  margin: 0 0 0.5rem 0;
}

.subtitle {
  font-family: var(--font-sans);
  font-size: 1.05rem;
  color: var(--color-gold);
  margin: 0;
}

/* Selection View */
.selection-view {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.sidebar {
  position: sticky;
  top: 2rem;
  height: fit-content;
}

.selection-info {
  background: linear-gradient(135deg, rgba(200, 16, 46, 0.12) 0%, rgba(200, 16, 46, 0.04) 100%);
  border: 2px solid rgba(200, 16, 46, 0.35);
  border-radius: 8px;
  padding: 1.5rem;
}

.info-title {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  margin: 0 0 0.5rem 0;
  color: #000;
}

.info-count {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  color: var(--color-gold);
  margin: 0 0 1rem 0;
}

.city-selectors {
  display: grid;
  gap: 0.65rem;
  margin-bottom: 1rem;
}

.selector-label {
  font-family: var(--font-sans);
  font-size: 0.8rem;
  font-weight: 600;
  color: #000000;
}

.city-select {
  width: 100%;
  border: 1px solid rgba(200, 16, 46, 0.35);
  border-radius: 6px;
  padding: 0.55rem 0.7rem;
  font-family: var(--font-sans);
  font-size: 0.9rem;
  background: #ffffff;
  color: #111111;
}

.selected-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
  max-height: 400px;
  overflow-y: auto;
}

.selected-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: rgba(200, 16, 46, 0.15);
  padding: 0.75rem;
  border-radius: 6px;
  border-left: 3px solid var(--color-red);
}

.selected-index {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  background-color: var(--color-red);
  color: var(--color-cream);
  border-radius: 50%;
  font-weight: 600;
  font-size: 0.875rem;
}

.selected-info {
  flex: 1;
  min-width: 0;
}

.selected-name {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0;
  color: #000000;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.selected-location {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  color: var(--color-gold);
  margin: 0.25rem 0 0 0;
}

.remove-btn {
  background: none;
  border: none;
  color: var(--color-gray);
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
  transition: color 0.2s ease;
}

.remove-btn:hover {
  color: var(--color-red);
}

.empty-selection {
  text-align: center;
  padding: 1rem;
  color: var(--color-gray);
  font-style: italic;
}

.view-map-button {
  width: 100%;
  padding: 0.875rem;
  background-color: rgba(200, 16, 46, 0.2);
  color: var(--color-red);
  border: 2px solid rgba(200, 16, 46, 0.35);
  border-radius: 8px;
  font-family: var(--font-sans);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-map-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.view-map-button:hover {
  background-color: rgba(200, 16, 46, 0.28);
  border-color: var(--color-red);
  transform: translateY(-2px);
}

/* Items View */
.items-view {
  flex: 1;
}

.group-title {
  font-family: var(--font-serif);
  font-size: 2rem;
  font-weight: 300;
  margin: 0 0 1.25rem 0;
  color: #000000;
}

.ville-section {
  margin-bottom: 3rem;
}

.ville-title {
  font-family: var(--font-serif);
  font-size: 1.75rem;
  font-weight: 300;
  margin: 0 0 1.5rem 0;
  color: #000000;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid rgba(200, 16, 46, 0.2);
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.item-card {
  background: linear-gradient(135deg, rgba(184, 151, 90, 0.1) 0%, rgba(200, 16, 46, 0.05) 100%);
  border: 1px solid rgba(200, 16, 46, 0.3);
  border-radius: 8px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.item-card:hover {
  border-color: var(--color-red);
  transform: translateY(-4px);
  box-shadow: 0 10px 40px rgba(200, 16, 46, 0.2);
}

.item-card.selected {
  background: linear-gradient(135deg, rgba(200, 16, 46, 0.2) 0%, rgba(200, 16, 46, 0.1) 100%);
  border-color: var(--color-red);
  box-shadow: 0 8px 30px rgba(200, 16, 46, 0.25);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.item-type {
  font-size: 1.5rem;
}

.item-rating {
  color: var(--color-red);
  font-weight: 600;
  letter-spacing: 0.1rem;
}

.item-name {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  font-weight: 400;
  margin: 0 0 0.5rem 0;
  color: #000000;
}

.item-cuisine {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  color: var(--color-gold);
  margin: 0 0 0.75rem 0;
  font-style: italic;
}

.item-description {
  font-family: var(--font-sans);
  font-size: 1rem;
  color: var(--color-gray);
  margin: 0;
  line-height: 1.6;
  flex: 1;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(200, 16, 46, 0.2);
}

.item-badge {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 600;
  background-color: rgba(200, 16, 46, 0.3);
  padding: 0.25rem 0.65rem;
  border-radius: 4px;
  color: var(--color-red);
}

.item-check {
  color: var(--color-red);
  font-weight: 600;
  font-size: 0.875rem;
}

/* Map View */
.map-view {
  max-width: 1200px;
  margin: 0 auto;
}

.back-to-list {
  display: inline-block;
  color: var(--color-gold);
  background: none;
  border: none;
  font-family: var(--font-sans);
  font-size: 0.875rem;
  cursor: pointer;
  margin-bottom: 2rem;
  transition: color 0.3s ease;
}

.back-to-list:hover {
  color: var(--color-red);
}

@media (max-width: 1024px) {
  .selection-view {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
  }
}

@media (max-width: 768px) {
  .custom-select-container {
    padding: 1rem;
  }

  .custom-header {
    margin-bottom: 2rem;
  }

  .title {
    font-size: 1.75rem;
  }

  .items-grid {
    grid-template-columns: 1fr;
  }

  .selection-info {
    margin-bottom: 2rem;
  }
}
</style>

