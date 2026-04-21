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

  return { getCity, getRestaurantsForCity, getHotelsForCity, getItemsForCities }
}
