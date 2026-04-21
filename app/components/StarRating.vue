<script setup lang="ts">
import logoSrc from '../assets/logo.svg'

withDefaults(
  defineProps<{
    count: number
    useLogo?: boolean
  }>(),
  {
    useLogo: false,
  }
)
</script>

<template>
  <span class="star-rating" :aria-label="`${count} étoile${count > 1 ? 's' : ''}`">
    <template v-if="useLogo">
      <img
        v-for="i in count"
        :key="i"
        :src="logoSrc"
        alt=""
        class="star-logo"
      />
    </template>
    <template v-else>
      {{ '★'.repeat(count) }}
    </template>
  </span>
</template>

<style scoped>
.star-rating {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  line-height: 1;
}

.star-logo {
  width: 14px;
  height: 14px;
  display: inline-block;
}
</style>

