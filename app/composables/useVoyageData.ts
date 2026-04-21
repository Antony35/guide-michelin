import type { EtapeRoadtrip, Ville } from '~/types'

export const VILLES_COORDS: Record<string, [number, number]> = {
  Paris: [48.8566, 2.3522],
  Lyon: [45.7640, 4.8357],
  Rennes: [48.1119, -1.6807],
}

export const VILLES_DISPONIBLES: Ville[] = Object.entries(VILLES_COORDS).map(([nom, [lat, lng]]) => ({
  nom,
  lat,
  lng,
}))

const restaurants: EtapeRoadtrip[] = [
  { ordre: 1, type: 'restaurant', ville: 'Paris', lat: 48.8709, lng: 2.3030, nom: 'Le Cinq', etoiles: 3, cuisine: 'Française contemporaine', description: 'Institution parisienne à la cuisine précise et raffinée.' },
  { ordre: 2, type: 'restaurant', ville: 'Paris', lat: 48.8656, lng: 2.3294, nom: 'Epicure', etoiles: 3, cuisine: 'Haute gastronomie française', description: 'Adresse de prestige aux produits d\'exception et sauces magistrales.' },
  { ordre: 3, type: 'restaurant', ville: 'Paris', lat: 48.8778, lng: 2.3190, nom: 'Guy Savoy', etoiles: 2, cuisine: 'Française', description: 'Cuisine emblématique, service d\'excellence et expérience mémorable.' },
  { ordre: 4, type: 'restaurant', ville: 'Paris', lat: 48.8725, lng: 2.3007, nom: 'Le Jules Verne', etoiles: 2, cuisine: 'Française moderne', description: 'Table gastronomique avec vue spectaculaire sur Paris.' },

  { ordre: 5, type: 'restaurant', ville: 'Lyon', lat: 45.7677, lng: 4.8331, nom: 'Paul Bocuse', etoiles: 2, cuisine: 'Gastronomie lyonnaise', description: 'Maison iconique de la tradition culinaire lyonnaise.' },
  { ordre: 6, type: 'restaurant', ville: 'Lyon', lat: 45.7590, lng: 4.8266, nom: 'La Mère Brazier', etoiles: 2, cuisine: 'Française classique', description: 'Grande maison lyonnaise au patrimoine culinaire exceptionnel.' },
  { ordre: 7, type: 'restaurant', ville: 'Lyon', lat: 45.7580, lng: 4.8216, nom: 'Takao Takano', etoiles: 2, cuisine: 'Franco-japonaise', description: 'Cuisine d\'auteur subtile, moderne et très technique.' },
  { ordre: 8, type: 'restaurant', ville: 'Lyon', lat: 45.7648, lng: 4.8353, nom: 'Le Neuvième Art', etoiles: 2, cuisine: 'Créative', description: 'Assiettes graphiques et créativité gastronomique affirmée.' },

  { ordre: 9, type: 'restaurant', ville: 'Rennes', lat: 48.1118, lng: -1.6803, nom: 'Racines', etoiles: 1, cuisine: 'Française contemporaine', description: 'Table rennaise raffinée, produits bretons et assiettes précises.' },
  { ordre: 10, type: 'restaurant', ville: 'Rennes', lat: 48.1124, lng: -1.6791, nom: 'Ima', etoiles: 1, cuisine: 'Créative', description: 'Cuisine inventive, dressages modernes et belle lecture des saisons.' },
  { ordre: 11, type: 'restaurant', ville: 'Rennes', lat: 48.1099, lng: -1.6781, nom: 'Le Ciel de Rennes', etoiles: 1, cuisine: 'Gastronomique française', description: 'Expérience gastronomique élégante avec forte identité locale.' },
  { ordre: 12, type: 'restaurant', ville: 'Rennes', lat: 48.1141, lng: -1.6727, nom: 'Maison Kervarrec', etoiles: 2, cuisine: 'Bretonne contemporaine', description: 'Cuisine d\'auteur en Bretagne, précise et profondément territoriale.' },
]

const hotels: EtapeRoadtrip[] = [
  { ordre: 1, type: 'hotel', ville: 'Paris', lat: 48.8683, lng: 2.3000, nom: 'Four Seasons George V', etoiles: 5, ambiance: ['Luxe', 'Palace'], description: 'Palace parisien avec offre gastronomique de très haut niveau.' },
  { ordre: 2, type: 'hotel', ville: 'Paris', lat: 48.8753, lng: 2.2945, nom: 'Shangri-La Paris', etoiles: 5, ambiance: ['Vue', 'Prestige'], description: 'Hôtel d\'exception alliant raffinement asiatique et art de vivre français.' },
  { ordre: 3, type: 'hotel', ville: 'Paris', lat: 48.8668, lng: 2.3286, nom: 'Le Bristol Paris', etoiles: 5, ambiance: ['Élégant', 'Classique'], description: 'Référence parisienne, service irréprochable et hospitalité premium.' },

  { ordre: 4, type: 'hotel', ville: 'Lyon', lat: 45.7640, lng: 4.8270, nom: 'Villa Florentine', etoiles: 5, ambiance: ['Panoramique', 'Romantique'], description: 'Adresse de charme sur les hauteurs du Vieux Lyon.' },
  { ordre: 5, type: 'hotel', ville: 'Lyon', lat: 45.7665, lng: 4.8502, nom: 'InterContinental Lyon', etoiles: 5, ambiance: ['Patrimonial', 'Urbain'], description: 'Bâtiment historique emblématique au confort contemporain.' },
  { ordre: 6, type: 'hotel', ville: 'Lyon', lat: 45.7706, lng: 4.8360, nom: 'Cour des Loges', etoiles: 5, ambiance: ['Historique', 'Intimiste'], description: 'Charme Renaissance et ambiance feutrée au cœur de la ville.' },

  { ordre: 7, type: 'hotel', ville: 'Rennes', lat: 48.1110, lng: -1.6769, nom: 'Balthazar Hotel & Spa', etoiles: 5, ambiance: ['Spa', 'Élégant'], description: 'Hôtel de prestige au centre de Rennes, ambiance feutrée.' },
  { ordre: 8, type: 'hotel', ville: 'Rennes', lat: 48.1093, lng: -1.6788, nom: 'Le Saint-Antoine Hotel & Spa', etoiles: 4, ambiance: ['Design', 'Bien-être'], description: 'Adresse contemporaine avec spa, idéale pour un séjour gastronomique.' },
  { ordre: 9, type: 'hotel', ville: 'Rennes', lat: 48.1160, lng: -1.6800, nom: 'Mama Shelter Rennes', etoiles: 4, ambiance: ['Urbain', 'Lifestyle'], description: 'Hôtel moderne et vivant, confort premium au cœur de la ville.' },
]

export function useVoyageData() {
  function getRestaurantsForCity(ville: string): EtapeRoadtrip[] {
    return restaurants.filter(r => r.ville === ville)
  }

  function getHotelsForCity(ville: string): EtapeRoadtrip[] {
    return hotels.filter(h => h.ville === ville)
  }

  function getItemsForCities(villes: string[]): { restaurants: EtapeRoadtrip[], hotels: EtapeRoadtrip[] } {
    return {
      restaurants: restaurants.filter(r => villes.includes(r.ville)),
      hotels: hotels.filter(h => villes.includes(h.ville)),
    }
  }

  function getVilleCoords(nom: string): Ville | null {
    const coords = VILLES_COORDS[nom]
    if (!coords) return null
    return { nom, lat: coords[0], lng: coords[1] }
  }

  return {
    getRestaurantsForCity,
    getHotelsForCity,
    getItemsForCities,
    getVilleCoords,
  }
}
