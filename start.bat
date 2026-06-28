@echo off
title StockApp Launcher
color 0A

echo ==========================================
echo          StockApp Launcher
echo ==========================================
echo.

echo Checking Docker...

docker version >nul 2>&1
if errorlevel 1 (
    echo.
    echo Docker Desktop is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b
)

echo.
echo Downloading latest StockApp image...
docker pull takieddine2004/stockapp:latest

if errorlevel 1 (
    echo.
    echo Failed to download Docker image.
    pause
    exit /b
)

echo.
echo Starting application...
docker compose up -d

if errorlevel 1 (
    echo.
    echo Failed to start application.
    pause
    exit /b
)

echo.
echo Waiting for application...
timeout /t 20 >nul

start http://localhost:8000

cls

echo ==========================================
echo          StockApp Started
echo ==========================================
echo.
echo URL:
echo.
echo      http://localhost:8000
echo.
echo ------------------------------------------
echo Administrator Account
echo ------------------------------------------
echo Email    : admin@stock.com
echo Password : password
echo ------------------------------------------
echo.

pause