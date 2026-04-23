<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBadge } from '~/composables/useBadge'
import type { BadgeTheme } from '~/types'

defineEmits(['close'])

const { getAllBadgeThemes } = useBadge()
const allBadgeThemes = getAllBadgeThemes()

type FilterOption = 'all' | 'obtained' | 'missing'
const activeFilter = ref<FilterOption>('all')

const filteredThemes = computed<BadgeTheme[]>(() => {
  if (activeFilter.value === 'all') {
    return allBadgeThemes
  }

  return allBadgeThemes.map(theme => {
    const filteredBadges = theme.badges.filter(badge => {
      return activeFilter.value === 'obtained' ? badge.obtenus : !badge.obtenus
    })
    return { ...theme, badges: filteredBadges }
  }).filter(theme => theme.badges.length > 0)
})
</script>

<template>
  <div class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm" @click.self="$emit('close')">
    <div class="relative flex h-[90vh] w-[90%] max-w-3xl flex-col rounded-2xl bg-[#F0F4F5] p-8 shadow-2xl">
      <button class="absolute top-4 right-4 cursor-pointer border-none bg-none text-4xl leading-none text-gray-800" @click="$emit('close')">&times;</button>

      <h2 class="mb-6 text-center font-serif text-3xl font-normal text-red-700">Tous les tampons</h2>

      <div class="mb-6 flex flex-shrink-0 justify-center gap-4">
        <button
          @click="activeFilter = 'all'"
          :class="[
            'font-sans rounded-full border px-4 py-2 transition-all duration-200',
            activeFilter === 'all' ? 'border-red-700 bg-red-700 text-white' : 'border-gray-400 bg-transparent'
          ]"
        >
          Tous
        </button>
        <button
          @click="activeFilter = 'obtained'"
          :class="[
            'font-sans rounded-full border px-4 py-2 transition-all duration-200',
            activeFilter === 'obtained' ? 'border-red-700 bg-red-700 text-white' : 'border-gray-400 bg-transparent'
          ]"
        >
          Obtenus
        </button>
        <button
          @click="activeFilter = 'missing'"
          :class="[
            'font-sans rounded-full border px-4 py-2 transition-all duration-200',
            activeFilter === 'missing' ? 'border-red-700 bg-red-700 text-white' : 'border-gray-400 bg-transparent'
          ]"
        >
          Manquants
        </button>
      </div>

      <div class="-mr-4 overflow-y-auto pr-4">
        <section v-for="theme in filteredThemes" :key="theme.id" class="mb-8">
          <h3 class="mb-4 border-b border-black/10 pb-2 font-serif text-xl font-semibold text-gray-800">{{ theme.name }}</h3>
          <div class="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-6">
            <div
              v-for="badge in theme.badges"
              :key="badge.id"
              :title="badge.name"
              :class="[
                'flex h-[100px] w-[100px] flex-col items-center justify-center overflow-hidden rounded-full p-2 text-center font-semibold transition-all duration-200',
                badge.obtenus
                  ? 'border-2 border-red-700 bg-white text-red-700'
                  : 'border-2 border-gray-300 bg-transparent text-gray-500'
              ]"
            >
              <span class="text-xs leading-tight">{{ badge.name }}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
