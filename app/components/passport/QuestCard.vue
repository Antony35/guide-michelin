<script setup lang="ts">
import type {PropType} from "vue";
import globeIcon from '~/assets/globe.svg'
import forkKnifeIcon from '~/assets/fork-knife.svg'
import expIcon from '~/assets/exp-icon.svg'
import bibIcon from '~/assets/bib-gourmand.svg'

interface QuestItem {
  id: number
  name: string
  description: string
  score: number
  objectif: number
  reward: number | string
  tags?: string[]
}

defineProps({
  quests: {
    type: Array as PropType<QuestItem[]>,
    required: true,
    default: () => []
  }
})

function calculatePercentage(score: number, objectif: number) {
  if (objectif === 0) return 0;
  return (score / objectif) * 100;
}

function generateAsset(tag: string) {
  if (tag === "Voyage") return globeIcon;
  if (tag === "Restaurant") return forkKnifeIcon;
  if (tag === "Bib Gourmand") return bibIcon;
}
</script>

<template>
  <div v-for="quest in quests" :key="quest.id" class="mb-4 flex flex-col gap-4 rounded-xl border border-red-700 bg-white p-6">
    <section class="flex gap-2">
      <span v-for="cardTag in quest.tags" :key="cardTag" class="flex items-center gap-1 rounded-full bg-red-700 px-2 py-0.5 text-xs text-white">
        <img :src="generateAsset(cardTag)" alt="Image de tag" class="h-3 w-3">
        {{ cardTag }}
      </span>
    </section>

    <div class="flex flex-col">
      <h3 class="font-serif text-xl font-semibold text-red-700">{{ quest.name }}</h3>
      <p class="text-sm text-gray-600">{{ quest.description }}</p>
    </div>

    <section class="flex flex-col gap-2 rounded-lg border border-red-700/50 p-3">
      <div class="flex items-center justify-between">
        <p class="text-sm font-medium">Ma récompense</p>
        <span class="flex items-center gap-1 rounded bg-red-700 px-2 py-0.5 text-xs font-semibold text-white">
          <img class="h-3 w-3" :src="expIcon" alt="Icon d'expérience">
          {{ quest.reward }}
        </span>
      </div>

      <div class="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <span class="block h-full rounded-full bg-red-700" :style="{ width: calculatePercentage(Number(quest.score), Number(quest.objectif)) + '%' }"></span>
      </div>

      <p class="text-right text-xs font-semibold text-gray-800">
        <span class="text-red-700">{{ quest.score }}</span> fait{{ quest.score > 1 ? 's' : '' }} sur {{ quest.objectif }}
      </p>
    </section>
  </div>
</template>
