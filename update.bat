@echo off
title Update StockApp

echo Updating StockApp...

docker compose down

docker load -i stockapp.tar

docker compose up -d

timeout /t 20 >nul

start http://localhost:8000

echo.
echo Update complete.
pause