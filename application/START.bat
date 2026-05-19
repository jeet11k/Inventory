@echo off
REM ========================================
REM Inventory Management System Startup
REM ========================================

cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║   Inventory Management System - Authentication Edition     ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

cd /d "D:\Jeet\Python Project\application"

echo [*] Checking for node_modules...
if not exist node_modules (
    echo [!] Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo [ERROR] NPM install failed!
        pause
        exit /b 1
    )
    echo [✓] Dependencies installed
) else (
    echo [✓] Dependencies found
)

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                   Starting Server...                       ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

npm start

REM Keep console open if server crashes
pause
