@echo off
title HomeDecor Buyer Finder (Dev Mode)
echo =======================================================
echo     Starting HomeDecor Buyer Finder (Dev Server + Client)
echo =======================================================
echo.
start "Server API" cmd /k "cd server && npm run dev"
timeout /t 2 /nobreak >nul
start "Client Vite" cmd /k "cd client && npm run dev"
timeout /t 3 /nobreak >nul
start "" "http://localhost:5173"
