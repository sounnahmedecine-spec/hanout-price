# build-and-sync.ps1
Write-Host "--- Démarrage du build et sync ---"

# Nettoyage
Write-Host "0. Nettoyage des dossiers .next et out..."
Remove-Item -Recurse -Force ".next" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "out" -ErrorAction SilentlyContinue

# Installer les dépendances
Write-Host "1. Installation des dépendances..."
npm install

# Build Next.js
Write-Host "2. Build Next.js..."
npm run build

# Synchroniser Capacitor
Write-Host "3. Synchronisation Capacitor..."
npx cap sync

Write-Host "--- Build et sync terminés ---"