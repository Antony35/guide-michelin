<script setup lang="ts">
import { useRouter } from 'vue-router'
import { CITIES } from '~/composables/useVoyageData'
import pin from '~/assets/pin.webp'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const router = useRouter()
const depart = ref('')
const arrivee = ref('')

// Utilise des Date locales (pas UTC) pour éviter les décalages de timezone
function localDate(offsetDays = 0): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + offsetDays)
  return d
}
function toISO(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
function formatDisplay(d: Date): string {
  return format(d, 'd MMM yyyy', { locale: fr })
}

const departureDateObj = ref<Date>(localDate(0))
const arrivalDateObj = ref<Date>(localDate(1))

const minArrival = computed(() => {
  const min = new Date(departureDateObj.value)
  min.setDate(min.getDate() + 1)
  return min
})

function onDepartureChange(d: Date | null) {
  if (!d) return
  departureDateObj.value = d
  if (arrivalDateObj.value <= d) {
    const next = new Date(d)
    next.setDate(next.getDate() + 1)
    arrivalDateObj.value = next
  }
}
function onArrivalChange(d: Date | null) {
  if (d) arrivalDateObj.value = d
}

const canProceed = computed(() => !!depart.value && !!arrivee.value)

function lancerVoyage() {
  if (!canProceed.value) return
  router.push({
    path: '/aventure/custom/carte',
    query: {
      depart: depart.value,
      arrivee: arrivee.value,
      dateDepart: toISO(departureDateObj.value),
      dateArrivee: toISO(arrivalDateObj.value),
    },
  })
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

        <!-- Départ -->
        <div class="field-group">
          <label class="field-label" for="depart">Ville de départ</label>
          <select id="depart" v-model="depart" class="field-select">
            <option value="">Choisir une ville</option>
            <option v-for="ville in CITIES" :key="ville.city" :value="ville.city">
              {{ ville.city }}
            </option>
          </select>
        </div>

        <div class="field-group">
          <label class="field-label">Date de départ</label>
          <VDatePicker
            :model-value="departureDateObj"
            :min-date="localDate(0)"
            :popover="{ placement: 'bottom', visibility: 'click' }"
            class="date-picker-wrap"
            @update:model-value="onDepartureChange"
          >
            <template #default="{ togglePopover }">
              <button type="button" class="date-trigger" @click="togglePopover">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="date-icon"><rect x="1" y="3" width="13" height="11" rx="2" stroke="#b8975a" stroke-width="1.4"/><path d="M1 7h13" stroke="#b8975a" stroke-width="1.4"/><path d="M5 1v3M10 1v3" stroke="#b8975a" stroke-width="1.4" stroke-linecap="round"/></svg>
                <span>{{ formatDisplay(departureDateObj) }}</span>
              </button>
            </template>
          </VDatePicker>
        </div>

        <div class="route-arrow">↓</div>

        <!-- Arrivée -->
        <div class="field-group">
          <label class="field-label" for="arrivee">Ville d'arrivée</label>
          <select id="arrivee" v-model="arrivee" class="field-select">
            <option value="">Choisir une ville</option>
            <option v-for="ville in CITIES" :key="ville.city" :value="ville.city">
              {{ ville.city }}
            </option>
          </select>
        </div>

        <div class="field-group">
          <label class="field-label">Date d'arrivée</label>
          <VDatePicker
            :model-value="arrivalDateObj"
            :min-date="minArrival"
            :popover="{ placement: 'bottom', visibility: 'click' }"
            class="date-picker-wrap"
            @update:model-value="onArrivalChange"
          >
            <template #default="{ togglePopover }">
              <button type="button" class="date-trigger" @click="togglePopover">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="date-icon"><rect x="1" y="3" width="13" height="11" rx="2" stroke="#c8102e" stroke-width="1.4"/><path d="M1 7h13" stroke="#c8102e" stroke-width="1.4"/><path d="M5 1v3M10 1v3" stroke="#c8102e" stroke-width="1.4" stroke-linecap="round"/></svg>
                <span>{{ formatDisplay(arrivalDateObj) }}</span>
              </button>
            </template>
          </VDatePicker>
        </div>

      </div>

      <!-- Preview -->
      <div v-if="depart && arrivee" class="route-preview">
        <span class="route-dot depart-dot" />
        <div class="route-preview-info">
          <span class="route-label">{{ depart }}</span>
          <span class="route-date">{{ formatDisplay(departureDateObj) }}</span>
        </div>
        <span class="route-line" />
        <span class="route-dot arrivee-dot" />
        <div class="route-preview-info">
          <span class="route-label">{{ arrivee }}</span>
          <span class="route-date">{{ formatDisplay(arrivalDateObj) }}</span>
        </div>
      </div>

      <button class="cta-button" :disabled="!canProceed" @click="lancerVoyage">
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
  gap: 0.6rem;
}

.field-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field-label {
  font-family: var(--font-sans);
  font-size: 0.78rem;
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
  background: #ffffff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237a8a8c' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 1rem center;
  color: #1a2224;
  font-family: var(--font-sans);
  font-size: 1rem;
  appearance: none;
  cursor: pointer;
  transition: border-color 0.2s;
}
.field-select:focus {
  outline: none;
  border-color: #c8102e;
}

/* ── Date picker ─────────────────────────────────── */
.date-picker-wrap {
  width: 100%;
}

.date-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.75rem 1rem;
  border: 1.5px solid rgba(200, 16, 46, 0.3);
  border-radius: 8px;
  background: #ffffff;
  color: #1a2224;
  font-family: var(--font-sans);
  font-size: 1rem;
  cursor: pointer;
  transition: border-color 0.2s;
  text-align: left;
}
.date-trigger:hover,
.date-trigger:focus {
  outline: none;
  border-color: #c8102e;
}
.date-icon {
  flex-shrink: 0;
}

/* ── Route arrow ─────────────────────────────────── */
.route-arrow {
  font-size: 1.25rem;
  color: #c8102e;
  line-height: 1;
  padding: 0.1rem 0;
  text-align: center;
}

/* ── Route preview ───────────────────────────────── */
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

.route-preview-info {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}
.route-label {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a2224;
  line-height: 1.2;
}
.route-date {
  font-family: var(--font-sans);
  font-size: 0.72rem;
  color: #9aabae;
}

/* ── CTA ─────────────────────────────────────────── */
.cta-button {
  width: 100%;
  padding: 0.9rem 1.5rem;
  background: rgba(200, 16, 46, 0.15);
  color: #c8102e;
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
  border-color: #c8102e;
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

<style>
/* Override v-calendar accent color */
:root {
  --vc-accent-600: #c8102e;
  --vc-accent-500: #d4253f;
  --vc-accent-400: #e05570;
  --vc-accent-200: rgba(200, 16, 46, 0.2);
  --vc-accent-100: rgba(200, 16, 46, 0.1);
}
.vc-container {
  font-family: var(--font-sans, system-ui) !important;
  border-radius: 12px !important;
  border: 1px solid rgba(200, 16, 46, 0.2) !important;
  box-shadow: 0 8px 32px rgba(10, 10, 8, 0.12) !important;
}
</style>
