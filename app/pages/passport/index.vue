<script setup lang="ts">
import { ref } from 'vue'
import LevelCard from "~/components/passport/LevelCard.vue";
import QuestCard from "~/components/passport/QuestCard.vue";
import {useQuest} from "~/composables/useQuest";

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
  <main class="profil">
    <section class="info-section">
      <p>Passeport</p>
      <p>Lina</p>
      <p>2026</p>
    </section>

    <h1 class="profil-title">Mes tables</h1>

    <section class="card-container">
      <LevelCard />
    </section>

    <section class="badges-section">
      <h2>Mes tampons</h2>
      <div class="badge-container">
        <div v-for="badge in displayedBadges" :key="badge.id" class="badge" :class="{ 'not-active': !badge.obtenus }">
          <span class="badge-text">{{ badge.obtenus ? badge.name : '?' }}</span>
        </div>
        <div class="badge placeholder" @click="isModalOpen = true">
          <span>+</span>
        </div>
      </div>
    </section>

    <section class="card-container">
      <h2>Quêtes du moment</h2>
      <QuestCard :quests="quests" />
    </section>

    <BadgesModal v-if="isModalOpen" @close="isModalOpen = false" />
  </main>
</template>

<style scoped>
.profil {
  padding: 2rem;
  color: var(--color-black);
  background-color: var(--color-cream);
  min-height: 100vh;
  font-family: var(--font-sans), sans-serif;
}

.info-section {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 3rem;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.5);
}

.info-section p:not(:first-child)::before {
  content: '•';
  margin-right: 1.5rem;
}

.profil-title {
  font-family: var(--font-serif), sans-serif;
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 400;
  color: #BA0B2F;
  text-align: center;
  margin: 0 0 3rem 0;
}

.card-container {
  max-width: 600px;
  margin: 0 auto 3rem auto;
}

.card-progress-text span {
  color: var(--color-red);
}

.badges-section {
  max-width: 600px;
  margin: 0 auto 3rem auto;
}

.badges-section h2, .card-container h2 {
  font-family: var(--font-serif), sans-serif;
  font-size: 1.75rem;
  font-weight: 400;
  text-align: center;
  margin-bottom: 2rem;
}

.badge-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(75px, 1fr));
  gap: 1.5rem;
}

.badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 75px;
  height: 75px;
  border: 1px solid #BA0B2F;
  border-radius: 50%;
  background-color: #fff;
  font-weight: 600;
  color: #BA0B2F;
  transition: transform 0.3s ease;
  text-align: center;
}

.not-active {
  border: 1px dashed var(--color-red);
  background-color: transparent;
  color: rgba(0, 0, 0, 0.4);
  transition: transform 0.3s ease;
  text-align: center;
}

.badge:hover {
  transform: scale(1.05);
}

.badge.placeholder {
  border-style: dashed;
  color: rgba(0, 0, 0, 0.4);
  background-color: transparent;
  font-size: 2rem;
  cursor: pointer;
}
</style>
