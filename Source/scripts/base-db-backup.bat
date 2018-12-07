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

del %usr%.sql

echo MYSQLDUMP...
echo.

mysqldump -u %usr% -p%pwd% -h %srv% --databases %usr% > %usr%.sql

dir

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
