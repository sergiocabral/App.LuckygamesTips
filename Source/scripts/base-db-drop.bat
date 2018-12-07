@echo off

if "%srv%"=="" goto invalido
if "%usr%"=="" goto invalido
if "%pwd%"=="" goto invalido

::::::::::::::::::::::::::::::::
::::::::::::::::::::::::::::::::
::::::::::::::::::::::::::::::::

echo Script para: %usr%
echo.

echo DROP DATABASE...
echo.

::::::::::::::::::::::::::::::::

echo Espera de seguranca de 5 segundos...
echo.

choice /T 5 /C sn /D s /N > nul

::::::::::::::::::::::::::::::::

echo DROP DATABASE IF EXISTS %usr%; > drop.sql
mysql -u %usr% -p%pwd% -h %srv% < drop.sql
del drop.sql

echo CREATE DATABASE...
echo.

echo CREATE DATABASE /*!32312 IF NOT EXISTS*/ `%usr%` /*!40100 DEFAULT CHARACTER SET utf8 */; > create.sql
mysql -u %usr% -p%pwd% -h %srv% < create.sql
del create.sql

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
