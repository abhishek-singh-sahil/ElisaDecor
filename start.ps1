# Elisa Decor Localhost Workspace Launcher

$ErrorActionPreference = "Stop"

# 1. Start MongoDB database instance if not already active
$mongoRunning = Get-Process -Name mongod -ErrorAction SilentlyContinue
if (-not $mongoRunning) {
    Write-Host "[1/3] Locating MongoDB server installation..." -ForegroundColor Cyan
    $mongodFile = Get-ChildItem -Path "C:\Program Files\MongoDB" -Filter "mongod.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1

    if (-not $mongodFile) {
        Write-Host "ERROR: Could not find MongoDB installation in C:\Program Files\MongoDB." -ForegroundColor Red
        Write-Host "Please ensure MongoDB Community Server is installed on your machine." -ForegroundColor Yellow
        Exit
    }

    Write-Host "Found MongoDB at: $($mongodFile.FullName)" -ForegroundColor Green
    Write-Host "Starting local MongoDB instance with database path E:\Elisadecor\mongodb_data on port 27017..." -ForegroundColor Cyan
    
    New-Item -ItemType Directory -Force -Path "E:\Elisadecor\mongodb_data" -ErrorAction SilentlyContinue | Out-Null
    
    # Start mongod in background
    Start-Process -FilePath $mongodFile.FullName -ArgumentList "--dbpath E:\Elisadecor\mongodb_data --port 27017" -WindowStyle Hidden
    
    # Wait for database startup
    Start-Sleep -Seconds 3
    Write-Host "[OK] MongoDB started." -ForegroundColor Green
} else {
    Write-Host "[1/3] MongoDB instance is already active and running." -ForegroundColor Green
}

# 2. Check if we need to seed database (if admin user count is 0)
$dbCheck = "0"
try {
    $dbCheck = node server/scripts/checkDb.js
} catch {
    $dbCheck = "-1"
}

if ($dbCheck -eq "0") {
    Write-Host "[2/3] Database collections empty. Seeding defaults..." -ForegroundColor Cyan
    node server/scripts/seed.js
    Write-Host "[OK] Database seeded." -ForegroundColor Green
} else {
    Write-Host "[2/3] Database check passed (records initialized)." -ForegroundColor Green
}

# 3. Launch Development Servers
Write-Host "[3/3] Booting backend Express API server and React Vite Client..." -ForegroundColor Cyan
Write-Host "Press Ctrl+C inside this console window to terminate both servers." -ForegroundColor Yellow
Write-Host "--------------------------------------------------------" -ForegroundColor DarkGray

# Start Express Server
$serverProc = Start-Process -FilePath "npm.cmd" -ArgumentList "run dev" -WorkingDirectory "E:\Elisadecor\server" -PassThru -NoNewWindow

# Start Vite Client
$clientProc = Start-Process -FilePath "npm.cmd" -ArgumentList "run dev" -WorkingDirectory "E:\Elisadecor\client" -PassThru -NoNewWindow

# Handle cleanup on break
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    Write-Host "--------------------------------------------------------" -ForegroundColor DarkGray
    Write-Host "Shutting down development servers..." -ForegroundColor Red
    if ($serverProc -and -not $serverProc.HasExited) {
        Stop-Process -Id $serverProc.Id -Force -ErrorAction SilentlyContinue
    }
    if ($clientProc -and -not $clientProc.HasExited) {
        Stop-Process -Id $clientProc.Id -Force -ErrorAction SilentlyContinue
    }
    Write-Host "[OK] Development servers stopped cleanly." -ForegroundColor Green
}
