<script setup lang="ts">
</script>

<template>
  <header class="header">
    <img class="img-header" src="../assets/logo-text.svg" alt="Logo Michelin"/>
    <NuxtLink to="/profil" class="profil-link">
      <img class="profil-img" src="../assets/profil.webp" alt="Image de profil">
    </NuxtLink>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  padding: 0 2rem;
}

.img-header {
  min-width: 1rem;
  width: 50%;
  max-width: 30rem;
}

.profil-link {
  width: 35px;
  height: 35px;
  border-radius: 1rem;
  border: 1px solid var(--color-red);
  overflow: hidden;
}

.profil-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
