### 🧠 **PROMPT GEMINI – REFONTE HANOUT PRICE (PRÊT À COLLER)**

&gt; **Contexte :**
&gt;
&gt; Projet **Hanout Price**, code actuel sur GitHub branche `refonte-ui`.
&gt; L’objectif : refaire toute la **UI mobile-first** en respectant la maquette **Stigma**, **avant** de réintégrer toutes les fonctions existantes (caméra, scan, map, soumission, profil, classement, badges) et de builder en Android/Flutter.
&gt;
&gt; **Important :** ne touche pas à la logique backend. Seule la refonte visuelle est concernée.

---

### 🎨 **Identité visuelle & ressources**

* **Logo :** `https://res.cloudinary.com/db2ljqpdt/image/upload/v1760805185/logo-hanout-price_bgih8f.png`
* **Maquette Stigma** : utiliser proportions, spacing, couleurs et typographie visibles
* **Vidéo d’intro / inscription** : si problème d’intégration, afficher logo animé à la place
* **Slogan inscription :**
  `Scannez • Comparez • Économisez`

**Design tokens CSS :**

```css
:root{
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

**Typographie :** Poppins / Inter via Google Fonts
**Style :** coins arrondis, espacement généreux, boutons larges, hiérarchie claire titres → sous-titres → actions

---

### 📱 **Écrans à générer / refondre**

1. **Splash / Inscription**

   * Fond blanc ou vidéo/logo
   * Logo animé + slogan
   * Boutons navigation normaux (profil, scan, ajout, classement) en bas

2. **Home Feed**

   * Basé sur maquette Stigma
   * Liste produits en **ProductCards**
   * Responsive et mobile-first
   * CTA visibles

3. **Product Detail**

   * Image produit en haut, nom, prix
   * Boutons : Photo / Barcode
   * Submit principal couleur CTA

4. **Add Price / Submission**

   * Scanner / Photo
   * Champ prix + magasin
   * Profil utilisateur en bas

5. **Profile & Contributions**

   * Avatar rond, points, liste contributions
   * Cartes légères

6. **Search / Filter**

   * Barre recherche + filtres
   * Liste utilisateurs avec photo et points

---

### ⚙️ **Fonctionnalités existantes à conserver**

* Caméra et capture photo
* Scan code-barres
* Géolocalisation / map
* Soumission de prix et magasin
* Profil utilisateur
* Classement / badges

&gt; **Rappel :** le code actuel sur GitHub est fonctionnel Android, ne rien recréer côté backend. Se concentrer sur la refonte UI pour l’instant.

---

### 🚀 **Feuille de route détaillée**

1. **Étape 1 – Refonte UI / composants**

   * Créer : `Home`, `ProductCard`, `Header`, `PriceModal`, `Leaderboard`, `CategoryTabs`
   * Respect des tokens et proportions de la maquette
   * Écran d’inscription avec logo/slogan/vidéo (ou logo seule si problème)
   * Ajouter **mock JSON** pour produits (`/src/data/products.mock.json`)

2. **Étape 2 – Réintégration des fonctions existantes**

   * Intégrer caméra, scan, map, soumission, profil, classement, badges
   * Vérifier navigation et compatibilité UI

3. **Étape 3 – Test et Build Flutter / Android Studio**

   * Test sur Android
   * Générer APK final fonctionnel

---

### 💻 **Livrables attendus**

* Composants React / Next.js (ou Flutter si migration)
* Fichiers CSS / tokens / thème global
* Mock data pour tests UI
* README.md : comment brancher Firebase pour remplacer mocks
* Home fonctionnel avec navigation, UI conforme à maquette
