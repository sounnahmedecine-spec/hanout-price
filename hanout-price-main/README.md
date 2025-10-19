🚀 # FEUILLE DE ROUTE — ONBOARDING HANOUT PRICE

## Contexte du projet

**Hanout Price** est un projet Firebase existant. L'objectif actuel est de refaire l'UI de l'écran d'inscription / onboarding en y intégrant une vidéo de fond, un slogan et des boutons de navigation, **sans toucher au backend ni aux fonctions Firebase existantes**.

La vidéo doit illustrer l'utilité de l'application : **Scanner • Comparer • Économiser**.

---

### 1️⃣ Configuration Firebase (pour référence)
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyCAj63G6bydOxrfHTuGSP8cNxOq_RnZjF0",
  authDomain: "studio-9692019390-ae379.firebaseapp.com",
  projectId: "studio-9692019390-ae379",
  storageBucket: "studio-9692019390-ae379.firebasestorage.app",
  messagingSenderId: "723446816365",
  appId: "1:723446816365:web:263aa1738e22adb1406964"
};
```

---

### 2️⃣ Médias et Références

- **Logo** : `/public/logo-hanout-price.png`
- **Vidéo Onboarding** : `https://res.cloudinary.com/db2ljqpdt/video/upload/v1760306093/Generated_File_October_12_2025_-_10_53PM_ytnxhz.mp4`

---

### 3️⃣ Objectif UI

- **Écran d'onboarding** avec vidéo en arrière-plan (hauteur réduite à 40-50% de l'écran).
- **Vidéo** : `autoplay`, `loop`, `muted`.
- **Slogan** centré ou en superposition : `Scanner • Comparer • Économiser`.
- **Boutons de navigation** en bas de l'écran : `Connexion` / `Inscription`.
- **Style** : Mobile-first, responsive, et accessible.

---

### 4️⃣ Design Tokens & Style

**Fichier** : `src/styles/tokens.css`
```css
:root {
  --primary: #2E7D32;
  --cta: #FFA94D;
  --accent: #4D9BFF;
  --text: #333333;
  --bg: #F7F7F7;
  --card-bg: #FFFFFF;
  --radius: 12px;
  --shadow: 0 6px 18px rgba(0,0,0,0.06);
}
```

- **Typographie** : Poppins / Inter.
- **Style général** : Coins arrondis, ombres douces, espacement généreux, boutons larges.

---

### 5️⃣ Composants à générer

- `/src/pages/onboarding.tsx` : La page principale de l'onboarding.
- `/src/components/Onboarding.tsx` : Le composant contenant la logique UI (vidéo, slogan, boutons).
- `/src/components/ui/Button.tsx` : Un composant bouton réutilisable si nécessaire.

Les composants devront inclure des commentaires `// TODO: replace with Firebase call` pour les actions de navigation (connexion/inscription) afin de faciliter l'intégration future.

---

### 6️⃣ Checklist de développement

- [ ] Créer la structure de fichiers (`/pages`, `/components`, `/styles`).
- [ ] Créer `tokens.css` et un fichier de style global `theme.css`.
- [ ] Intégrer la vidéo en arrière-plan (`autoplay`, `loop`, `muted`).
- [ ] Ajouter le slogan et les boutons en superposition.
- [ ] Assurer que le design est mobile-first et responsive.
- [ ] Placer les boutons en bas de l'écran, style application mobile.
- [ ] Ajouter les commentaires `TODO` pour l'intégration future.
- [ ] **Ne pas modifier la logique backend existante.**
