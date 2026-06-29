@echo off
setlocal

title StockApp Launcher
color 0A

echo ==========================================
echo          StockApp Launcher
echo ==========================================
echo.

:: --------------------------------------------
:: Check Docker Desktop
:: --------------------------------------------
docker info >nul 2>&1

if errorlevel 1 (
    echo Docker Desktop is not running.
    echo.
    echo Please start Docker Desktop then run this file again.
    pause
    exit /b 1
)

:: --------------------------------------------
:: Stop previous StockApp
:: --------------------------------------------
echo Stopping previous StockApp...
docker compose -p stock-app down --remove-orphans >nul 2>&1

:: --------------------------------------------
:: Pull latest image
:: --------------------------------------------
echo.
echo Downloading latest version...
docker pull takieddine2004/stockapp:latest

if errorlevel 1 (
    echo.
    echo Failed to download image.
    pause
    exit /b 1
)

:: --------------------------------------------
:: Start application
:: --------------------------------------------
echo.
echo Starting StockApp...
docker compose -p stock-app up -d

if errorlevel 1 (
    echo.
    echo Failed to start StockApp.
    pause
    exit /b 1
)

:: --------------------------------------------
:: Wait until app container is running
:: --------------------------------------------
echo.
echo Waiting for application...

set COUNT=0

:WAIT

for /f %%i in ('docker inspect -f "{{.State.Running}}" stock-app-app-1 2^>nul') do (
    if "%%i"=="true" goto READY
)

set /a COUNT+=1

if %COUNT% GEQ 60 (
    echo.
    echo StockApp failed to start.
    echo.
    docker compose -p stock-app logs app --tail=50
    pause
    exit /b 1
)

timeout /t 2 >nul
goto WAIT

:READY

timeout /t 5 >nul

start http://localhost:8000

cls

echo ==========================================
echo        StockApp Started Successfully
echo ==========================================
echo.
echo URL
echo ------------------------------------------
echo http://localhost:8000
echo.
echo Administrator Account
echo ------------------------------------------
echo Email    : admin@stock.com
echo Password : password
echo.
echo ==========================================

pause