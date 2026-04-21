<script setup lang="ts">
import {PANELS, useLanding} from '~/composables/useLanding'

const containerRef = ref<HTMLElement | null>(null)

const {
  logoAngle,
  hasVideoStarted,
  registerVideo,
  updateLogoAngle,
  playPanelVideo,
  pausePanelVideo,
} = useLanding(containerRef)
</script>

<template>
  <main
      ref="containerRef"
      class="landing"
      @mousemove="updateLogoAngle"
  >
    <div class="title-wrapper">
      <img src="../assets/logo-text.svg" alt="Michelin" class=""/>
    </div>

    <NuxtLink
        v-for="panel in PANELS"
        :key="panel.id"
        :to="panel.route"
        class="panel"
        @mouseenter="playPanelVideo(panel.id)"
        @mouseleave="pausePanelVideo(panel.id)"
    >
      <img :src="panel.posterSrc" :alt="panel.title" class="panel-poster"/>
      <video
          :ref="(el) => registerVideo(el, panel.id)"
          :src="panel.videoSrc"
          :class="{ 'is-playing': hasVideoStarted[panel.id] }"
          muted
          loop
          playsinline
          preload="none"
          class="panel-video"
      />
      <div class="panel-overlay"/>

      <span class="panel-index">{{ panel.index }}</span>

      <div class="panel-content">
        <div class="panel-title-wrap">
          <h2 class="panel-title">{{ panel.title }}</h2>
          <span class="panel-underline"/>
        </div>
        <p class="panel-description">{{ panel.description }}</p>
      </div>
    </NuxtLink>

    <div class="logo-wrap" :style="{ transform: `rotate(${logoAngle}deg)` }">
      <img src="../assets/logo.svg" alt="Michelin" class="logo"/>
    </div>
  </main>
</template>

<style scoped>
.landing {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: var(--color-black);
}

.landing::before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 14rem;
  background: linear-gradient(to bottom, rgba(10, 10, 8, 0.7), transparent);
  z-index: 10;
  pointer-events: none;
}

.title-wrapper {
  position: absolute;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  pointer-events: none;
  white-space: nowrap;
}

@keyframes titleReveal {
  from {
    opacity: 0;
    letter-spacing: 0.55em;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    letter-spacing: 0.12em;
    transform: translateY(0);
  }
}

.panel {
  position: relative;
  overflow: hidden;
  display: block;
  text-decoration: none;
}

.panel:nth-child(2) {
  border-left: 1px solid rgba(240, 234, 214, 0.12);
}

.panel:nth-child(3) {
  border-top: 1px solid rgba(240, 234, 214, 0.12);
}

.panel:nth-child(4) {
  border-left: 1px solid rgba(240, 234, 214, 0.12);
  border-top: 1px solid rgba(240, 234, 214, 0.12);
}

.panel-poster,
.panel-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.panel-video {
  opacity: 0;
  transition: opacity 0.4s ease;
}

.panel-video.is-playing {
  opacity: 1;
}

.panel-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(10, 10, 8, 0.5) 0%, transparent 50%);
  z-index: 1;
  transition: background 0.5s ease;
}

.panel:hover .panel-overlay {
  background: linear-gradient(to top, rgba(10, 10, 8, 0.65) 0%, transparent 75%);
}

.panel-index {
  position: absolute;
  top: 1.5rem;
  left: 1.75rem;
  z-index: 2;
  font-family: var(--font-sans), sans-serif;
  font-size: 0.65rem;
  letter-spacing: 0.16em;
  color: rgba(240, 234, 214, 0.35);
  transition: color 0.3s ease;
}

.panel:hover .panel-index {
  color: rgba(240, 234, 214, 0.6);
}

.panel-content {
  position: absolute;
  bottom: 2.25rem;
  left: 2rem;
  z-index: 2;
}

.panel-title-wrap {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
}

.panel-title {
  font-family: var(--font-serif), sans-serif;
  font-weight: 400;
  font-size: clamp(1.5rem, 2.5vw, 2.25rem);
  color: var(--color-cream);
  margin: 0 0 0.5rem 0;
  letter-spacing: 0.03em;
  line-height: 1;
}

.panel-underline {
  display: block;
  height: 1.5px;
  width: 1.75rem;
  background-color: var(--color-red);
  transform-origin: left center;
  transition: width 0.55s cubic-bezier(0.4, 0, 0.2, 1);
}

.panel:hover .panel-underline {
  width: 100%;
}

.panel-description {
  margin: 0.9rem 0 0 0;
  font-family: var(--font-sans), sans-serif;
  font-size: 0.78rem;
  color: rgba(240, 234, 214, 0.65);
  letter-spacing: 0.04em;
  line-height: 1.5;
  max-width: 18rem;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s;
}

.panel:hover .panel-description {
  opacity: 1;
  transform: translateY(0);
}

.logo-wrap {
  position: absolute;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  z-index: 30;
  width: 3.25rem;
  height: 3.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: var(--color-black);
  border: 1px solid rgba(240, 234, 214, 0.3);
  transition: transform 0.08s linear;
  pointer-events: none;
}

.logo {
  width: 2rem;
  height: 2rem;
  object-fit: contain;
}
</style>
