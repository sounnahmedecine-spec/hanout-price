# build-and-sync-auto.ps1
# Script PowerShell pour build Next.js + Capacitor automatiquement

Write-Host "--- Démarrage du processus de build et synchronisation ---"

# 0. Nettoyage des dossiers .next et out
Write-Host "0. Nettoyage des dossiers .next et out..."
Remove-Item -Recurse -Force .next,out -ErrorAction SilentlyContinue

# 1. Installation des dépendances
Write-Host "1. Installation des dépendances npm..."
# Install all dependencies from package.json, using --legacy-peer-deps to handle potential conflicts

npm install --legacy-peer-deps
if ($LASTEXITCODE -ne 0) {
    Write-Error "❌ L'installation des dépendances a échoué."
    exit 1
}

# 2. Build Next.js
Write-Host "2. Build Next.js..."
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "❌ Build Next.js échoué."
    exit 1
}

# 3. Synchronisation Capacitor
Write-Host "3. Synchronisation Capacitor..."
npx cap sync

Write-Host "✅ Build et synchronisation terminés avec succès !"