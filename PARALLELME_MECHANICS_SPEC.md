# ParallelMe - Mechanics Spec

Este documento traduce el horizonte de producto en mecanicas implementables. Complementa `PARALLELME_NORTH_STAR.md`.

Regla general para implementadores:

> Ante cualquier duda entre explicito y sutil, elegir sutil.

Ninguna mecanica debe anunciarse, explicarse ni confirmarse en la UI. Si una implementacion hace que el usuario entienda el sistema, esta mal implementada.

## 0. Estado Tecnico Actual

Stack:

- Next.js 16.2.7 App Router.
- TypeScript.
- Zustand.
- Tailwind CSS.
- Vercel.

Archivos relevantes:

```text
app/
components/
lib/mock.ts
lib/store.ts
lib/timeline.ts
```

Ya existe:

- Signal Deck en la home.
- Motor local simple de timeline en `lib/timeline.ts`.
- Inicio local guardado con `localStorage`.
- Senales desbloqueadas por tiempo.
- Mensajes desbloqueados por tiempo.
- Nav sin crear presencia.

## 1. Motor De Presencia

### Objetivo

Registrar comportamiento del usuario localmente, sin backend, para que el mundo pueda reaccionar sin explicar nada.

### Archivo Sugerido

```text
lib/presence.ts
```

### Tipo Base

```ts
export type ShapeName = "circle" | "square" | "triangle";

export type PresenceLog = {
  visits: { ts: number; durationMs?: number }[];
  signalViews: Record<string, { count: number; totalMs: number; lastTs: number }>;
  lastVisitTs: number;
  firstVisitTs: number;
  shapeTouches: { shape: ShapeName; ts: number }[];
  lastIntimateInterventionTs?: number;
  expiredSignalIds: string[];
};
```

### Reglas

- Registrar visita al montar la app.
- Debounce de 30 minutos: dos aperturas en menos de 30 minutos cuentan como una sesion.
- Registrar duracion aproximada de sesion cuando sea posible.
- Registrar tiempo visible por senal.
- No mostrar estos datos al usuario.
- No mandar nada a backend.

### Funciones Sugeridas

```ts
getPresenceLog(): PresenceLog
savePresenceLog(log: PresenceLog): void
registerVisit(): void
registerSignalView(signalId: string, durationMs: number): void
registerShapeTouch(shape: ShapeName): void
getAbsenceDays(): number
isNightOwl(): boolean
getMostWatchedCharacter(signalToAgent: Record<string, string>): string | null
getDominantVisitWindow(): "madrugada" | "manana" | "tarde" | "noche"
canTriggerIntimateIntervention(): boolean
markIntimateIntervention(): void
```

### Ventanas Horarias

```text
madrugada: 01:00-04:59
manana: 05:00-11:59
tarde: 12:00-18:59
noche: 19:00-00:59
```

## 2. Eco De Atencion

### Objetivo

Que el usuario sospeche, en la primera o segunda sesion, que su atencion modifico algo.

### Trigger

Un personaje se considera `attended` si:

- el tiempo total sobre sus senales es al menos 2x el del segundo mas observado;
- y el minimo total es 20 segundos.

### Implementacion En Datos

Agregar campos opcionales a `Signal`:

```ts
echoVariant?: string;
echoForAgentId?: string;
```

O, si se prefiere separar datos:

```ts
type SignalVariant = {
  signalId: string;
  agentId: string;
  text: string;
  subtext?: string;
};
```

### Regla Visual

La variante eco debe verse identica a la senal base.

Prohibido:

- badge;
- highlight;
- "eco";
- "Lucas te noto";
- "tu atencion influyo".

### Ejemplo

Base:

```text
Entrevista a las 11. Me planche la unica camisa que tengo con la pava.
```

Eco:

```text
Entrevista a las 11. Antes de salir mire la puerta un rato. No se que esperaba.
```

## 3. Senales Efimeras

### Objetivo

Que la ausencia tenga costo real sin usar FOMO clasico.

### Campos Nuevos

Agregar a `Signal`:

```ts
ephemeral?: boolean;
expiresInHours?: 24 | 48;
visibleFromTs?: number;
```

`visibleFromTs` puede calcularse por usuario y persistirse en `localStorage`.

### Reglas

- Maximo 1 o 2 senales efimeras por semana.
- No avisar que expiran.
- No mostrar countdown.
- No permitir recuperarlas.
- Si expiran sin ser vistas, reemplazar por un hueco persistente.

### Huecos

Tipo sugerido:

```ts
type MissingSignal = {
  id: string;
  kind: "missing";
  text: "Hubo algo aca." | "Ya no esta.";
};
```

Copy permitida:

```text
Hubo algo aca.
```

```text
Ya no esta.
```

## 4. Bifurcacion Semanal Con Formas

### Objetivo

Ritual irreversible con consecuencia ambigua.

### Formas

```text
○ □ △
```

Internamente:

```ts
type ShapeName = "circle" | "square" | "triangle";
```

### Aparicion

- Una vez por semana.
- Disponible desde un horario fijo o por trigger editorial.
- Aparece como interludio dentro del deck.
- Sin titulo.
- Sin texto.
- Sin boton de confirmar.

### Interaccion

- El usuario toca una forma.
- Se guarda en `shapeTouches`.
- El interludio desaparece.
- No hay sonido.
- No hay celebracion.
- No hay explicacion.
- No se puede deshacer.

### Ramas En Timeline

Eventos futuros pueden declarar rama:

```ts
type TimelineBranch = {
  shape: ShapeName | "default";
  weekOf: string; // YYYY-MM-DD
};
```

Ejemplo:

```ts
{
  id: "lucas-week-2-circle",
  unlockAfterMinutes: 10080,
  branch: { shape: "circle", weekOf: "2026-06-15" },
  signalIds: ["lucas-12-circle"]
}
```

### Prohibido

- explicar que hacen las formas;
- confirmar eleccion;
- permitir multiples elecciones semanales;
- mostrar historial de formas;
- usar tooltips.

## 5. Intervenciones Intimas

### Objetivo

Que el mundo parezca conocer ritmos del usuario.

### Regla Dura

```text
maximo 1 intervencion intima cada 30 dias
```

Guardar:

```ts
lastIntimateInterventionTs
```

### 5a. Senal Nocturna

Trigger:

- `isNightOwl() === true`;
- visita actual entre 01:00 y 04:59;
- cooldown de 30 dias libre;
- no disparada antes para este usuario.

Accion:

- insertar una senal especial de un pool `nocturnas`.

Ejemplo:

```text
No puedo dormir. Se me dio por pensar que capaz alguien mas anda despierto a esta hora, mirando cosas que no le pasan a el.
```

### 5b. Cicatrices De Ausencia

Trigger:

- `getAbsenceDays() >= 6`;
- cooldown libre.

Acciones:

1. Una senal de un personaje menciona un vacio reciente sin dirigirse al usuario.
2. Un hueco aparece en el deck.
3. Una micro-senal sin autor aparece casi escondida:

```text
Volvio.
```

### Prohibido

- "te extranamos";
- "mira lo que te perdiste";
- emojis;
- push agresivo;
- mencionar dias exactos de ausencia;
- mencionar horarios exactos del usuario.

## 6. Sexto Personaje

### Objetivo

La mecanica madre de largo plazo: una presencia que se parece demasiado al usuario.

### Onboarding Oblicuo

Tres preguntas, una por pantalla:

```text
Que ciudad casi elegiste y no?
```

```text
Que dejaste de hacer hace anos?
```

```text
Que decision todavia no tomaste?
```

Reglas:

- texto libre;
- opcional;
- se puede saltear;
- guardar respuestas crudas en `localStorage`;
- no usar IA;
- no validar.

Tipo sugerido:

```ts
type UserSeeds = {
  cityAlmostChosen?: string;
  abandonedPractice?: string;
  pendingDecision?: string;
  createdAt: number;
};
```

### Comportamiento

- No tiene nombre.
- No tiene avatar.
- No tiene perfil.
- Sus senales se ven apenas mal sintonizadas.
- Empieza recien en semana 3 o mas.
- Frecuencia bajisima: 1 cada 7 a 10 dias.
- Usa plantillas con slots, de forma indirecta.

Ejemplo:

```text
Mande un CV en {ciudad}. No se por que tarde tanto.
```

### Prohibido

- revelar quien es;
- llamarlo "tu paralelo";
- usar respuestas del onboarding inmediatamente;
- usar respuestas de forma literal si queda demasiado obvio;
- darle perfil.

## 7. Glitch Compartido

No implementar ahora.

Futuro con backend minimo:

- contar espectadores por senal en ventanas de 10 minutos;
- si N usuarios miran la misma senal, todos ven el mismo glitch.

Sin registro visible. Sin anuncio.

## 8. Regla Editorial Para Senales

Cada senal nueva debe cumplir:

1. Vida concreta primero, significado despues.
2. Nunca neutral: planta un hilo nuevo o riega uno viejo.
3. No cerrar completamente su tema.
4. No sonar a chatbot.
5. Mantener proporcion 80/20: cotidiano primero, rareza despues.

Ejemplo de senal mala:

```text
Hoy comprendi que mi pasado todavia me persigue.
```

Ejemplo mejor:

```text
No atendi a mi hermana. Despues puse el celular boca abajo como si eso fuera una decision.
```

## 9. Orden De Implementacion Recomendado

1. `lib/presence.ts`.
2. Registro real de visitas y signal views.
3. Eco de atencion.
4. Reescritura narrativa de `lib/mock.ts`.
5. Ajuste de `lib/timeline.ts` para primera semana curada.
6. Senales efimeras + huecos.
7. Formas semanales.
8. Onboarding oblicuo.
9. Reglas preparadas para intervenciones intimas.
10. Sexto personaje en semana 3+.
11. Glitch compartido solo cuando haya backend y usuarios.

## 10. Checklist Antes De Merge

- Ninguna copy explica el sistema.
- Ninguna copy menciona IA.
- Ninguna copy dice "desbloqueaste".
- No hay badges, contadores ni recompensas visibles.
- Las intervenciones intimas respetan cooldown de 30 dias.
- Las senales efimeras no superan 2 por semana.
- Los datos de presencia nunca se muestran literalmente.
- TypeScript estricto.
- Sin dependencias nuevas salvo necesidad real.
- App Router respetado.
- Docs locales de Next 16 revisadas antes de tocar framework.
- Pregunta final respondida:

```text
esto rompe la ficcion o hace que el mundo se sienta mas vivo?
```

