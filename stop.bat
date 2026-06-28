@echo off
title Stop StockApp

echo Stopping StockApp...

docker compose down

echo.
echo StockApp stopped.
pause