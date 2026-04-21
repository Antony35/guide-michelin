export interface Restaurant {
  id?: string
  nom: string
  chef?: string
  etoiles: 1 | 2 | 3
  ville: string
  arrondissement?: string
  adresse?: string
  cuisine: string
  ambiance?: string[]
  budget?: 'moyen' | 'haut' | 'tres-haut'
  description: string
  signature?: string
  lat?: number
  lng?: number
}

export interface Hotel {
  id?: string
  nom: string
  ville: string
  region?: string
  etoiles: 4 | 5
  ambiance: string[]
  description: string
  highlight?: string
  lat?: number
  lng?: number
}

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

