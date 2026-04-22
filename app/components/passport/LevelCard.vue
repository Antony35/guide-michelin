<script setup lang="ts">
</script>

<template>
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
</style>
