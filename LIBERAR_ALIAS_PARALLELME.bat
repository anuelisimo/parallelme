@echo off
setlocal EnableExtensions
cd /d "%~dp0"

echo.
echo ============================================
echo   ParallelMe - liberar parallelme.vercel.app
echo ============================================
echo.
echo Este asistente revisa aliases de Vercel en el scope activo.
echo Si encuentra parallelme.vercel.app, te pregunta antes de removerlo.
echo.

where npm.cmd >nul 2>nul
if errorlevel 1 (
    echo ERROR: Node/npm no esta instalado o no esta en el PATH.
    pause
    exit /b 1
)

echo Instalando/ejecutando Vercel CLI...
call npm.cmd exec --yes --cache .npm-cache vercel -- --version
if errorlevel 1 (
    echo.
    echo ERROR: No se pudo ejecutar Vercel CLI.
    echo Proba abrir este archivo de nuevo, o instala Vercel CLI con:
    echo npm install -g vercel
    pause
    exit /b 1
)

echo.
echo Revisando sesion actual...
call npm.cmd exec --yes --cache .npm-cache vercel -- whoami
if errorlevel 1 (
    echo.
    echo No hay sesion activa. Se abrira login de Vercel.
    call npm.cmd exec --yes --cache .npm-cache vercel -- login
    if errorlevel 1 (
        echo.
        echo ERROR: No se pudo iniciar sesion en Vercel.
        pause
        exit /b 1
    )
)

:CHECK_SCOPE
echo.
echo ============================================
echo   Scope actual
echo ============================================
call npm.cmd exec --yes --cache .npm-cache vercel -- whoami
echo.
echo Listando aliases del scope actual...
call npm.cmd exec --yes --cache .npm-cache vercel -- alias list
echo.

echo Si arriba aparece parallelme.vercel.app, podes removerlo ahora.
choice /C SN /M "Remover parallelme.vercel.app de este scope"
if errorlevel 2 goto SWITCH_SCOPE

echo.
echo Removiendo alias...
call npm.cmd exec --yes --cache .npm-cache vercel -- alias remove parallelme.vercel.app
if errorlevel 1 (
    echo.
    echo No se pudo remover en este scope. Puede estar en otro scope/cuenta.
) else (
    echo.
    echo Alias removido correctamente.
    echo Ahora entra a Vercel Dashboard, proyecto parallelme, Domains, y agrega:
    echo parallelme.vercel.app
    pause
    exit /b 0
)

:SWITCH_SCOPE
echo.
echo Si tenes otra cuenta/team viejo, cambia de scope y volve a revisar.
choice /C SN /M "Cambiar de scope con vercel switch"
if errorlevel 2 goto END

call npm.cmd exec --yes --cache .npm-cache vercel -- switch
if errorlevel 1 (
    echo.
    echo No se pudo cambiar de scope.
    pause
    exit /b 1
)
goto CHECK_SCOPE

:END
echo.
echo Si no aparece en ningun scope tuyo, completa el formulario de soporte de Vercel.
echo Texto clave: "parallelme.vercel.app is assigned to a different account scope or deleted project".
echo.
pause
