@echo off
title Stop StockApp
color 0C

echo ==========================================
echo Stopping StockApp
echo ==========================================
echo.

docker compose down

echo.
echo StockApp has been stopped.
echo.

pause