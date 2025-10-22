# build-and-sync-auto.ps1
# Script PowerShell pour build Next.js + Capacitor automatiquement

param (
    [switch]$FixDeps
)

Write-Host "--- Démarrage du processus de build et synchronisation ---"

# 0. Nettoyage des dossiers .next et out
Write-Host "0. Nettoyage des dossiers .next et out..."
Remove-Item -Recurse -Force .next,out -ErrorAction SilentlyContinue

# 1. Installation des dépendances (étape ajoutée pour la robustesse)
Write-Host "1. Installation des dépendances npm..."
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Error "❌ L'installation des dépendances a échoué."
    exit 1
}

# 1. Installation des dépendances
if ($FixDeps) {
    Write-Host "1. Vérification et installation des dépendances manquantes..."
    $missingDeps = @(
        # Aucune dépendance à vérifier pour le moment
    )

    foreach ($dep in $missingDeps) {
        Write-Host "Vérification de $dep..."
        $installed = npm list $dep --depth=0 | Select-String $dep
        if (-not $installed) {
            Write-Host "Installation de $dep..."
            npm install $dep --save
        } else {
            Write-Host "$dep déjà installé."
        }
    }
}

# 3. Build Next.js
Write-Host "3. Build Next.js..."
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "❌ Build Next.js échoué."
    exit 1
}

# 4. Synchronisation Capacitor
Write-Host "4. Synchronisation Capacitor..."
npx cap sync

Write-Host "✅ Build et synchronisation terminés avec succès !"