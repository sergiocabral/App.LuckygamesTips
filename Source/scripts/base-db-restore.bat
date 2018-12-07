@echo off

if "%srv%"=="" goto invalido
if "%usr%"=="" goto invalido
if "%pwd%"=="" goto invalido

::::::::::::::::::::::::::::::::
::::::::::::::::::::::::::::::::
::::::::::::::::::::::::::::::::

echo Script para: %usr%
echo.

cd ..\database

echo DROP DATABASE...
echo.

echo DROP DATABASE IF EXISTS %usr%; > drop.sql
mysql -u %usr% -p%pwd% -h %srv% < drop.sql
del drop.sql

echo CREATE DATABASE...
echo.

mysql -u %usr% -p%pwd% -h %srv% < %usr%.sql

::::::::::::::::::::::::::::::::
::::::::::::::::::::::::::::::::
::::::::::::::::::::::::::::::::

goto fim
:invalido

echo Variaveis nao foram inicializadas.
echo.

:fim

set srv=
set usr=
set pwd=

echo Script finalizado.
echo.

choice /T 5 /C sn /D s /N > nul
