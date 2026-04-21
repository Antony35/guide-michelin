<script setup lang="ts">
import { computed, ref } from 'vue'
import type { EtapeRoadtrip } from '../../../types'

// Données de restaurants et hôtels disponibles
const restaurants: EtapeRoadtrip[] = [
  {
    ordre: 1,
    type: 'restaurant',
    ville: 'Paris',
    lat: 48.8566,
    lng: 2.3522,
    nom: 'L\'Astrance',
    etoiles: 3,
    cuisine: 'Française contemporaine',
    description: 'Une cuisine innovante et raffinée au cœur de Paris',
  },
  {
    ordre: 2,
    type: 'restaurant',
    ville: 'Lyon',
    lat: 45.7640,
    lng: 4.8357,
    nom: 'Paul Bocuse',
    etoiles: 3,
    cuisine: 'Gastronomie lyonnaise',
    description: 'Légende vivante de la gastronomie française',
  },
  {
    ordre: 3,
    type: 'restaurant',
    ville: 'Avignon',
    lat: 43.9462,
    lng: 4.8084,
    nom: 'Le Mille-feuille',
    etoiles: 2,
    cuisine: 'Méditerranéenne',
    description: 'Cuisine de Provence avec influences méditerranéennes',
  },
  {
    ordre: 4,
    type: 'restaurant',
    ville: 'Cannes',
    lat: 43.5528,
    lng: 7.0174,
    nom: 'Le Goût de l\'Instant',
    etoiles: 2,
    cuisine: 'Méditerranéenne',
    description: 'Vue sur la mer et saveurs côtières',
  },
  {
    ordre: 5,
    type: 'restaurant',
    ville: 'Strasbourg',
    lat: 48.5734,
    lng: 7.7521,
    nom: 'Maison Kammerzell',
    etoiles: 1,
    cuisine: 'Alsacienne',
    description: 'Tradition alsacienne authentique',
  },
  {
    ordre: 6,
    type: 'restaurant',
    ville: 'Bordeaux',
    lat: 44.8378,
    lng: -0.5792,
    nom: 'Le Chai des Saveurs',
    etoiles: 2,
    cuisine: 'Terroir & vins',
    description: 'Accords mets-vins précis, produits du Sud-Ouest et saisonnalité.',
  },
  {
    ordre: 7,
    type: 'restaurant',
    ville: 'Marseille',
    lat: 43.2965,
    lng: 5.3698,
    nom: 'La Table du Vieux-Port',
    etoiles: 1,
    cuisine: 'Poissons & bouillabaisse',
    description: 'Cuisine marine élégante, hommage aux classiques provençaux.',
  },
  {
    ordre: 8,
    type: 'restaurant',
    ville: 'Nice',
    lat: 43.7102,
    lng: 7.2620,
    nom: 'Riviera Botanique',
    etoiles: 1,
    cuisine: 'Méditerranéenne végétale',
    description: 'Assiettes lumineuses, herbes, agrumes et textures en finesse.',
  },
  {
    ordre: 9,
    type: 'restaurant',
    ville: 'Toulouse',
    lat: 43.6047,
    lng: 1.4442,
    nom: 'Le Cassoulet Moderne',
    etoiles: 1,
    cuisine: 'Sud-Ouest revisité',
    description: 'Classiques toulousains modernisés, cuisson lente et sauces profondes.',
  },
  {
    ordre: 10,
    type: 'restaurant',
    ville: 'Nantes',
    lat: 47.2184,
    lng: -1.5536,
    nom: 'L\'Estuaire',
    etoiles: 2,
    cuisine: 'Iodé & végétal',
    description: 'Produits atlantiques, légumes du maraîchage local et dressages épurés.',
  },
  {
    ordre: 11,
    type: 'restaurant',
    ville: 'Lille',
    lat: 50.6292,
    lng: 3.0573,
    nom: 'Flandres & Feu',
    etoiles: 1,
    cuisine: 'Flamande bistronomique',
    description: 'Générosité du Nord, sauces réduites, grillades et inspirations houblonnées.',
  },
  {
    ordre: 12,
    type: 'restaurant',
    ville: 'Reims',
    lat: 49.2583,
    lng: 4.0317,
    nom: 'La Bulle & le Sarrasin',
    etoiles: 1,
    cuisine: 'Champagne & cuisine de saison',
    description: 'Jeu de bulles, produits champenois et techniques contemporaines.',
  },
  {
    ordre: 13,
    type: 'restaurant',
    ville: 'Annecy',
    lat: 45.8992,
    lng: 6.1294,
    nom: 'Les Rives Alpines',
    etoiles: 2,
    cuisine: 'Alpine & lacustre',
    description: 'Omble, herbes de montagne, fromages affinés et bouillons clairs.',
  },
  {
    ordre: 14,
    type: 'restaurant',
    ville: 'Montpellier',
    lat: 43.6108,
    lng: 3.8767,
    nom: 'La Garrigue',
    etoiles: 1,
    cuisine: 'Occitane',
    description: 'Saveurs du Languedoc, huile d’olive, garrigue et cuissons au feu doux.',
  },
  {
    ordre: 15,
    type: 'restaurant',
    ville: 'Dijon',
    lat: 47.3220,
    lng: 5.0415,
    nom: 'Moutarde & Truffe',
    etoiles: 1,
    cuisine: 'Bourguignonne contemporaine',
    description: 'Clin d’œil bourguignon, sauces au vin, textures soignées et produits nobles.',
  },
]

const hotels: EtapeRoadtrip[] = [
  {
    ordre: 1,
    type: 'hotel',
    ville: 'Bourgogne',
    lat: 47.0896,
    lng: 4.7105,
    nom: 'Relais de Bourgogne',
    etoiles: 5,
    ambiance: ['Luxe', 'Calme'],
    description: 'Refuge gastronomique en Bourgogne',
  },
  {
    ordre: 2,
    type: 'hotel',
    ville: 'Saint-Rémy-de-Provence',
    lat: 43.7829,
    lng: 4.8250,
    nom: 'Château de Roussan',
    etoiles: 5,
    ambiance: ['Romantique', 'Nature'],
    description: 'Charme provençal dans un cadre authentique',
  },
  {
    ordre: 3,
    type: 'hotel',
    ville: 'Colmar',
    lat: 48.0795,
    lng: 7.3632,
    nom: 'Maison Rouge',
    etoiles: 4,
    ambiance: ['Charme', 'Historique'],
    description: 'Au cœur du patrimoine alsacien',
  },
]

const selectedItems = ref<EtapeRoadtrip[]>([])
const showMap = ref(false)

const selectedRouteEtapes = computed<EtapeRoadtrip[]>(() => {
  return selectedItems.value.map((item, index) => ({
    ...item,
    ordre: index + 1,
  }))
})

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

const allItems = computed(() => {
  return [...restaurants, ...hotels].sort((a, b) => {
    // Grouper par ville
    if (a.ville !== b.ville) return a.ville.localeCompare(b.ville)
    return a.type === 'restaurant' ? -1 : 1
  })
})

const viewMap = () => {
  if (selectedItems.value.length >= 2) {
    showMap.value = true
  }
}

const groupedByVille = computed(() => {
  const groups = new Map<string, EtapeRoadtrip[]>()
  allItems.value.forEach(item => {
    if (!groups.has(item.ville)) {
      groups.set(item.ville, [])
    }
    groups.get(item.ville)!.push(item)
  })
  return Array.from(groups.entries()).map(([ville, items]) => ({ ville, items }))
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
          <h3 class="info-title">Votre Sélection</h3>
          <p class="info-count">{{ selectedItems.length }} étape{{ selectedItems.length !== 1 ? 's' : '' }} sélectionnée{{ selectedItems.length !== 1 ? 's' : '' }}</p>

          <div v-if="selectedItems.length > 0" class="selected-list">
            <div v-for="(item, index) in selectedItems" :key="`selected-${index}`" class="selected-item">
              <span class="selected-index">{{ index + 1 }}</span>
              <div class="selected-info">
                <p class="selected-name">{{ item.nom }}</p>
                <p class="selected-location">{{ item.ville }}</p>
              </div>
              <button
                @click="toggleSelection(item)"
                class="remove-btn"
              >
                ✕
              </button>
            </div>
          </div>

          <div v-else class="empty-selection">
            <p>Aucune sélection pour le moment</p>
          </div>

          <button
            @click="viewMap"
            class="view-map-button"
            :disabled="selectedItems.length < 2"
          >
            {{ selectedItems.length < 2 ? 'Sélectionnez au moins 2 étapes' : 'Voir la carte du trajet' }}
          </button>
        </div>
      </div>

      <!-- Items Grid -->
      <div class="items-view">
        <div v-for="group in groupedByVille" :key="group.ville" class="ville-section">
          <h2 class="ville-title">{{ group.ville }}</h2>
          <div class="items-grid">
            <div
              v-for="item in group.items"
              :key="`${item.type}-${item.nom}`"
              @click="toggleSelection(item)"
              :class="['item-card', { selected: isSelected(item) }]"
            >
              <div class="item-header">
                <span class="item-type">{{ item.type === 'restaurant' ? '🍽️' : '🏨' }}</span>
                <span class="item-rating">
                  <StarRating :count="item.etoiles" :use-logo="item.type === 'restaurant'" />
                </span>
              </div>

              <h3 class="item-name">{{ item.nom }}</h3>
              <p v-if="item.cuisine" class="item-cuisine">{{ item.cuisine }}</p>
              <p class="item-description">{{ item.description }}</p>

              <div class="item-footer">
                <span class="item-badge">{{ item.type === 'restaurant' ? 'Restaurant' : 'Hôtel' }}</span>
                <span v-if="isSelected(item)" class="item-check">✓ Sélectionné</span>
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
  --color-cream: #ffffff;
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
  background: linear-gradient(135deg, rgba(184, 151, 90, 0.1) 0%, rgba(200, 16, 46, 0.05) 100%);
  border: 1px solid rgba(200, 16, 46, 0.3);
  border-radius: 8px;
  padding: 1.5rem;
}

.info-title {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  margin: 0 0 0.5rem 0;
}

.info-count {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  color: var(--color-gold);
  margin: 0 0 1rem 0;
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
  background-color: var(--color-red);
  color: var(--color-cream);
  border: none;
  border-radius: 6px;
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
  background-color: rgba(200, 16, 46, 0.8);
  transform: translateY(-2px);
}

/* Items View */
.items-view {
  flex: 1;
}

.ville-section {
  margin-bottom: 3rem;
}

.ville-title {
  font-family: var(--font-serif);
  font-size: 1.75rem;
  font-weight: 300;
  margin: 0 0 1.5rem 0;
  color: var(--color-cream);
  padding-bottom: 0.75rem;
  border-bottom: 2px solid rgba(200, 16, 46, 0.2);
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.item-card {
  background: linear-gradient(135deg, rgba(184, 151, 90, 0.08) 0%, rgba(200, 16, 46, 0.03) 100%);
  border: 2px solid rgba(200, 16, 46, 0.2);
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.item-card:hover {
  border-color: var(--color-gold);
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(184, 151, 90, 0.15);
}

.item-card.selected {
  background: linear-gradient(135deg, rgba(200, 16, 46, 0.2) 0%, rgba(184, 151, 90, 0.15) 100%);
  border-color: var(--color-red);
  box-shadow: 0 8px 30px rgba(200, 16, 46, 0.25);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
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
  font-size: 0.875rem;
  color: var(--color-gray);
  margin: 0 0 1rem 0;
  line-height: 1.5;
  flex: 1;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(200, 16, 46, 0.15);
}

.item-badge {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 600;
  color: var(--color-cream);
  background-color: rgba(200, 16, 46, 0.3);
  padding: 0.25rem 0.65rem;
  border-radius: 4px;
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

