@echo off
title Update StockApp
color 0B

echo ==========================================
echo Updating StockApp
echo ==========================================
echo.

docker compose down

docker pull takieddine2004/stockapp:latest

docker compose up -d

timeout /t 20 >nul

start http://localhost:8000

echo.
echo StockApp updated successfully.
echo.

pause