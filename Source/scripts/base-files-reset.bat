@echo off

if "%srv%"=="" goto invalido
if "%usr%"=="" goto invalido
if "%pwd%"=="" goto invalido

::::::::::::::::::::::::::::::::
::::::::::::::::::::::::::::::::
::::::::::::::::::::::::::::::::

echo Script para: %usr%
echo.

cd ..\code

::::::::::::::::::::::::::::::::

echo Remove wordpress.
echo.

move .\wordpress\wp-config.php .\
move .\wordpress\web.config .\

rmdir /q/s .\wordpress\skript
rmdir /q/s .\wordpress\wp-admin
rmdir /q/s .\wordpress\wp-content
rmdir /q/s .\wordpress\wp-includes
del /q .\wordpress\*.*

move .\wp-config.php .\wordpress
move .\web.config .\wordpress

::::::::::::::::::::::::::::::::

echo Espera de seguranca de 5 segundos antes de copiar o Wordpress...
echo.

choice /T 5 /C sn /D s /N > nul

::::::::::::::::::::::::::::::::

echo Unzip Wordpress.
echo.

"c:\Program Files\7-Zip\7z.exe" x downloads\wordpress.zip

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
