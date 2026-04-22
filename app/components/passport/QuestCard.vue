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
  <div v-for="quest in quests" :key="quest.id" class="card">
    <section class="card-tags">
      <span v-for="cardTag in quest.tags" :key="cardTag" class="card-tag">
        <img :src="generateAsset(cardTag)" alt="Image de tag">
        {{ cardTag }}
      </span>
    </section>
    <div class="card-header">
      <h3 class="card-title">{{ quest.name }}</h3>
      <p class="card-subtitle">{{ quest.description }}</p>
    </div>
    <section class="section-reward">
      <div class="card-reward">
        <p>Ma récompense</p>
        <span>
          <img class="img-reward" :src="expIcon" alt="Icon d'expérience">
          {{ quest.reward }}
        </span>
      </div>
      <div class="slider">
      <span class="slider-bar"
            :style="{ width: calculatePercentage(Number(quest.score), Number(quest.objectif)) + '%' }"></span>
      </div>
      <p class="card-progress-text"><span>{{ quest.score }}</span> fait{{ quest.score > 1 ? 's' : '' }} sur {{ quest.objectif }}</p>
    </section>
  </div>
</template>

<style scoped>
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
  flex-direction: column;
}

.card-title {
  font-family: var(--font-serif), sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #BA0B2F;
}

.card-progress-text {
  text-align: right;
  font-size: 12px;
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
}

.card-tags {
  display: flex;
  gap: .5rem;
}

.card-tag {
  font-size: 12px;
  padding: .1rem .5rem;
  border-radius: 10px;
  color: var(--color-cream);
  background-color: var(--color-red);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.card-tag img {
  width: 12px;
  height: 12px;
}

.section-reward {
  display: flex;
  flex-direction: column;
  gap: .5rem;
  padding: .5rem;
  border: 1px solid var(--color-red);
  border-radius: 12px;
}

.card-reward {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-reward span {
  display: flex;
  align-items: center;
  gap: .25rem;
  font-size: 12px;
  font-weight: 600;
  padding: .1rem .5rem;
  border-radius: 5px;
  color: var(--color-cream);
  background-color: var(--color-red);
}

.img-reward {
  width: 12px;
}
</style>
