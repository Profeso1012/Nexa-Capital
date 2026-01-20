# Fast Restart Script for Next.js
Write-Host "🧹 Cleaning build cache..." -ForegroundColor Yellow
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

Write-Host "✅ Cache cleared!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Starting Next.js with Turbopack..." -ForegroundColor Cyan
Write-Host "   This should be MUCH faster!" -ForegroundColor Cyan
Write-Host ""

npm run dev
