@echo off

if "%de_srv%"=="" goto invalido
if "%de_usr%"=="" goto invalido
if "%de_pwd%"=="" goto invalido
if "%de_url%"=="" goto invalido

if "%para_srv%"=="" goto invalido
if "%para_usr%"=="" goto invalido
if "%para_pwd%"=="" goto invalido
if "%para_url%"=="" goto invalido

::::::::::::::::::::::::::::::::
::::::::::::::::::::::::::::::::
::::::::::::::::::::::::::::::::

echo Script de %de_usr% para %para_usr%
echo.

echo Baixando database: %de_usr%
echo.

mysqldump -u %de_usr% -p%de_pwd% -h %de_srv% --databases %de_usr% > %de_usr%.sql

::::::::::::::::::::::::::::::::

echo Criando script de insert: %para_usr%
echo.

echo Set objFSO = CreateObject("Scripting.FileSystemObject") >> %para_usr%_criar_sql.vbs
echo Set objFile = objFSO.OpenTextFile("%de_usr%.sql") >> %para_usr%_criar_sql.vbs
echo strText = objFile.ReadAll >> %para_usr%_criar_sql.vbs
echo objFile.Close >> %para_usr%_criar_sql.vbs
echo strText = Replace(strText, "%de_usr%", "%para_usr%") >> %para_usr%_criar_sql.vbs
echo strText = Replace(strText, "%de_url%", "%para_url%") >> %para_usr%_criar_sql.vbs
echo Set objFile = objFSO.CreateTextFile("%para_usr%.sql") >> %para_usr%_criar_sql.vbs
echo objFile.WriteLine strText >> %para_usr%_criar_sql.vbs
echo objFile.Close >> %para_usr%_criar_sql.vbs
%para_usr%_criar_sql.vbs
del %para_usr%_criar_sql.vbs
del %de_usr%.sql

::::::::::::::::::::::::::::::::

echo Limpando database: %para_usr%
echo.

echo DROP DATABASE IF EXISTS %para_usr%; > %para_usr%_drop.sql
mysql -u %para_usr% -p%para_pwd% -h %para_srv% < %para_usr%_drop.sql
del %para_usr%_drop.sql

::::::::::::::::::::::::::::::::

echo Criando database: %para_usr%
echo.

mysql -u %para_usr% -p%para_pwd% -h %para_srv% < %para_usr%.sql
del %para_usr%.sql

::::::::::::::::::::::::::::::::
::::::::::::::::::::::::::::::::
::::::::::::::::::::::::::::::::

goto fim
:invalido

echo Variaveis nao foram inicializadas.
echo.

:fim

set de_srv=
set de_usr=
set de_pwd=
set de_url=
set para_srv=
set para_usr=
set para_pwd=
set para_url=

echo Script finalizado.
echo.

choice /T 5 /C sn /D s /N > nul
