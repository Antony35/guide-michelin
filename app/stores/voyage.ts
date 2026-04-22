import { defineStore } from 'pinia'
import type { City, Restaurant, Hotel, JourVoyage, StarLevel } from '~/types'

function uid(): string {
  return Math.random().toString(36).slice(2, 9)
}

function todayISO(): string {
  return new Date().toISOString().split('T')[0] ?? ''
}

function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0] ?? ''
}

export const useVoyageStore = defineStore('voyage', {
  state: () => ({
    jours: [] as JourVoyage[],
    selectedItem: null as Restaurant | Hotel | null,
    selectedItemType: null as 'restaurant' | 'hotel' | null,
    activeJourId: null as string | null,
    restaurantStarFilters: [] as StarLevel[],
    hotelStarFilters: [] as string[],
  }),

  getters: {
    depart(state): City | null {
      return state.jours[0]?.city ?? null
    },
    arrivee(state): City | null {
      return state.jours.length > 1 ? state.jours[state.jours.length - 1]?.city ?? null : null
    },
    etapes(state): City[] {
      return state.jours.slice(1, -1).map(j => j.city)
    },
    etapesJours(state): JourVoyage[] {
      return state.jours.slice(1, -1)
    },
    allCities(state): City[] {
      return state.jours.map(j => j.city)
    },
    allCityNames(state): string[] {
      return state.jours.map(j => j.city.city)
    },
    activeJour(state): JourVoyage | null {
      return state.jours.find(j => j.id === state.activeJourId) ?? null
    },
    selectedRestaurant(state): Restaurant | null {
      return state.selectedItemType === 'restaurant' ? state.selectedItem as Restaurant : null
    },
    selectedHotel(state): Hotel | null {
      return state.selectedItemType === 'hotel' ? state.selectedItem as Hotel : null
    },
    restaurantFilterActive(state): boolean {
      return state.restaurantStarFilters.length > 0
    },
    hotelFilterActive(state): boolean {
      return state.hotelStarFilters.length > 0
    },
  },

  actions: {
    initVoyage(depart: City, arrivee: City, dateDepart?: string, dateArrivee?: string) {
      const startDate = dateDepart ?? todayISO()
      const endDate   = dateArrivee ?? addDays(startDate, 1)
      this.jours = [
        { id: uid(), date: startDate, city: depart, hotel: null, restaurants: [] },
        { id: uid(), date: endDate,   city: arrivee, hotel: null, restaurants: [] },
      ]
      this.selectedItem          = null
      this.selectedItemType      = null
      this.activeJourId          = this.jours[0]!.id
      this.restaurantStarFilters = []
      this.hotelStarFilters      = []
    },

    addEtape(city: City, date?: string) {
      if (this.jours.length < 2) return
      if (this.jours.some(j => j.city.city === city.city)) return
      const last = this.jours[this.jours.length - 1]
      if (!last) return
      const newJour: JourVoyage = {
        id: uid(),
        date: date ?? addDays(last.date, -1),
        city,
        hotel: null,
        restaurants: [],
      }
      this.jours.splice(this.jours.length - 1, 0, newJour)
    },

    removeJour(id: string) {
      const idx = this.jours.findIndex(j => j.id === id)
      if (idx <= 0 || idx >= this.jours.length - 1) return
      this.jours.splice(idx, 1)
    },

    setDate(jourId: string, date: string) {
      const jour = this.jours.find(j => j.id === jourId)
      if (jour) jour.date = date
    },

    setHotel(jourId: string, hotel: Hotel) {
      const jour = this.jours.find(j => j.id === jourId)
      if (!jour) return
      jour.hotel = jour.hotel?.id === hotel.id ? null : hotel
    },

    addRestaurant(jourId: string, restaurant: Restaurant) {
      const jour = this.jours.find(j => j.id === jourId)
      if (!jour || jour.restaurants.length >= 3) return
      if (!jour.restaurants.find(r => r.id === restaurant.id)) {
        jour.restaurants.push(restaurant)
      }
    },

    removeRestaurant(jourId: string, restaurantId: number) {
      const jour = this.jours.find(j => j.id === jourId)
      if (jour) jour.restaurants = jour.restaurants.filter(r => r.id !== restaurantId)
    },

    setSelectedItem(item: Restaurant | Hotel | null, type: 'restaurant' | 'hotel' | null = null) {
      if (!item) {
        this.selectedItem     = null
        this.selectedItemType = null
        return
      }
      if (this.selectedItem?.id === item.id && this.selectedItemType === type) {
        this.selectedItem     = null
        this.selectedItemType = null
        return
      }
      this.selectedItem     = item
      this.selectedItemType = type
      const itemCity = item.city
      const jour = this.jours.find(j => j.city.city.toLowerCase() === itemCity.toLowerCase())
      if (jour) this.activeJourId = jour.id
    },

    toggleRestaurantStar(star: StarLevel) {
      const idx = this.restaurantStarFilters.indexOf(star)
      idx >= 0
        ? this.restaurantStarFilters.splice(idx, 1)
        : this.restaurantStarFilters.push(star)
    },

    toggleHotelStar(star: string) {
      const idx = this.hotelStarFilters.indexOf(star)
      idx >= 0
        ? this.hotelStarFilters.splice(idx, 1)
        : this.hotelStarFilters.push(star)
    },

    reset() {
      this.jours                 = []
      this.selectedItem          = null
      this.selectedItemType      = null
      this.activeJourId          = null
      this.restaurantStarFilters = []
      this.hotelStarFilters      = []
    },
  },
})
