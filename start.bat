@echo off
title StockApp Launcher
color 0A

echo ==========================================
echo           StockApp Launcher
echo ==========================================
echo.

docker image inspect takieddine2004/stockapp:latest >nul 2>&1

if errorlevel 1 (
    echo Loading Docker image...
    docker load -i stockapp.tar

    if errorlevel 1 (
        echo.
        echo Failed to load Docker image!
        pause
        exit /b
    )
)

echo.
echo Starting StockApp...
docker compose up -d

if errorlevel 1 (
    echo.
    echo Failed to start StockApp.
    pause
    exit /b
)

echo.
echo Waiting for application...
timeout /t 20 >nul

start http://localhost:8000

cls
echo ==========================================
echo          StockApp Ready
echo ==========================================
echo.
echo URL:
echo http://localhost:8000
echo.
echo Administrator Account
echo -----------------------------
echo Email    : admin@stock.com
echo Password : password
echo.
echo Close this window to keep the application running.
echo.

pause