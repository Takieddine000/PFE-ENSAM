@echo off
title StockApp - Stopping
color 0C
cls

echo  Stopping StockApp...
docker compose down

echo.
echo  StockApp stopped. Your data is saved.
pause