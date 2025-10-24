# Plan de développement Frontend pour Hanout Price

## 1️⃣ Palette de couleurs & typographie

| Élément            | Couleur / Font    | Usage                         |
| ------------------ | ----------------- | ----------------------------- |
| Couleur principale | #FF6F61 (corail)  | Boutons, accents, badges      |
| Couleur secondaire | #4CAF50 (vert)    | Indicateurs de succès, points |
| Couleur neutre     | #F5F5F5 / #E0E0E0 | Background cartes, sections   |
| Texte principal    | #212121           | Titres et contenus            |
| Texte secondaire   | #757575           | Informations secondaires      |
| Font titres        | Poppins Bold      | Noms produits, titres pages   |
| Font texte         | Inter / Roboto    | Contenu courant, légendes     |

---

## 2️⃣ Écrans principaux

1.  **Splash Screen**
    - Logo Hanout Price centré
    - Animation légère (fade-in)
    - Couleur de fond corail (#FF6F61)
2.  **Home Feed**
    - Fil d’actualité produit
    - Carte produit : image + prix + magasin + vote/commentaire
    - Barre de recherche en haut
    - Bottom Tab bar : Accueil / Recherche / Ajouter / Leaderboard / Profil
3.  **Product Detail**
    - Grande image du produit
    - Prix et magasin
    - Boutons vote (+/-)
    - Commentaires
    - Badge “Contributeur populaire” si applicable
4.  **Add Price**
    - Formulaire avec deux options :
      1.  Photo : bouton caméra → preview image → soumettre
      2.  Code-barres : scanner → pré-rempli si existant
    - Bouton “Soumettre” avec animation Framer Motion
5.  **Search / Filter**
    - Barre de recherche
    - Filtres : catégorie, prix, magasin, distance
    - Résultats sous forme de cartes produit
6.  **Profile**
    - Photo utilisateur + pseudo
    - Points et badges
    - Historique des contributions
    - Bouton éditer profil
7.  **Leaderboard**
    - Liste des meilleurs contributeurs
    - Points et badges affichés
    - Carte par utilisateur
8.  **Notifications**
    - Liste de notifications
    - Indication visuelle pour nouvelles notifications (badge animé)

---

## 3️⃣ Composants réutilisables

*   **CardProduct** : image, nom produit, prix, magasin, vote
*   **ButtonPrimary / ButtonSecondary** : avec états normal, hover, actif
*   **Badge** : points, badges de contribution
*   **TabBar** : navigation inférieure
*   **InputField** : texte, recherche, formulaire photo/code-barres
*   **Modal / Popup** : confirmation ajout produit, notifications

---

## 4️⃣ Interactions et animations

*   Transition smooth entre écrans (slide ou fade)
*   Hover / press states pour boutons
*   Animation légère pour ajout de produit et vote
*   Badge points “pop-up” sur gain de points

---

## 5️⃣ Structure de fichiers pour Gemini

```
/src/app/ (HomeFeed.tsx, ProductDetail.tsx, AddPrice.tsx, Search.tsx, Profile.tsx, Leaderboard.tsx, Notifications.tsx)
/src/components/ (CardProduct.tsx, ButtonPrimary.tsx, ButtonSecondary.tsx, Badge.tsx, TabBar.tsx, InputField.tsx, Modal.tsx)
/src/firebase/ (firebaseConfig.ts, hooks/useUser.ts, hooks/useCollection.ts)
/src/ai/ (productRecognitionFlow.ts)
/src/lib/ (types.ts, utils.ts)
/public/assets/images/ (logo.png)
```