import type { City, Restaurant, Hotel } from '~/types'
import citiesData from '~/data/cities.json'
import restaurantsData from '~/data/restaurants.json'
import hotelsData from '~/data/hotels.json'

export const CITIES = citiesData as City[]
export const ALL_RESTAURANTS = restaurantsData as Restaurant[]
export const ALL_HOTELS = hotelsData as Hotel[]

export function useVoyageData() {
  function getCity(cityName: string): City | null {
    return CITIES.find(c => c.city.toLowerCase() === cityName.toLowerCase()) ?? null
  }

  function getRestaurantsForCity(cityName: string): Restaurant[] {
    return ALL_RESTAURANTS.filter(r => r.city.toLowerCase() === cityName.toLowerCase())
  }

  function getHotelsForCity(cityName: string): Hotel[] {
    return ALL_HOTELS.filter(h => h.city.toLowerCase() === cityName.toLowerCase())
  }

  function getItemsForCities(cityNames: string[]): { restaurants: Restaurant[], hotels: Hotel[] } {
    const lower = cityNames.map(n => n.toLowerCase())
    return {
      restaurants: ALL_RESTAURANTS.filter(r => lower.includes(r.city.toLowerCase())),
      hotels: ALL_HOTELS.filter(h => lower.includes(h.city.toLowerCase())),
    }
  }

  function getAllItems(): { restaurants: Restaurant[], hotels: Hotel[] } {
    return {
      restaurants: ALL_RESTAURANTS,
      hotels: ALL_HOTELS,
    }
  }

  function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371 // km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  function getDistanceToSegment(pLat: number, pLng: number, sLat: number, sLng: number, eLat: number, eLng: number): number {
    const dStart = getDistance(pLat, pLng, sLat, sLng)
    const dEnd = getDistance(pLat, pLng, eLat, eLng)
    
    const dx = eLng - sLng
    const dy = eLat - sLat
    if (dx === 0 && dy === 0) return dStart

    const t = ((pLng - sLng) * dx + (pLat - sLat) * dy) / (dx * dx + dy * dy)
    
    if (t < 0) return dStart
    if (t > 1) return dEnd

    return getDistance(pLat, pLng, sLat + t * dy, sLng + t * dx)
  }

  function getCitiesNearRoute(route: City[], thresholdKm: number = 50): City[] {
    if (!route || !Array.isArray(route) || route.length < 2) return route || []
    
    // Filter to ensure we only work with valid cities having coordinates
    const validRoute = route.filter(r => r && typeof r.lat === 'number' && typeof r.lng === 'number')
    if (validRoute.length < 2) return validRoute
    
    return CITIES.filter(city => {
      if (typeof city.lat !== 'number' || typeof city.lng !== 'number') return false
      
      if (validRoute.some(r => r.city === city.city)) return true

      for (let i = 0; i < validRoute.length - 1; i++) {
        const p1 = validRoute[i]
        const p2 = validRoute[i+1]
        if (!p1 || !p2) continue
        const dist = getDistanceToSegment(city.lat, city.lng, p1.lat, p1.lng, p2.lat, p2.lng)
        if (dist <= thresholdKm) return true
      }
      return false
    })
  }

  return { getCity, getRestaurantsForCity, getHotelsForCity, getItemsForCities, getAllItems, getCitiesNearRoute }
}
