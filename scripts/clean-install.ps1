Write-Host "🧹 Cleaning project..." -ForegroundColor Yellow

# Clean npm cache
Write-Host "Cleaning npm cache..." -ForegroundColor Cyan
npm cache clean --force

# Remove node_modules and package-lock.json
Write-Host "Removing node_modules and package-lock.json..." -ForegroundColor Cyan
if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" }
if (Test-Path "package-lock.json") { Remove-Item -Force "package-lock.json" }

# Clean Android build
Write-Host "Cleaning Android build..." -ForegroundColor Cyan
Set-Location android
& .\gradlew clean
Set-Location ..

Write-Host "📦 Installing dependencies..." -ForegroundColor Green
npm install --legacy-peer-deps

Write-Host "✅ Clean install complete!" -ForegroundColor Green
Write-Host "🚀 You can now run: npm run android or npm run ios" -ForegroundColor Blue
