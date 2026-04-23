<script setup lang="ts">
import { ref } from 'vue'
import LevelCard from "~/components/passport/LevelCard.vue";
import QuestCard from "~/components/passport/QuestCard.vue";
import {useQuest} from "~/composables/useQuest";
import BadgesModal from "~/components/passport/BadgesModal.vue";

const { quests } = useQuest()

const isModalOpen = ref(false)

const displayedBadges = [
  { id: 'paris', name: 'Paris', obtenus: true },
  { id: 'lyon', name: 'Lyon', obtenus: true },
  { id: 'toulouse', name: 'Toulouse', obtenus: false },
  { id: 'bordeaux', name: 'Bordeaux', obtenus: false },
  { id: 'rennes', name: 'Rennes', obtenus: false },
]

const breadCrumbItems = ref([
  { label: 'accueil', to: '/' },
  { label: 'passport' }
])
</script>

<template>
  <AventureHeader />
  <AppBreadcrumb :items="breadCrumbItems" />
  <main class="min-h-screen bg-[#F0F4F5] p-8 font-sans text-gray-800">
    <section class="mb-12 flex justify-center gap-6 text-xs uppercase tracking-widest text-black/50">
      <p>Passeport</p>
      <p class="before:content-['•'] before:mr-6">Lina</p>
      <p class="before:content-['•'] before:mr-6">2026</p>
    </section>

    <h1 class="mb-8 text-center font-serif text-[clamp(2.5rem,5vw,3.5rem)] font-normal text-red-700">Mon Level</h1>

    <section class="mx-auto mb-12 max-w-xl">
      <LevelCard :level="3" :current-exp="125" :next-level-exp="200" />
    </section>

    <section class="mx-auto mb-12 max-w-xl">
      <h2 class="mb-8 text-center font-serif text-2xl font-normal">Mes tampons</h2>
      <div class="grid grid-cols-[repeat(auto-fill,minmax(75px,1fr))] gap-6">
        <div
          v-for="badge in displayedBadges"
          :key="badge.id"
          :class="[
            'flex h-[75px] w-[75px] items-center justify-center rounded-full text-center font-semibold transition-transform duration-300 hover:scale-105',
            badge.obtenus ? 'border border-red-700 bg-white text-red-700' : 'border border-dashed border-red-700 bg-transparent text-gray-500'
          ]"
        >
          <span class="text-sm">{{ badge.obtenus ? badge.name : '?' }}</span>
        </div>
        <div
          class="flex h-[75px] w-[75px] cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-gray-400 bg-transparent text-3xl text-gray-400 transition-transform duration-300 hover:scale-105"
          @click="isModalOpen = true"
        >
          <span>+</span>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-xl">
      <h2 class="mb-8 text-center font-serif text-2xl font-normal">Quêtes du moment</h2>
      <QuestCard :quests="quests" />
    </section>

    <BadgesModal v-if="isModalOpen" @close="isModalOpen = false" />
  </main>
</template>
