export function uid(): string {
  return Math.random().toString(36).slice(2, 9)
}

export function todayISO(): string {
  return new Date().toISOString().split('T')[0]
}

export function addDays(isoDate: string, days: number): string {
  const date = new Date(isoDate)
  date.setDate(date.getDate() + days)
  return date.toISOString().split('T')[0]
}
