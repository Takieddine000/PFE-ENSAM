@echo off
title StockApp Updater
color 0B

echo ==========================================
echo          Updating StockApp
echo ==========================================
echo.

:: Check Docker
docker info >nul 2>&1

if errorlevel 1 (
    echo Docker Desktop is not running.
    echo Please start Docker Desktop first.
    pause
    exit /b 1
)

echo.
echo Stopping current version...
docker compose -p stock-app down --remove-orphans

echo.
echo Removing old image...
docker image rm -f takieddine2004/stockapp:latest >nul 2>&1

echo.
echo Downloading latest version...
docker pull takieddine2004/stockapp:latest

if errorlevel 1 (
    echo.
    echo Failed to download the latest version.
    pause
    exit /b 1
)

echo.
echo Starting latest version...
docker compose -p stock-app up -d

if errorlevel 1 (
    echo.
    echo Failed to start StockApp.
    pause
    exit /b 1
)

echo.
echo Waiting for application...
timeout /t 10 >nul

start http://localhost:8000

cls

echo ==========================================
echo     StockApp Updated Successfully
echo ==========================================
echo.
echo URL
echo ------------------------------------------
echo http://localhost:8000
echo.
echo Administrator Account
echo ------------------------------------------
echo Email    : admin@stock.com
echo Password : password
echo.
echo ==========================================

pause