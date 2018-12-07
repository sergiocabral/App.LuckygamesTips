@echo off

if "%dir%"=="" goto invalido

::::::::::::::::::::::::::::::::
::::::::::::::::::::::::::::::::
::::::::::::::::::::::::::::::::

echo Copiando arquivos para: %dir%
echo.

::::::::::::::::::::::::::::::::

echo Removendo arquivos atuais.
echo.

rmdir /q/s ..\..\Webserver\%dir%
mkdir ..\..\Webserver\%dir%

::::::::::::::::::::::::::::::::

echo Copiando arquivos.
echo.

xcopy /s ..\code\wordpress\*.* ..\..\Webserver\%dir%

::::::::::::::::::::::::::::::::
::::::::::::::::::::::::::::::::
::::::::::::::::::::::::::::::::

goto fim
:invalido

echo Variaveis nao foram inicializadas.
echo.

:fim

set dir=

echo Script finalizado.
echo.

choice /T 5 /C sn /D s /N > nul
