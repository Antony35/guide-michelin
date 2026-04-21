<script setup lang="ts">
import { useRouter } from 'vue-router'
import { VILLES_DISPONIBLES } from '~/composables/useVoyageData'
import pin from '~/assets/pin.webp'
const router = useRouter()
const depart = ref('')
const arrivee = ref('')

const canProceed = computed(() => !!depart.value && !!arrivee.value)

function lancerVoyage() {
  if (!canProceed.value) return
  router.push({ path: '/aventure/custom/carte', query: { depart: depart.value, arrivee: arrivee.value } })
}
</script>

<template>
  <div class="select-container">
    <div class="form-card">
      <div class="form-icon">
        <img width="40" height="40" :src="pin" alt="">
      </div>
      <h1 class="form-title">Créez Votre Voyage</h1>
      <p class="form-subtitle">Choisissez votre point de départ et votre destination</p>

      <div class="form-fields">
        <div class="field-group">
          <label class="field-label" for="depart">Ville de départ</label>
          <select id="depart" v-model="depart" class="field-select">
            <option value="">Choisir une ville</option>
            <option v-for="ville in VILLES_DISPONIBLES" :key="ville.nom" :value="ville.nom">
              {{ ville.nom }}
            </option>
          </select>
        </div>

        <div class="route-arrow">↓</div>

        <div class="field-group">
          <label class="field-label" for="arrivee">Ville d'arrivée</label>
          <select id="arrivee" v-model="arrivee" class="field-select">
            <option value="">Choisir une ville</option>
            <option v-for="ville in VILLES_DISPONIBLES" :key="ville.nom" :value="ville.nom">
              {{ ville.nom }}
            </option>
          </select>
        </div>
      </div>

      <div v-if="depart && arrivee" class="route-preview">
        <span class="route-dot depart-dot" />
        <span class="route-label">{{ depart }}</span>
        <span class="route-line" />
        <span class="route-dot arrivee-dot" />
        <span class="route-label">{{ arrivee }}</span>
      </div>

      <button
        class="cta-button"
        :disabled="!canProceed"
        @click="lancerVoyage"
      >
        Voir la carte →
      </button>
    </div>
  </div>
</template>

<style scoped>
.select-container {
  background-color: #eef2f3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem 1.5rem;
  gap: 1.5rem;
}

.back-link {
  align-self: flex-start;
  color: var(--color-muted, #7a8a8c);
  text-decoration: none;
  font-family: var(--font-sans);
  font-size: 0.875rem;
  transition: color 0.2s;
  max-width: 480px;
  width: 100%;
}
.back-link:hover { color: var(--color-red); }

.form-card {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  box-shadow: 0 8px 40px rgba(10, 10, 8, 0.08);
}

.form-icon { font-size: 2.5rem; line-height: 1; }

.form-title {
  font-family: var(--font-serif);
  font-size: 1.75rem;
  font-weight: 300;
  color: var(--color-ink, #1a2224);
  margin: 0;
  text-align: center;
}

.form-subtitle {
  font-family: var(--font-sans);
  font-size: 0.95rem;
  color: var(--color-muted, #7a8a8c);
  margin: 0;
  text-align: center;
}

.form-fields {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.field-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field-label {
  font-family: var(--font-sans);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-ink, #1a2224);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.field-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.5px solid rgba(200, 16, 46, 0.3);
  border-radius: 8px;
  background: #ffffff;
  color: #1a2224;
  font-family: var(--font-sans);
  font-size: 1rem;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237a8a8c' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  cursor: pointer;
  transition: border-color 0.2s;
}
.field-select:focus {
  outline: none;
  border-color: var(--color-red);
}

.route-arrow {
  font-size: 1.25rem;
  color: var(--color-red);
  line-height: 1;
  padding: 0.25rem 0;
}

.route-preview {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(200, 16, 46, 0.06);
  border-radius: 8px;
  width: 100%;
}

.route-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
.depart-dot { background: #b8975a; }
.arrivee-dot { background: #c8102e; }

.route-line {
  flex: 1;
  height: 2px;
  background: repeating-linear-gradient(90deg, #c8102e 0, #c8102e 6px, transparent 6px, transparent 12px);
}

.route-label {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a2224;
}

.cta-button {
  width: 100%;
  padding: 0.9rem 1.5rem;
  background: rgba(200, 16, 46, 0.15);
  color: var(--color-red);
  border: 2px solid rgba(200, 16, 46, 0.4);
  border-radius: 10px;
  font-family: var(--font-sans);
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s;
}
.cta-button:hover:not(:disabled) {
  background: rgba(200, 16, 46, 0.25);
  border-color: var(--color-red);
  transform: translateY(-2px);
}
.cta-button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .form-card { padding: 2rem 1.25rem; border-radius: 12px; }
  .form-title { font-size: 1.5rem; }
}
</style>
