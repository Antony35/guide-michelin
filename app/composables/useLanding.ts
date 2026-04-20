import hotelPoster from '~/assets/hotel.webp'
import foodPoster from '~/assets/food.webp'
import travelPoster from '~/assets/travel.webp'
import storyPoster from '~/assets/story.webp'

export const PANELS: ({ id: string; index: string; title: string; description: string; videoSrc: {}; posterSrc: {}; route: string })[] = [
  { id: 'reposer',   index: '01', title: 'Se reposer',     description: "Hôtels d'exception sélectionnés par nos inspecteurs", videoSrc: 'https://res.cloudinary.com/dzsy1svqj/video/upload/v1776720150/hotel_pxieqj.webm',  posterSrc: hotelPoster,  route: '/hotel' },
  { id: 'restaurer', index: '02', title: 'Se restaurer',   description: 'Tables étoilées et adresses remarquables en France',  videoSrc: 'https://res.cloudinary.com/dzsy1svqj/video/upload/v1776720150/food_azaekj.webm',   posterSrc: foodPoster,   route: '/ce-soir' },
  { id: 'voyager',   index: '03', title: 'Voyager',        description: 'Road trips gastronomiques à travers la France',       videoSrc: 'https://res.cloudinary.com/dzsy1svqj/video/upload/v1776720150/travel_b7gmew.webm', posterSrc: travelPoster, route: '/aventure' },
  { id: 'histoire',  index: '04', title: 'Notre histoire', description: "125 ans d'excellence au service des voyageurs",       videoSrc: 'https://res.cloudinary.com/dzsy1svqj/video/upload/v1776720149/story_u10yrc.webm' ,  posterSrc: storyPoster,  route: '/about' },
]

export function useLanding(containerRef: Ref<HTMLElement | null>) {
  const logoAngle = ref(0)
  const videoElements: Record<string, HTMLVideoElement | null> = {}

  const hasVideoStarted = reactive<Record<string, boolean>>(
    Object.fromEntries(PANELS.map(p => [p.id, false]))
  )

  function registerVideo(el: unknown, panelId: string) {
    if (!(el instanceof HTMLVideoElement)) return
    videoElements[panelId] = el
    el.addEventListener('playing', () => { hasVideoStarted[panelId] = true }, { once: true })
  }

  function updateLogoAngle(event: MouseEvent) {
    if (!containerRef.value) return
    const { left, top, width, height } = containerRef.value.getBoundingClientRect()
    logoAngle.value = Math.atan2(
      event.clientY - (top + height / 2),
      event.clientX - (left + width / 2)
    ) * (180 / Math.PI)
  }

  function playPanelVideo(panelId: string) {
    videoElements[panelId]?.play()
  }

  function pausePanelVideo(panelId: string) {
    videoElements[panelId]?.pause()
  }

  return {
    logoAngle,
    hasVideoStarted,
    registerVideo,
    updateLogoAngle,
    playPanelVideo,
    pausePanelVideo,
  }
}
