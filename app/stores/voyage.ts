import { defineStore } from 'pinia'
import type { EtapeRoadtrip, Ville } from '~/types'

export const useVoyageStore = defineStore('voyage', {
  state: () => ({
    depart: null as Ville | null,
    arrivee: null as Ville | null,
    etapes: [] as Ville[],
    selectedRestaurant: null as EtapeRoadtrip | null,
    selectedHotel: null as EtapeRoadtrip | null,
  }),

  getters: {
    allVilles(state): Ville[] {
      const villes: Ville[] = []
      if (state.depart) villes.push(state.depart)
      villes.push(...state.etapes)
      if (state.arrivee) villes.push(state.arrivee)
      return villes
    },
    allVilleNames(state): string[] {
      const names: string[] = []
      if (state.depart) names.push(state.depart.nom)
      state.etapes.forEach(e => names.push(e.nom))
      if (state.arrivee) names.push(state.arrivee.nom)
      return names
    },
  },

  actions: {
    setDepart(ville: Ville) {
      this.depart = ville
    },
    setArrivee(ville: Ville) {
      this.arrivee = ville
    },
    addEtape(ville: Ville) {
      if (!this.etapes.find(e => e.nom === ville.nom)) {
        this.etapes.push(ville)
      }
    },
    removeEtape(nom: string) {
      this.etapes = this.etapes.filter(e => e.nom !== nom)
    },
    selectRestaurant(item: EtapeRoadtrip) {
      this.selectedRestaurant = this.selectedRestaurant?.nom === item.nom ? null : item
    },
    selectHotel(item: EtapeRoadtrip) {
      this.selectedHotel = this.selectedHotel?.nom === item.nom ? null : item
    },
    reset() {
      this.depart = null
      this.arrivee = null
      this.etapes = []
      this.selectedRestaurant = null
      this.selectedHotel = null
    },
  },
})
