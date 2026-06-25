@echo off
title Running React + Tailwind Project
if not exist "%~dp0package.json" (
    echo ===================================================
    echo ERROR: Please EXTRACT the ZIP file before running!
    echo ===================================================
    pause
    exit /b
)
if not exist node_modules (
    echo ===================================================
    echo Installing dependencies (optimized for speed)...
    echo ===================================================
    call npm install --prefer-offline --no-audit --no-fund --quiet
) else (
    echo Dependencies already installed. Skipping install step...
)
echo ===================================================
echo Launching development server...
echo ===================================================
call npm run dev -- --open
