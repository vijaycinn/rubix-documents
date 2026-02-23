# Complete Setup Script for CJN Dakota Documentation Website
# Run this from C:\workspace\account\cjn-dakota\cjn-dakota-docs

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CJN Dakota Documentation Website Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Step 1: Create API routes
Write-Host "`n[1/3] Creating API directory structure..." -ForegroundColor Yellow
.\setup-api-routes.ps1

# Step 2: Seed database
Write-Host "`n[2/3] Seeding database with priority matrix items..." -ForegroundColor Yellow
npm run seed-db

if ($LASTEXITCODE -ne 0) {
    Write-Host "Database seeding failed. Trying with pnpm..." -ForegroundColor Yellow
    pnpm seed-db
}

# Step 3: Start dev server
Write-Host "`n[3/3] Starting development server..." -ForegroundColor Yellow
Write-Host "`nSetup complete! 🎉" -ForegroundColor Green
Write-Host "`nThe development server will start shortly." -ForegroundColor Green
Write-Host "Visit http://localhost:3000 to view your site." -ForegroundColor Cyan
Write-Host "`nPress Ctrl+C to stop the server." -ForegroundColor Gray

npm run dev
