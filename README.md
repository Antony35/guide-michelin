# Guide Michelin - MVP Frontend

## 🎯 Fonctionnalités Implémentées

### 1. **Deux Catégories d'Aventures**

#### A. **Voyages Prédéfinis** (Route: `/aventure/predefined/[id]`)
- Liste de road trips culinaires préconçus
- Chaque voyage contient :
  - Une description complète
  - Une durée estimée
  - Une liste d'étapes (restaurants et hôtels)

#### B. **Créer Mon Voyage Personnalisé** (Route: `/aventure/custom/select`)
- Interface interactive de sélection
- Catalogue de restaurants et hôtels groupés par ville
- Visualisation des sélections en temps réel
- Possibilité d'ajouter/retirer des étapes

---

## 🗺️ Carte Interactive avec Leaflet

### Fonctionnalités de la Carte:
- ✅ **Point de Départ** (marqueur or)
- ✅ **Points d'Étapes** (marqueurs gris)
- ✅ **Point d'Arrivée** (marqueur rouge)
- ✅ **Trajet Complet** (ligne pointillée rouge)
- ✅ **Popups Informatifs** avec:
  - Nom de l'établissement
  - Ville et localisation
  - Nombre d'étoiles Michelin
  - Type de cuisine/ambiance
  - Description

### Utilisation:
1. Accédez à un voyage prédéfini via `/aventure/predefined/[id]`
2. Ou créez un voyage personnalisé et cliquez sur "Voir la carte du trajet"
3. La carte affiche automatiquement le meilleur zoom pour voir tous les points

---

## 📍 Itinéraires Prédéfinis

### 1. **Paris → Lyon** (3 jours)
- L'Astrance (Paris, 3⭐)
- Relais de Bourgogne (Bourgogne, 5⭐)
- Paul Bocuse (Lyon, 3⭐)

### 2. **Provence & Côte d'Azur** (4 jours)
- Le Mille-feuille (Avignon, 2⭐)
- Château de Roussan (Saint-Rémy, 5⭐)
- Le Goût de l'Instant (Cannes, 2⭐)

### 3. **Alsace & Lorraine** (2 jours)
- Maison Kammerzell (Strasbourg, 1⭐)
- Maison Rouge (Colmar, 4⭐)
- La Minoterie (Metz, 2⭐)

---

## 🛠️ Stack Technique

- **Framework**: Nuxt 4 (Vue 3 + Vite)
- **TypeScript**: Entièrement typé
- **Styles**: Tailwind CSS v4 + CSS personnalisé
- **Animations**: GSAP
- **État**: Pinia
- **Cartes**: Leaflet avec CartoDB tiles
- **Données**: Mockées en local (JSON)

---

## 📂 Structure des Fichiers

```
app/
├── pages/
│   ├── aventure/
│   │   ├── index.vue              # Hub principal avec 2 onglets
│   │   ├── predefined/
│   │   │   └── [id].vue           # Détail d'un voyage prédéfini
│   │   └── custom/
│   │       └── select.vue         # Sélection personnalisée
│   └── index.vue                  # Landing
├── components/
│   └── roadtrip/
│       └── TripMap.vue            # Composant Leaflet
├── composables/
│   └── useRoadtrip.ts             # Logique des données
├── data/
│   └── roadtrips.json             # Données mockées
├── types/
│   └── index.ts                   # Interfaces TypeScript
└── assets/
    └── css/
        └── main.css               # Variables CSS globales
```

---

## 🚀 Commandes

```bash
# Développement
pnpm dev

# Build
pnpm build

# Preview du build
pnpm preview

# Vérification TypeScript
npx nuxi typecheck
```

---

## 🎨 Palette de Couleurs

- **Noir**: `#0a0a08` (fond principal)
- **Crème**: `#f0ead6` (texte)
- **Rouge Michelin**: `#c8102e` (accents, boutons)
- **Or**: `#b8975a` (éléments premium)
- **Gris**: `#8a8680` (texte secondaire)

---

## ✨ Points Forts

1. **Design Premium**: Interface haut de gamme inspirée de Polarsteps
2. **Zéro Backend**: Toutes les données sont mockées localement
3. **TypeScript Complet**: Pas de `any`, typage strict
4. **Séparation des Préoccupations**: Composants dumbest, logique en composables
5. **Responsive**: Fonctionne sur mobile, tablette, desktop
6. **Carte Interactive**: Visualisation géographique complète des trajets

---

## 📱 URLs Principales

- `/` - Landing page
- `/aventure` - Hub des aventures (2 onglets)
- `/aventure/predefined/[id]` - Détail d'un voyage prédéfini avec carte
- `/aventure/custom/select` - Sélection personnalisée + carte

---

## 🎯 Améliorations Futures

- [ ] Sauvegarde des voyages personnalisés
- [ ] Partage des itinéraires
- [ ] Intégration d'une API de restaurants réelle
- [ ] Mode sombre/clair
- [ ] Multilangue

