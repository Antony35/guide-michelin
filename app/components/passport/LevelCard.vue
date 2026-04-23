<script setup lang="ts">
import {computed} from 'vue'
import expIcon from '~/assets/exp-icon.svg'

const props = defineProps({
  level: {
    type: Number,
    required: true,
    default: 1
  },
  currentExp: {
    type: Number,
    required: true,
    default: 0
  },
  nextLevelExp: {
    type: Number,
    required: true,
    default: 100
  }
})

const progressPercentage = computed(() => {
  if (props.nextLevelExp === 0) return 0
  return (props.currentExp / props.nextLevelExp) * 100
})

const generateGrade = (level: number) => {
  if (level <= 5) return "Apprenti";
  else if (level <= 10) return "Commis";
  else if (level <= 15) return "Chef de Partie";
  else if (level <= 20) return "Sous-Chef";
  else if (level <= 25) return "Chef";
  else if (level <= 30) return "Chef Exécutif";
  else if (level <= 35) return "Maître Cuisinier";
  else if (level <= 40) return "Grand Chef";
  else if (level <= 45) return "Légende Culinaire";
}
</script>

<template>
  <div class="flex items-center gap-6 rounded-2xl border border-red-500 bg-white p-5">
    <div
        class="flex h-20 w-20 flex-shrink-0 flex-col items-center justify-center rounded-xl bg-red-700 text-center text-white">
      <span class="font-sans text-xs font-semibold uppercase tracking-widest opacity-80">Niveau</span>
      <span class="font-serif text-4xl font-semibold leading-tight">{{ level }}</span>
    </div>

    <div class="flex w-full flex-col gap-2">
      <div class="flex items-baseline justify-between">
        <span class="font-sans text-sm font-semibold text-gray-800">{{ generateGrade(level) }}</span>
        <span class="flex items-center gap-1 font-sans text-sm font-medium text-gray-500">
          <img :src="expIcon" alt="Icône d'expérience" class="h-3.5 w-3.5">
          {{ currentExp }} / {{ nextLevelExp }} Exp
        </span>
      </div>

      <div
          class="h-2.5 w-full overflow-hidden rounded-full bg-gray-200"
          role="progressbar"
          :aria-valuenow="currentExp"
          aria-valuemin="0"
          :aria-valuemax="nextLevelExp"
      >
        <div
            class="h-full rounded-full bg-red-700 transition-all duration-500 ease-in-out"
            :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>
    </div>
  </div>
</template>
