<script setup lang="ts">
import { useCursor } from '~/composables/useCursor'

const { cursorX, cursorY, trailX, trailY, isVisible } = useCursor()
</script>

<template>
  <div class="layout">
    <slot />
    <AppFooter />

    <div
      v-show="isVisible"
      class="cursor-dot"
      :style="{ transform: `translate(${cursorX}px, ${cursorY}px)` }"
    />
    <div
      v-show="isVisible"
      class="cursor-trail"
      :style="{ transform: `translate(${trailX}px, ${trailY}px)` }"
    />
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.cursor-dot,
.cursor-trail {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 9999;
  will-change: transform;
}

.cursor-dot {
  width: 6px;
  height: 6px;
  margin: -3px 0 0 -3px;
  border-radius: 50%;
  background: var(--color-red);
}

.cursor-trail {
  width: 32px;
  height: 32px;
  margin: -16px 0 0 -16px;
  border-radius: 50%;
  border: 1px solid rgba(240, 234, 214, 0.5);
}
</style>

<style>
* { cursor: none !important; }
</style>
