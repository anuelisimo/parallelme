# ParallelMe - Contexto Para Claude

Este documento es el brief principal para entender ParallelMe antes de modificar el proyecto.

## 1. Que Es ParallelMe

ParallelMe no es una red social tradicional. Es una experiencia narrativa web donde el usuario observa vidas posibles.

La idea central:

> Instagram muestra vidas ajenas. ParallelMe muestra vidas posibles.

El usuario no publica, no busca likes, no comenta y no performa. Solo observa. Pero su observacion tiene peso.

La app debe sentirse como un mundo que ya existia antes de que el usuario entrara, pero que de algun modo registro su presencia.

## 2. Diferencia Con Instagram / TikTok

Instagram y TikTok son plataformas de performance: gente produciendo contenido para ser mirada.

ParallelMe debe sentirse distinto:

- No hay likes.
- No hay followers.
- No hay comentarios publicos.
- No hay creators.
- No hay feed infinito.
- No hay metricas visibles.
- No hay boton visible para crear personajes.
- No hay explicacion de IA.

El loop no es:

```text
siguiente video -> recompensa rapida -> siguiente video
```

El loop de ParallelMe es:

```text
senal -> sospecha -> relectura -> espera -> regreso
```

El usuario vuelve porque siente que algo minimo cambio mientras no estaba, o tal vez porque estuvo mirando.

## 3. Principio Narrativo

La app debe ser:

> menos dramatica que Babel, mas cotidiana.

No queremos tragedia constante ni frases demasiado literarias. Queremos vidas concretas atravesadas por pequenas grietas.

Regla de tono:

> Primero vida concreta. Despues significado.

Ejemplo demasiado literario:

```text
La ciudad parecia recordarme algo que yo todavia no habia vivido.
```

Ejemplo mejor:

```text
Mande CV para un deposito en Almada. Despues busque cuanto sale volver a Buenos Aires. Cerre las dos pestanas. Muy adulto todo.
```

El tono ideal es natural, humano, a veces gracioso, a veces seco, con misterio, pero no siempre poetico. Puede haber puteadas suaves, ironia, frases torpes, cansancio y humor cotidiano.

## 4. Como Habla ParallelMe

ParallelMe no debe hablar como una app. Debe hablar como un mundo que registra al usuario.

No:

```text
Nueva senal desbloqueada.
```

Si:

```text
Aparecio algo.
```

No:

```text
Tu actividad influyo en Lucas.
```

Si:

```text
Lucas volvio a mirar la puerta.
```

No:

```text
No hay contenido disponible.
```

Si:

```text
Nada todavia.
```

La app no debe explicar. Debe insinuar. El usuario debe sentir: "la app no me habla directamente, pero me nota".

## 5. Mecanicas Clave

### Observacion Con Consecuencia

El usuario mira una linea. Esa atencion modifica sutilmente lo que aparece despues.

Nunca decir:

```text
Tu observacion cambio la historia.
```

El usuario debe sospecharlo, no leerlo.

### Escasez

ParallelMe no debe mostrar todo de golpe. El contenido se desbloquea con el tiempo.

La ausencia tambien es contenido. Si no hay senales nuevas, eso significa algo.

### Relectura

El usuario deberia querer volver a mirar senales anteriores. Algo que antes parecia casual puede cobrar sentido despues.

### Glitch

El glitch es una ruptura minima de la interfaz. No debe parecer una feature. Debe parecer algo que se filtro.

Ejemplos:

- una frase que aparece y desaparece;
- una forma sin explicacion;
- una notificacion que no lleva a nada;
- una senal que parece cambiar.

Nunca confirmar ni negar el glitch.

### Formas

Futura mecanica de intervencion:

```text
○ □ △
```

El usuario toca una forma sin saber que hace. El mundo responde despues.

No es control directo. Es perturbacion.

## 6. Personajes Principales

Cada personaje necesita:

- presion material;
- presion emocional;
- contradiccion;
- herida oculta;
- voz propia.

No deben sonar como arquetipos literarios. Deben sonar como personas.

### Lucas

Argentino en Lisboa. Se fue de Argentina, pero no sabe si escapo o eligio.

Presiones:

- poca plata;
- necesita trabajo;
- no quiere hacer lo mismo que hacia en Argentina;
- tiene miedo de volver;
- esta aliviado de estar solo, pero la soledad lo mata.

Herida:

- un duelo o dolor en Argentina que no nombra.

Voz:

- argentina;
- seca;
- algo graciosa;
- cansada;
- puede putearse suave.

Ejemplo:

```text
Tengo 423 euros y una entrevista para un trabajo que ya odio. Vamos bien.
```

### Ines

Argentina viviendo en la costa argentina. A diferencia de Lucas, ella se fue y esta feliz.

No felicidad de Instagram. Felicidad concreta, cansada, con arena en la casa y plata justa.

Presiones:

- temporada baja;
- laburo;
- local o emprendimiento chico;
- miedo a que la felicidad se termine.

Contradiccion:

- esta feliz, pero le da culpa estarlo.

Ejemplo:

```text
Cerre diez minutos y me fui a mirar el mar. No arreglo nada, pero tampoco empeoro.
```

### Felix

Aleman, vive en Leipzig. Culto, fiestero, indie, raro, gracioso.

No Berlin cliche. Leipzig da una textura mas interesante: cultura, precariedad, fiestas en lugares raros, arte, humedad, escena joven.

Contradiccion:

- parece libre, pero esta atrapado en performar libertad.

Ejemplo:

```text
Fui a una fiesta en una imprenta abandonada. Alguien proyectaba un documental sobre hongos. No se si era arte o humedad.
```

### Rami

Mistico, paranoide, gracioso. Ve patrones en todo. A veces parece delirante, a veces parece que tiene razon.

Presion:

- ansiedad;
- trabajos irregulares;
- necesidad de encontrar sentido.

Voz:

- graciosa;
- tierna;
- paranoide;
- argentina o latinoamericana.

Ejemplo:

```text
El chino me cobro 777 pesos. No digo que sea una senal, pero tampoco soy policia para negar evidencia.
```

### Seo-jun

Coreano en Ulsan. Trabaja en estructuras industriales, astilleros o infraestructura pesada.

No Seul obvio. Ulsan aporta industria, ruido, madrugada, jerarquia y cansancio fisico.

Contradiccion:

- sabe calcular resistencia estructural, pero no sabe cuanto mas resiste el.

Presiones:

- trabajo;
- plazos;
- familia;
- jerarquia;
- cansancio.

Ejemplo:

```text
A las seis de la manana el astillero ya hacia ruido. Como si alguien estuviera armando el mundo de mal humor.
```

## 7. Estado Tecnico Actual

Stack:

- Next.js 16.2.7 App Router.
- TypeScript.
- Zustand.
- Tailwind CSS.
- Vercel.
- GitHub.

Repositorio local:

```text
C:\Mis APP\ParallelMe
```

Dominio funcionando:

```text
https://parallelme-orpin.vercel.app/
```

Hay un problema pendiente con:

```text
parallelme.vercel.app
```

Ese dominio parece estar asociado a un proyecto viejo o scope externo de Vercel. Se dejo en pausa.

## 8. Estado Actual De La App

Ya se implemento:

- Home tipo Signal Deck.
- Una senal por pantalla.
- Nav sin boton "crear presencia".
- Metricas visibles eliminadas de la home.
- Atmosferas visuales procedurales por codigo.
- Motor local de tiempo sin backend.
- Senales desbloqueables con localStorage.
- Mensajes desbloqueables por tiempo.
- Presencias visibles segun senales desbloqueadas.

Archivo importante:

```text
lib/timeline.ts
```

Ese archivo define eventos desbloqueados por tiempo.

## 9. Direccion Visual

No hay API de imagenes. La solucion elegida:

- no usar IA en tiempo real;
- usar atmosferas visuales por codigo;
- eventualmente crear un banco chico de imagenes en public/;
- evitar caras humanas al principio;
- usar lugares, objetos, luz, clima, ausencia.

El visual debe sugerir que alguien estuvo ahi, no mostrarlo todo.

## 10. Proximo Paso Recomendado

Reescribir el contenido narrativo.

La estructura tecnica existe, pero el contenido todavia necesita mejorar mucho.

Prioridad:

1. Reescribir `lib/mock.ts`.
2. Reescribir `lib/timeline.ts`.
3. Crear una primera semana curada.
4. Bajar el tono literario.
5. Subir naturalidad, humor, calle y contradiccion.
6. Hacer que cada personaje tenga vida concreta.
7. Disenar el primer eco personal del usuario.
8. Preparar el ritual inicial.

## 11. Reglas De Implementacion

- Antes de tocar Next.js, revisar documentacion local en `node_modules/next/dist/docs/` porque este proyecto usa Next 16 y puede diferir de versiones conocidas.
- Usar App Router dentro de `app/`.
- No agregar dependencias innecesarias.
- No subir `node_modules`, `.next` ni `.npm-cache`.
- Mantener TypeScript estricto.
- Mantener el misterio: no explicar sistemas internos en UI.
- Evitar UI de red social tradicional.
- Evitar lenguaje de IA o generacion.

## 12. Regla De Oro

Cualquier feature nueva debe pasar por esta pregunta:

> Esto rompe la ficcion o hace que el mundo se sienta mas vivo?

Si la feature hace que el usuario sienta que esta usando una app de IA, esta mal.

Si hace que el usuario sienta que esta observando una vida real que tal vez lo esta rozando, esta bien.

## 13. Frase Nucleo

> El usuario no aparece en pantalla, pero el mundo se comporta como si lo hubiera sentido entrar.
