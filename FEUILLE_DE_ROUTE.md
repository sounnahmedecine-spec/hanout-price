# 🎯 CONTEXTE PROJET

Projet : **Hanout Price**
Objectif : Refonte propre et test complet de l’app Next.js + Capacitor (avant migration Flutter).

## 🧱 STRUCTURE ACTUELLE

```
D:\HanoutPriceProjects
│
├── WebNextJS\          # Code du site web Next.js
│   ├── app/ ou pages/
│   ├── public/
│   ├── next.config.ts
│   └── package.json
│
├── AndroidCapacitor\   # Projet Capacitor (Android)
│   ├── android/
│   └── capacitor.config.ts
│
└── FlutterAndroid\     # Projet Flutter séparé
```

> Flutter est prêt mais non utilisé pour l’instant.  
> On garde **Capacitor** jusqu’à la fin de la refonte Next.js.

---

# ⚙️ OBJECTIF ACTUEL

✅ Avoir une version **Next.js fonctionnelle** et **intégrée à Capacitor** :
- Suppression des erreurs de pages en double.  
- Correction des problèmes d’icônes / favicon / manifest.  
- Build propre `npm run build && npx next export`.  
- Synchronisation avec Capacitor (`npx cap sync`).  
- Ouverture et test de l’APK sur téléphone.  

---

# 🚀 FEUILLE DE ROUTE TECHNIQUE

## 🧩 Étape 1 — Vérifier structure Next.js
1. Lancer `tree /f` dans `D:\HanoutPriceProjects\WebNextJS`
2. Envoyer la structure ici pour diagnostic.  
➡️ Correction des doublons (`page.tsx`, `layout.tsx`, etc.) et des conflits d’icônes.

## 🧩 Étape 2 — Vérifier configuration
- `next.config.ts` doit contenir :
  ```ts
  const nextConfig = {
    output: 'export',
    images: { unoptimized: true },
  };
  export default nextConfig;
  ```
- Vérifier aussi `package.json` (scripts `dev`, `build`, `export`).

## 🧩 Étape 3 — Build propre

```bash
cd D:\HanoutPriceProjects\WebNextJS
npm run build
npx next export
```

Sortie attendue : `/out` sans erreurs.

## 🧩 Étape 4 — Synchronisation Capacitor

```bash
cd ../AndroidCapacitor
npx cap sync
npx cap open android
```

Puis lancer sur téléphone ou simulateur Android Studio.

## 🧩 Étape 5 — Vérification visuelle

* L’app se lance correctement.
* Les pages s’affichent (Home, Prices, etc.).
* Test basique caméra (plugin Capacitor si présent).

## 🧩 Étape 6 — Débogage

* Si `localhost` montre des pages en double → corriger routes.
* Si erreurs d’icônes → corriger `manifest.json` et `public/favicon.ico`.
* Si problème Capacitor (assets manquants) → vérifier `webDir` dans `capacitor.config.ts`.

---

# 🧰 COMMANDES UTILES

* Lancer dev : `npm run dev`
* Build static : `npm run build && npx next export`
* Synchroniser app mobile : `npx cap sync`
* Ouvrir Android Studio : `npx cap open android`
* Rebuild complet :
  ```bash
  rd /s /q .next out
  npm install
  npm run build
  npx next export
  npx cap sync
  ```

---

# 🧠 RÔLE DE CHATGPT (VS Code)

Tu es mon **assistant de développement pour Hanout Price**.
À chaque étape :

* Tu vérifies la cohérence de la structure.
* Tu proposes des correctifs précis (fichiers à modifier).
* Tu m’aides à corriger les erreurs Next.js / Capacitor / Android Studio.
* Tu restes focalisé sur la **refonte web** + **intégration mobile**.

---

# ✅ OBJECTIF FINAL

Obtenir une app **Next.js + Capacitor** :

* proprement exportée,
* sans erreur,
* synchronisée avec Capacitor,
* et **affichable sur téléphone Android** (APK installée).
