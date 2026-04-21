<script setup lang="ts">
</script>
<template>
  <header class="aventure-header">
    <div class="header-inner">
      <NuxtLink to="/">
        <h1 class="header-title"><span>Michelin</span> Guide</h1>
      </NuxtLink>
      <NuxtLink to="/passport" class="avatar" aria-label="Mon passeport">
        <span class="avatar-initial">A</span>
      </NuxtLink>
    </div>
  </header>
</template>

<style scoped>
.aventure-header {
  background-color: var(--color-cream);
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid rgba(26, 34, 36, 0.08);
}

.header-inner {
  max-width: 72rem;
  margin: 0 auto;
  padding: 1.25rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-title {
  font-family: var(--font-serif), sans-serif;
  font-weight: 400;
  color: var(--color-red);
  letter-spacing: 0.01em;
  font-size: 2rem;
  > span {
    font-weight: 900;
  }
}

.avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: var(--color-red);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  flex-shrink: 0;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.avatar:hover {
  opacity: 0.85;
  transform: scale(1.05);
}

.avatar-initial {
  font-family: var(--font-serif), serif;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  line-height: 1;
  user-select: none;
}

@media (max-width: 640px) {
  .header-inner {
    padding: 1rem 1.25rem;
  }

  .avatar {
    width: 2.25rem;
    height: 2.25rem;
  }
}
</style>
