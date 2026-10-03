@echo off
title HomeDecor Buyer Finder
echo =======================================================
echo        HomeDecor Buyer Finder - Launching Application
echo =======================================================
echo.
echo Starting Express server on http://localhost:5000...
echo.

start "" "http://localhost:5000"
node server/server.js
pause
