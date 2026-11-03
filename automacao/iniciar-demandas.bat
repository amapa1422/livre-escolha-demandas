@echo off
title LivreEscolha - Servidor Demandas

cd /d "C:\Users\felipe.lobato\Desktop\Demandas\backend"

:iniciar
echo Iniciando servidor Demandas...

"C:\Program Files\nodejs\node.exe" src\server.js

echo.
echo Servidor encerrado. Nova tentativa em 10 segundos.
timeout /t 10 /nobreak >nul
goto iniciar