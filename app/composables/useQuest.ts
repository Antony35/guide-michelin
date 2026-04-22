import type { Quest } from '~/types'
import questsData from '~/data/quests.json'

export const useQuest = () => {
  const quests: Ref<Quest[]> = ref(questsData as Quest[])

  const getQuestById = (id: number): Quest | undefined => {
    return quests.value.find(rt => rt.id === id)
  }

  const getAllQuests = (): Quest[] => {
    return quests.value
  }

  return {
    quests,
    getQuestById,
    getAllQuests,
  }
}

