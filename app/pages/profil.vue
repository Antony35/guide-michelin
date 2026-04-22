<script setup lang="ts">

</script>

<template>
  <main class="profil">
    <section class="info-section">
      <p>Passeport</p>
      <p>Léo</p>
      <p>Expire en 2026</p>
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
        <div class="badge">
          <span class="badge-text">Paris</span>
        </div>
        <div class="badge">
          <span class="badge-text">Lyon</span>
        </div>
        <div v-for="alias in 4" :key="alias" class="badge placeholder">
          <span>?</span>
        </div>
      </div>
    </section>

    <section class="badges-section">
      <h2>Quêtes du moment</h2>
      <div class="badge-container">
        <div class="badge">
          <span class="badge-text">Paris</span>
        </div>
        <div class="badge">
          <span class="badge-text">Lyon</span>
        </div>
        <div v-for="alias in 4" :key="alias" class="badge placeholder">
          <span>?</span>
        </div>
      </div>
    </section>
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

.badges-section h2 {
  font-family: var(--font-serif), sans-serif;
  font-size: 1.75rem;
  font-weight: 400;
  text-align: center;
  margin-bottom: 2rem;
}

.badge-container {
  display: grid;
  justify-content: space-between;
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
}

.badge:hover {
  transform: scale(1.05);
}

.badge.placeholder {
  border-style: dashed;
  color: rgba(0, 0, 0, 0.3);
  background-color: transparent;
  font-size: 1.5rem;
}
</style>
