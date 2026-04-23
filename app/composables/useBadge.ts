import { computed } from 'vue'
import badgesData from '~/data/badges.json'
import type {BadgeTheme} from "~/types";

export function useBadge() {
  const allBadgeThemes = computed<BadgeTheme[]>(() => badgesData)

  const getAllBadgeThemes = () => {
    return allBadgeThemes.value
  }

  const totalBadgeCount = computed(() => {
    return allBadgeThemes.value.reduce((total, theme) => total + theme.badges.length, 0)
  })

  const obtainedBadgeCount = computed(() => {
    return allBadgeThemes.value.reduce((total, theme) => {
      return total + theme.badges.filter(badge => badge.obtenus).length
    }, 0)
  })

  const allObtainedBadges = computed(() => {
    return allBadgeThemes.value.flatMap(theme => theme.badges.filter(badge => badge.obtenus))
  })

  const overallProgressPercentage = computed(() => {
    if (totalBadgeCount.value === 0) return 0
    return (obtainedBadgeCount.value / totalBadgeCount.value) * 100
  })

  return {
    getAllBadgeThemes,
    totalBadgeCount,
    obtainedBadgeCount,
    allObtainedBadges,
    overallProgressPercentage,
  }
}
