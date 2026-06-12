@echo off
setlocal EnableExtensions
cd /d "%~dp0"

echo.
echo ============================================
echo   ParallelMe - subir cambios online ahora
echo ============================================
echo.

where git >nul 2>nul
if errorlevel 1 (
    echo ERROR: Git no esta instalado o no esta en el PATH.
    pause
    exit /b 1
)

where npm.cmd >nul 2>nul
if errorlevel 1 (
    echo ERROR: Node/npm no esta instalado o no esta en el PATH.
    pause
    exit /b 1
)

echo.
echo Probando que la app compile...
call npm.cmd run build
if errorlevel 1 (
    echo.
    echo ERROR: El build fallo. No se sube nada.
    pause
    exit /b 1
)

echo.
echo Preparando cambios...
git add -A
if errorlevel 1 (
    echo.
    echo ERROR: Git no pudo preparar los archivos.
    pause
    exit /b 1
)

git diff --cached --quiet
if %ERRORLEVEL% EQU 0 (
    echo.
    echo No hay cambios nuevos para guardar. Intento subir igual...
) else (
    echo.
    echo Guardando cambios...
    git commit -m "Add ParallelMe atmosphere visuals"
    if errorlevel 1 (
        echo.
        echo ERROR: Git no pudo crear el commit.
        echo Si ves que el commit SI se creo arriba, ejecuta despues: git push -u origin main
        pause
        exit /b 1
    )
)

echo.
echo Subiendo a GitHub...
git push -u origin main
if errorlevel 1 (
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
echo   URL: https://parallelme-orpin.vercel.app/
echo ============================================
echo.
pause
