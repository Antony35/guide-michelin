// ─── Types JSON (custom trip builder) ───────────────────────────────────────

export interface City {
  city: string
  lat: number
  lng: number
}

export type StarLevel = 'none' | 'bib' | 'one' | 'two' | 'three'
export type MealTime = 'midi' | 'soir'

export interface RestaurantWithTime {
  restaurant: Restaurant
  mealTime: MealTime
}

export interface Restaurant {
  id: number
  citySlug: string
  name: string
  city: string
  lat: number
  lng: number
  stars: StarLevel
  style: string
  description: string
  adresse?: string
  price?: string
  visited?: boolean
}

export interface Hotel {
  id: number
  citySlug: string
  name: string
  city: string
  lat: number
  lng: number
  stars: string
  style: string
  description: string
  adresse?: string
  price?: string
  visited?: boolean
}

export interface JourVoyage {
  id: string
  date: string
  city: City
  hotel: Hotel | null
  restaurants: RestaurantWithTime[]
}

// ─── Types prédéfinis (voyages prédéfinis — non modifiés) ────────────────────

export interface EtapeRoadtrip {
  ordre: number
  type: 'restaurant' | 'hotel'
  ville: string
  lat: number
  lng: number
  nom: string
  etoiles: number
  cuisine?: string
  ambiance?: string[]
  description: string
}

export interface Roadtrip {
  id: string
  titre: string
  description: string
  duree: string
  etapes: EtapeRoadtrip[]
}

export interface Quest {
  "id": number
  "name": string
  "description": string
  "score": number
  "objectif": number
  "reward": number | string
  "tags": string[]
}

export interface BadgeTheme {
  "id": number
  "theme": string
  "name": string
  "badges": Badge[]
}

export interface Badge {
  "id": number
  "name": string
  "obtenus": boolean
}
