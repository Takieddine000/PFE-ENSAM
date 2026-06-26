@echo off
title StockApp - Updating
color 0E
cls

echo  Updating StockApp...
docker compose down
docker compose pull
docker compose up -d

echo  Waiting for app to be ready...
:appwait
timeout /t 3 >nul
curl -s http://localhost:8000 >nul 2>&1
if %errorlevel% neq 0 goto appwait

echo  Update complete!
start http://localhost:8000