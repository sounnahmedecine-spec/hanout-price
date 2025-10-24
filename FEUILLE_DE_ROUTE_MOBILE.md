# 🗂 Feuille de route pour VS Code — Hanout Price Mobile

## 1️⃣ Préparer l’environnement

1. Ouvrir le projet `WebNextJS` dans VS Code.
2. Vérifier les dépendances Capacitor et Firebase :

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npm install firebase react-instantsearch-hooks-web i18next
npm install @codetrix-studio/capacitor-google-auth @capacitor/camera @capacitor/geolocation
```

3. Synchroniser Capacitor :

```bash
npx cap sync
```

4. Ajouter Android si pas déjà fait :

```bash
npx cap add android
```

---

## 2️⃣ Créer les pages sécurisées

### a) Dashboard

* Coller le code que je t’ai fourni pour `src/app/dashboard/page.tsx`.
* Vérifier les imports Firebase.
* Tester en local :

```bash
npm run dev
```

* Vérifier qu’après login Email/Mot de passe, l’utilisateur arrive sur `/dashboard`.

---

### b) Page `/scan` (Caméra / Code-barres)

1. Créer `src/app/scan/page.tsx`.
2. Ajouter bouton pour lancer la caméra Capacitor :

```ts
import { Camera, CameraResultType } from '@capacitor/camera';
const photo = await Camera.getPhoto({ quality: 80, resultType: CameraResultType.DataUrl });
```

3. Envoyer la Data URI à Firebase Storage.
4. Appeler le flow Genkit pour reconnaissance produit.
5. Rediriger vers `/dashboard` après soumission.

---

### c) Page `/map` (Géolocalisation / Google Map)

1. Créer `src/app/map/page.tsx`.
2. Utiliser Capacitor Geolocation :

```ts
import { Geolocation } from '@capacitor/geolocation';
const position = await Geolocation.getCurrentPosition();
```

3. Afficher carte avec **Leaflet** ou **Google Maps JS API**, centré sur la position de l’utilisateur.
4. Ajouter marqueurs pour les magasins à partir de Firestore `/shops`.

---

## 3️⃣ Config Capacitor et permissions Android

1. Ouvrir `android/app/src/main/AndroidManifest.xml` et ajouter :

```xml
<uses-permission android:name="android.permission.CAMERA"/>
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
<uses-permission android:name="android.permission.INTERNET"/>
```

2. Vérifier que le `capacitor.config.ts` contient `server: { hostname: "localhost" }` pour dev.
3. Synchroniser les modifications :

```bash
npx cap sync android
```

---

## 4️⃣ Tester sur appareil ou émulateur

1. Lancer Android Studio : `npx cap open android`
2. Compiler l’APK ou lancer l’émulateur.
3. Tester le login email/password → Dashboard → Scanner → Map.
4. Vérifier que les images sont envoyées à Firebase Storage et que la reconnaissance produit fonctionne.

---

## 5️⃣ Optimisation et finalisation

* Ajouter loaders / messages d’attente pour caméra et géolocalisation.
* Gérer erreurs IA et absence de connexion internet.
* Tester i18n sur toutes les pages.
* Vérifier responsive pour différentes tailles d’écran Android.
