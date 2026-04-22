<script setup lang="ts">
import { ref } from 'vue'
import BadgesModal from '~/components/BadgesModal.vue'

const isModalOpen = ref(false)

const quests = [
  {id: 1, name: "Les Mères lyonnaises", description: "5 bouchons emblématiques - Saison 2026", score: "2", objectif: "5"},
  {id: 2, name: "La faim s'invite", description: "Manger dans plusieurs restaurants", score: "7", objectif: "10"},
  {id: 3, name: "Découvrir Limoges", description: "Rendez vous dans la ville de Limoges", score: "0", objectif: "1"}
]

const displayedBadges = [
  { id: 'paris', name: 'Paris', obtenus: true },
  { id: 'lyon', name: 'Lyon', obtenus: true },
  { id: 'toulouse', name: 'Toulouse', obtenus: false },
  { id: 'bordeaux', name: 'Bordeaux', obtenus: false },
  { id: 'rennes', name: 'Rennes', obtenus: false },
]

function calculatePercentage(score: number, objectif: number) {
  if (objectif === 0) return 0;
  return (score / objectif) * 100;
}
</script>

<template>
  <main class="profil">
    <section class="info-section">
      <p>Passeport</p>
      <p>Lina</p>
      <p>2026</p>
    </section>

    <h1 class="profil-title">Mes tables</h1>

    <section class="card-container">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">France</h3>
          <p class="card-progress-text">12 / 47</p>
        </div>
        <div class="slider">
          <span class="slider-bar" style="width: 25.5%;"></span>
        </div>
        <p class="card-subtitle">Plus que 35 étoilés avant le diamant</p>
      </div>
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
      <div v-for="quest in quests" :key="quest.id" class="card">
        <div class="card-header">
          <h3 class="card-title">{{ quest.name }}</h3>
          <p class="card-progress-text"><span>{{ quest.score }}</span> / {{ quest.objectif }}</p>
        </div>
        <div class="slider">
          <span class="slider-bar" :style="{ width: calculatePercentage(Number(quest.score), Number(quest.objectif)) + '%' }"></span>
        </div>
        <p class="card-subtitle">{{ quest.description }}</p>
      </div>
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

.card {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  gap: 1rem;
  border: 1px solid #BA0B2F;
  border-radius: 12px;
  background-color: #fff;
  margin-bottom: 1rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.card-title {
  font-family: var(--font-serif), sans-serif;
  font-size: 1.5rem;
  font-weight: 400;
  color: #BA0B2F;
}

.card-progress-text {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-black);
}

.card-progress-text span {
  color: var(--color-red);
}

.slider {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.slider-bar {
  display: block;
  height: 100%;
  background-color: #BA0B2F;
  border-radius: 4px;
}

.card-subtitle {
  font-size: 0.8rem;
  color: rgba(0, 0, 0, 0.6);
  text-align: center;
  margin-top: 0.5rem;
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
