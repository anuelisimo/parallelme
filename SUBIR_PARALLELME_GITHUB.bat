@echo off
setlocal
cd /d "C:\Mis APP\ParallelMe"

echo.
echo ============================================
echo   ParallelMe - subir cambios a GitHub
echo ============================================
echo.

:: Inicializar git si no existe
if not exist ".git" (
    echo Configurando repositorio por primera vez...
    git init
    git remote add origin https://github.com/anuelisimo/parallelme.git
    git branch -M main
)

:: Asegurar que el remote es correcto
git remote set-url origin https://github.com/anuelisimo/parallelme.git

echo Preparando archivos...
git add .

echo.
echo Guardando cambios...
git commit -m "Update ParallelMe"
if %ERRORLEVEL% NEQ 0 (
    echo No hay cambios nuevos para subir.
    echo.
    pause
    exit /b 0
)

echo.
echo Subiendo a GitHub...
git push -u origin main --force
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo No se pudo subir. Puede que necesites iniciar sesion en GitHub.
    echo Si aparece una ventana de GitHub, inicia sesion y volve a ejecutar.
    echo.
    pause
    exit /b 1
)

echo.
echo ============================================
echo   Listo. Subido a GitHub correctamente.
echo   Vercel actualiza la web en 1-2 minutos.
echo ============================================
echo.
pause
