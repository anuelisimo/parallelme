@echo off
setlocal
cd /d "C:\Mis APP\ParallelMe"

echo.
echo ============================================
echo   ParallelMe - limpiar y subir a GitHub
echo ============================================
echo.

:: Borrar archivos que no deben subirse
if exist ".npm-cache" rmdir /s /q .npm-cache
if exist "node_modules" rmdir /s /q node_modules
if exist "next.config.mjs" del /f next.config.mjs
if exist "dev-server.log" del /f dev-server.log
if exist "dev-server.err.log" del /f dev-server.err.log
if exist ".next" rmdir /s /q .next
if exist "src" rmdir /s /q src

:: Asegurarse de que next.config.ts existe y es correcto
echo /** @type {import('next').NextConfig} */ > next.config.ts
echo const nextConfig = {}; >> next.config.ts
echo module.exports = nextConfig; >> next.config.ts

:: Borrar git local
if exist ".git" (
    echo Limpiando git anterior...
    rmdir /s /q .git
)

:: Inicializar git limpio
echo Inicializando repositorio limpio...
git init
git remote add origin https://github.com/anuelisimo/parallelme.git
git branch -M main

:: Agregar todo
echo Preparando archivos...
git add .

:: Commit
echo Guardando cambios...
git commit -m "ParallelMe v2 - fixed config"

:: Subir
echo.
echo Subiendo a GitHub...
git push -u origin main --force
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo No se pudo subir. Inicia sesion en GitHub si aparece una ventana.
    echo.
    pause
    exit /b 1
)

echo.
echo ============================================
echo   Listo. Subido correctamente.
echo   Vercel actualiza en 1-2 minutos.
echo   https://parallelme-orpin.vercel.app
echo ============================================
echo.
pause
