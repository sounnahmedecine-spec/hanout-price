# Projet : Hanout Price

### 1️⃣ Description du projet

**Hanout Price** est une application Flutter permettant :

*   Gestion de produits et prix dans un magasin.
*   Affichage d’informations en temps réel via Firebase.
*   Suivi des leaders ou des performances (Leaderboard).
*   Support multi-plateforme : Windows desktop et Web (Chrome, Edge).

Technologies principales :

*   Flutter (Dart)
*   Firebase (Cloud Firestore, Auth)
*   Provider ou tout autre gestionnaire d’état

---

### 2️⃣ Structure principale

*   `main.dart` : Point d’entrée de l’application.
*   `screens/profile_screen.dart` : Écran profil, contient les widgets principaux et les interactions Firebase.
*   `screens/leaderboard_screen.dart` : Écran du leaderboard (classe `LeaderboardScreen`).
*   `pubspec.yaml` : Dépendances (Flutter, Firebase, mobile_scanner, connectivity_plus…).

---

### 3️⃣ Problèmes rencontrés

1.  **Erreur de `const LeaderboardScreen`**

    *   Ligne concernée : `builder: (context) => const LeaderboardScreen()`
    *   Cause : `LeaderboardScreen` utilise des données runtime (Firebase/Provider), donc ne peut pas être `const`.
    *   Solution : Supprimer `const` → `builder: (context) => LeaderboardScreen()`

2.  **Erreur “Method not defined” pour `LeaderboardScreen`**

    *   Cause : La classe `LeaderboardScreen` n’est pas importée ou mal nommée dans `profile_screen.dart`.
    *   Solution : Ajouter l’import correct :

        ```dart
        import 'package:hanout_price/screens/leaderboard_screen.dart';
        ```

3.  **Erreurs avec `DocumentSnapshot` et `QuerySnapshot`**

    *   Lignes concernées :
        ```dart
        FutureBuilder<DocumentSnapshot>
        StreamBuilder<QuerySnapshot>
        ```
    *   Cause : Mauvais import ou incompatibilité avec la version web de Firebase.
    *   Solution :
        ```dart
        import 'package:cloud_firestore/cloud_firestore.dart';
        ```
        Et vérifier que les types Firebase correspondent aux versions actuelles (`DocumentSnapshot<Map<String, dynamic>>`, `QuerySnapshot<Map<String, dynamic>>`).

4.  **Problèmes de compilation sur Web**
    *   La compilation échoue avec `Unsupported invalid type InvalidType(<invalid>)`.
    *   Cause : Types incorrects ou widgets `const` non compatibles avec runtime data.
    *   Solution : Corriger les types et supprimer `const` sur les widgets dépendant de données runtime.

---

### 4️⃣ Objectif pour VS Code / GPT

*   Identifier et corriger automatiquement les erreurs de type Firebase.
*   Supprimer les `const` non valides.
*   Aider à compléter les imports manquants.
*   Générer des widgets Flutter conformes aux données runtime.

---

### 5️⃣ Points à vérifier pour le debugging

*   Versions Flutter et dépendances Firebase.
*   Compatibilité web (Chrome, Edge).
*   Tous les imports nécessaires dans `profile_screen.dart`.
*   Utilisation correcte des types génériques dans Firestore (`<Map<String, dynamic>>`).