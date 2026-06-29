@echo off
title StockApp Stopper
color 0C

echo ==========================================
echo          Stopping StockApp
echo ==========================================
echo.

docker compose -p stock-app down --remove-orphans

if errorlevel 1 (
    echo.
    echo StockApp is not running or an error occurred.
    pause
    exit /b 1
)

echo.
echo StockApp has been stopped successfully.
echo.

pause