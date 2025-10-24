# 🚀 **Feuille de Route – Refonte UI/UX Hanout Price**

## **🎯 Objectif global**

Moderniser l’interface du site et de l’app Hanout Price pour une apparence plus **fluide, cohérente et mobile-friendly**, inspirée de la **maquette Stigma** et du **logo officiel**.

---

## **1️⃣ Préparation du projet**

| Étape | Action                          | Détails techniques                                                                                      |
| ----- | ------------------------------- | ------------------------------------------------------------------------------------------------------- |
| 1.1   | Créer une nouvelle branche      | `git checkout -b refonte-ui`                                                                            |
| 1.2   | Ajouter les assets visuels      | - Logo → `/public/assets/logo-hanout-price.png`&lt;br&gt;- Maquette → `/design-reference/maquette-stigma.png` |
| 1.3   | Créer un dossier `ui-kit`       | Contiendra `theme.ts`, `colors.ts`, `fonts.ts`, `globals.css`                                           |
| 1.4   | Installer libs UI modernes      | `npm install class-variance-authority tailwind-variants framer-motion`                                  |
| 1.5   | Configurer Tailwind globalement | Ajouter couleurs, typos et variantes dans `tailwind.config.ts`                                          |

---

## **2️⃣ Palette & Design System**

Extraite de ton logo et de la maquette Stigma :

| Élément        | Code HEX  | Utilisation                 |
| -------------- | --------- | --------------------------- |
| Vert principal | `#7BBA24` | Boutons, validation, header |
| Corail         | `#F26363` | Actions, accents visuels    |
| Bleu doux      | `#007BFF` | Liens, secondaires          |
| Gris clair     | `#F5F5F5` | Fonds neutres               |
| Gris foncé     | `#333333` | Texte principal             |
| Blanc pur      | `#FFFFFF` | Fond, contrastes            |

💡 Crée un fichier `/src/ui-kit/colors.ts` :

```ts
export const colors = {
  green: '#7BBA24',
  coral: '#F26363',
  blue: '#007BFF',
  grayLight: '#F5F5F5',
  grayDark: '#333333',
  white: '#FFFFFF'
};
```

---

## **3️⃣ Composants prioritaires à refondre**

| Composant         | Objectif                                                       | Référence visuelle              |
| ----------------- | -------------------------------------------------------------- | ------------------------------- |
| `Header.tsx`      | Intégrer le logo, un menu clair, et un bouton action principal | Maquette Stigma – section haute |
| `HeroBanner.tsx`  | Image large, slogan, CTA “Trouver la meilleure offre”          | Section hero Stigma             |
| `ProductCard.tsx` | Design arrondi, fond clair, bouton corail                      | Cards produits de la maquette   |
| `SearchBar.tsx`   | Design épuré avec icône                                        | Barre de recherche Stigma       |
| `Footer.tsx`      | Couleur verte, liens minimalistes                              | Pied de page simplifié          |

---

## **4️⃣ Pages à reconstruire**

| Page               | Fichiers à revoir          | Objectif                           |
| ------------------ | -------------------------- | ---------------------------------- |
| `/index.tsx`       | HeroBanner + List produits | Première impression visuelle forte |
| `/prices/[id].tsx` | Product detail             | Lisible, clair, CTA visible        |
| `/add-price.tsx`   | Formulaire modernisé       | Simple, fluide, mobile-friendly    |
| `/profile.tsx`     | Interface utilisateur      | Minimaliste, boutons arrondis      |

---

## **5️⃣ Vérification et export**

| Étape                   | Commande / Action                                       | Objectif                           |
| ----------------------- | ------------------------------------------------------- | ---------------------------------- |
| Build local             | `npm run build`                                         | S’assurer qu’aucune erreur TS/Next |
| Test responsive         | DevTools (mobile / tablette)                            | Vérifier adaptabilité              |
| Export statique         | `npm run export` → `out/`                               | Préparer Capacitor                 |
| Synchronisation Android | `npx cap sync android`                                  | Mise à jour mobile                 |
| Commit GitHub           | `git add . && git commit -m "UI Refonte Stigma + Logo"` | Sauvegarde version refondue        |

---

# 💬 **Prompts IA prêts à utiliser**

Voici des prompts que tu peux copier dans **Continue.dev** ou **ChatGPT connecté à ton code VS Code** 👇

---

### 🧠 Prompt 1 — Génération du Design System

&gt; Crée un dossier `src/ui-kit/` contenant les fichiers `colors.ts`, `theme.ts`, et `globals.css` pour un design inspiré de la maquette Stigma et du logo Hanout Price.
&gt; Le vert principal est `#7BBA24`, le corail `#F26363`, et le bleu secondaire `#007BFF`.
&gt; Le style général doit être lumineux, arrondi, et responsive (mobile-first).

---

### 🧠 Prompt 2 — Refonte du Header

&gt; Refactore le composant `src/components/Header.tsx` pour afficher le logo Hanout Price à gauche et un bouton “Ajouter un prix” corail à droite.
&gt; Utilise `framer-motion` pour une légère animation à l’apparition.
&gt; Le fond doit être vert `#7BBA24` avec texte blanc.

---

### 🧠 Prompt 3 — Hero Banner

&gt; Crée ou refactore `src/components/HeroBanner.tsx` pour reprendre la structure de la maquette Stigma :
&gt;
&gt; * Image large en fond
&gt; * Titre blanc centré
&gt; * Bouton CTA corail avec texte “Trouver la meilleure offre”
&gt;   Utilise Tailwind pour le style et veille à la compatibilité responsive.

---

### 🧠 Prompt 4 — ProductCard

&gt; Modernise `src/components/ProductCard.tsx` avec un design arrondi, ombres légères et bouton corail “Voir le prix”.
&gt; Les images doivent être centrées, et le texte bien espacé (utiliser `grid` ou `flex`).

---

### 🧠 Prompt 5 — Page Add Price

&gt; Refactore `src/app/add-price/page.tsx` en un formulaire moderne, épuré, avec couleurs de la charte.
&gt; Inclure validation, icônes, et animation de soumission (`framer-motion`).
&gt; Utiliser les composants UI du `ui-kit`.

---

### 🧠 Prompt 6 — Test & Validation

&gt; Analyse tout le projet `WebNextJS` pour détecter d’éventuelles incohérences de typage ou composants non utilisés.
&gt; Corrige automatiquement les erreurs TypeScript mineures et optimise les imports.
