@echo off
setlocal EnableExtensions
cd /d "%~dp0"

echo.
echo ============================================
echo   ParallelMe - subir todo a GitHub/Vercel
echo ============================================
echo.

where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Git no esta instalado o no esta en el PATH.
    echo Instala Git y volve a ejecutar este archivo.
    pause
    exit /b 1
)

where npm.cmd >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node/npm no esta instalado o no esta en el PATH.
    echo Instala Node.js y volve a ejecutar este archivo.
    pause
    exit /b 1
)

if not exist ".git" (
    echo Configurando repositorio por primera vez...
    git init
    git branch -M main
    git remote add origin https://github.com/anuelisimo/parallelme.git
)

git remote set-url origin https://github.com/anuelisimo/parallelme.git

if not exist "node_modules" (
    echo.
    echo Instalando dependencias...
    call npm.cmd ci --cache .npm-cache
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo ERROR: No se pudieron instalar las dependencias.
        pause
        exit /b 1
    )
)

echo.
echo Probando build de produccion...
call npm.cmd run build
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: El build fallo. Arregla ese error antes de subir a Vercel.
    pause
    exit /b 1
)

echo.
echo Preparando cambios...
git add -A
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Git no pudo preparar los archivos.
    pause
    exit /b 1
)

git diff --cached --quiet
if %ERRORLEVEL% EQU 0 (
    echo.
    echo No hay cambios nuevos para subir.
) else (
    echo.
    echo Guardando cambios...
    git commit -m "Update ParallelMe for Vercel"
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo ERROR: Git no pudo crear el commit.
        pause
        exit /b 1
    )
)

echo.
echo Subiendo a GitHub...
git push -u origin main
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: No se pudo subir.
    echo Si GitHub abre una ventana, inicia sesion y ejecuta este BAT otra vez.
    echo Si dice que el remoto tiene cambios, avisame y lo arreglamos sin usar force.
    pause
    exit /b 1
)

echo.
echo ============================================
echo   Listo. GitHub actualizado.
echo   Vercel deberia redeployar en 1-2 minutos.
echo ============================================
echo.
pause
