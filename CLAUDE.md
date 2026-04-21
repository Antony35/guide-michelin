# CLAUDE.md — Guide Michelin MVP

Fichier de référence pour Claude Code. Lire en entier avant toute action.

---

## Vision produit

MVP frontend du **Guide Michelin façon Polarsteps** : un carnet de voyage gastronomique interactif, inspiré du passeport et de la gamification (badges, progression, XP). Présentation visuelle haut de gamme, **zéro backend**, toutes les données sont mockées en local.

---

## Stack technique

```
Nuxt 4 (Vue 3 + Vite)
TypeScript (obligatoire partout)
Tailwind CSS v4 via @nuxtjs/tailwindcss
GSAP pour les animations
Pinia pour le state global
```

---

## Architecture

```
/app
  app.vue                               ← Racine (NuxtPage uniquement)
  /pages
    index.vue                           ← Landing
    eat.vue                             ← Wrapper (Header + Breadcrumb + <NuxtPage/>)
    /eat
      index.vue                         ← Liste des pays (badges)
      [country].vue                     ← Pays non-France : "bientôt disponible"
      /france
        index.vue                       ← Liste des régions de France (badges)
        [region].vue                    ← Régions non-Bretagne : "bientôt disponible"
        /bretagne
          index.vue                     ← Liste des villes bretonnes (badges)
          [city].vue                    ← Liste des restaurants de la ville
  /components
    /eat
      Header.vue                        ← Avatar + H1 "Se restaurer" + sous-titre
      Breadcrumb.vue                    ← Fil d'Ariane dynamique basé sur la route
      CountryBadge.vue                  ← Badge pays (drapeau + anneau progression)
      RegionBadge.vue                   ← Badge région (initiales + anneau)
      CityBadge.vue                     ← Badge ville (initiales + anneau)
      RestaurantCard.vue                ← Carte restaurant (étoiles, prix, adresse)
      LevelBar.vue                      ← (réservé page passport)
      QuestCard.vue                     ← (réservé page passport)
  /composables
    useCountries.ts
    useFranceRegions.ts
    useCities.ts
    useRestaurants.ts
    useQuests.ts                        ← (réservé page passport)
    useLanding.ts
  /data
    countries.json
    france-regions.json
    cities.json                         ← Villes de Bretagne avec tables Michelin
    restaurants.json
    quests.json
  /assets
    /css
      main.css                          ← Variables globales, typographie, reset
```

### Navigation /eat

La page `pages/eat.vue` est un **wrapper parent** qui rend systématiquement le `EatHeader` et le `EatBreadcrumb`, puis délègue au `<NuxtPage />` le contenu spécifique. Toutes les pages enfants (index, [country], france/*, etc.) n'ont donc pas à gérer le header ni le fil d'Ariane.

Le flux gamifié est : **Pays → Régions (France) → Villes (Bretagne) → Restaurants**.

L'avatar du header pointe vers `/passport` (page future qui regroupera les quêtes, la barre de niveau et les XP).

---

## Règles absolues

### TypeScript
- Toujours `<script setup lang="ts">` — jamais sans `lang="ts"`
- Typer toutes les props avec `defineProps<{...}>()`
- Typer tous les retours de composables
- Zéro `any`

### Données
- **Jamais** de données inline dans un composant Vue
- Toutes les données mockées vivent dans `/app/data/*.json`
- Accès aux données uniquement via les composables dans `/app/composables/`

### Composants
- Un composant = une seule responsabilité
- Pas de logique métier dans les composants — elle va dans les composables
- Les composants reçoivent des données via props, émettent des événements via `emit`
- Nommage : PascalCase pour les fichiers, kebab-case dans les templates

### Style
- **Jamais** de styles inline (`style="..."`) sauf pour des valeurs dynamiques calculées en JS
- Tailwind pour tout le layout et l'espacement
- CSS custom (dans `<style scoped>`) uniquement pour les animations ou effets impossibles en Tailwind
- Variables CSS globales définies dans `/app/assets/css/main.css`

---

## Design system — Glassmorphism clair

L'interface /eat suit une direction **glassmorphism clair**, douce, premium et lisible.

### Palette
```css
--color-bg: #eef2f3;         /* fond général (gris-bleu très clair) */
--color-ink: #1a2224;        /* texte principal, titres */
--color-muted: #7a8a8c;      /* labels, captions, placeholders */
--color-muted-soft: #9aabae; /* sous-informations, compteurs secondaires */
--color-red: #c8102e;        /* rouge Michelin : étoiles, CTAs, progression */
--color-gold: #b8975a;       /* or : Bib Gourmand, éléments premium secondaires */
```

### Surfaces en verre
- **Blobs de couleur flous** (`filter: blur(80px)`) positionnés en fixed pour donner de la profondeur au fond clair
- **Cartes et zones surélevées** : `rgba(255, 255, 255, 0.6)` + `backdrop-filter: blur(16–20px)` + bordure `rgba(255, 255, 255, 0.6)` + ombre douce (`0 4px 20px rgba(0,0,0,0.05)`)
- Rayons `14–18px` sur les conteneurs, `50%` sur les avatars/badges

### Typographie
```css
--font-serif: 'Cormorant Garamond', Georgia, serif;  /* titres, italiques, initiales */
--font-sans: 'Didact Gothic', sans-serif;             /* corps, labels, UI */
```
- H1 : serif italique, très grand (≈ 2.75rem)
- H2/sous-titre : sans, petit, gris doux
- Labels : sans uppercase, letter-spacing 0.08–0.14em

### Principes visuels
- Fond clair, surfaces vitrées, accents rouge et or
- Anneaux de progression autour des badges pour la gamification
- Beaucoup d'espace négatif, hiérarchie claire
- Animations sobres et lentes (pas de bounce, pas de flash)

---

## Modèles de données

### Country
```typescript
interface Country {
  slug: string
  name: string
  code: string          // ISO pour l'API drapeau
  total: number
  visited: number
}
```

### FranceRegion
```typescript
interface FranceRegion {
  slug: string
  name: string
  initials: string
  total: number
  visited: number
}
```

### City
```typescript
interface City {
  slug: string
  name: string
  initials: string
  total: number
  visited: number
}
```

### Restaurant
```typescript
interface Restaurant {
  id: number
  citySlug: string
  name: string
  adresse: string
  price: '€' | '€€' | '€€€' | '€€€€'
  style: string
  description: string
  stars: 'one' | 'two' | 'three' | 'bib' | 'none'
  visited: boolean
}
```

---

## Animations

- GSAP pour les transitions de page et révélations au scroll
- `ScrollTrigger` pour les animations au scroll
- Durées : entrées 0.6–0.9s, sorties 0.3–0.4s, easing `power2.out` ou `cubic-bezier(0.16, 1, 0.3, 1)`
- Stagger sur les listes : 0.1s entre chaque élément

---

## Ce qu'il ne faut pas faire

- ❌ Pas de `fetch()` vers une API externe (sauf ressources images comme les drapeaux)
- ❌ Pas de `localStorage`
- ❌ Pas de composants UI externes (Vuetify, PrimeVue…)
- ❌ Pas de `any` en TypeScript
- ❌ Pas de données hardcodées dans les `.vue`
- ❌ Pas de logique complexe dans les templates — utiliser des `computed`
- ❌ Pas de header ou breadcrumb dans les pages enfants de /eat — c'est le wrapper `pages/eat.vue` qui s'en charge

---

## Commandes

```bash
pnpm dev          # Démarrer
pnpm build        # Build
pnpm preview      # Preview du build
npx nuxi typecheck
```

---

*Dernière mise à jour : Sprint MVP — flux /eat (pays → régions → villes → restaurants), glassmorphism clair*
