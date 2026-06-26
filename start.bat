@echo off
title StockApp
color 0A
cls

echo  ==========================================
echo          StockApp - Starting...
echo  ==========================================
echo.

docker -v >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Docker is not installed.
    echo  Please install from: https://www.docker.com/products/docker-desktop
    pause
    exit
)

docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo  Starting Docker Desktop...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    echo  Waiting for Docker to start...
    :waitloop
    timeout /t 5 >nul
    docker info >nul 2>&1
    if %errorlevel% neq 0 goto waitloop
    echo  Docker is ready.
    echo.
)

echo  Downloading latest version...
docker compose pull >nul 2>&1

echo  Starting StockApp...
docker compose up -d

echo  Waiting for app to be ready...
:appwait
timeout /t 3 >nul
curl -s http://localhost:8000 >nul 2>&1
if %errorlevel% neq 0 goto appwait

echo.
echo  ==========================================
echo   StockApp is running!
echo   Login: admin@stock.com / password
echo  ==========================================
echo.
start http://localhost:8000