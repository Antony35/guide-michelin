import type { Roadtrip } from '~/types'
import roadtripsData from '~/data/roadtrips.json'

export const useRoadtrip = () => {
  const roadtrips: Ref<Roadtrip[]> = ref(roadtripsData as Roadtrip[])

  const getRoadtripById = (id: string): Roadtrip | undefined => {
    return roadtrips.value.find(rt => rt.id === id)
  }

  const getAllRoadtrips = (): Roadtrip[] => {
    return roadtrips.value
  }

  return {
    roadtrips,
    getRoadtripById,
    getAllRoadtrips,
  }
}

