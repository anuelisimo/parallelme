# Prompt para Codex — ParallelMe MVP

Quiero que construyas un prototipo navegable de una app llamada **ParallelMe**.

## 1. Idea central

ParallelMe es una red social privada donde el usuario observa a sus **doppelgangers**: versiones alternativas de sí mismo que viven vidas paralelas, publican momentos, generan vínculos y toman decisiones que el usuario puede observar o intervenir.

No debe sentirse como una copia de Instagram. Debe usar una lógica social reconocible —feed, stories, perfiles, mensajes— pero con lenguaje propio: **dobles, señales, ecos, fragmentos, divergencia, cruces, presencias**.

Frase guía:

> Tus dobles viven. Vos observás.

## 2. Objetivo del MVP

Construir una **PWA mobile-first** navegable, visualmente convincente, sin backend real todavía, usando datos mockeados locales.

El objetivo no es tener IA real ni generación de imágenes todavía. El objetivo es validar la experiencia:

> ¿El usuario querría volver mañana para ver qué hizo su otro yo?

## 3. Stack sugerido

Usar:

- Next.js con App Router.
- TypeScript.
- Tailwind CSS.
- Componentes propios simples, sin sobrecargar dependencias.
- Datos mockeados en `/src/data/mock.ts`.
- Estado local con React hooks.
- Diseño mobile-first, pero que funcione bien en desktop.

No implementar todavía:

- Login real.
- Base de datos.
- Pagos.
- IA real.
- Subida de fotos.
- Generación de imágenes.

## 4. Estética general

La app debe sentirse como:

- social pero misteriosa;
- íntima pero tecnológica;
- premium, nocturna, psicológica;
- más Black Mirror suave que red social adolescente;
- minimalista, con mucho espacio negativo;
- con una capa emocional y de intriga.

Dirección visual:

- fondo oscuro o gris muy profundo;
- tarjetas con bordes suaves;
- tipografía limpia;
- acentos sutiles en violeta, azul eléctrico o verde espectral;
- imágenes simuladas como placeholders atmosféricos con gradientes, no fotos random;
- evitar parecer clon de Instagram.

## 5. Vocabulario de producto

Usar estos términos dentro de la interfaz:

- Doppel / Doble
- Señal
- Eco
- Fragmento
- Presencia
- Cruce
- Divergencia
- Semejanza
- Tensión
- Atracción
- Línea activa
- Momento observado
- Mensaje del doble

Evitar usar demasiado:

- post
- like
- followers
- reels
- stories

Se puede usar estructura social, pero con nombres propios del universo.

## 6. Pantallas principales

Crear las siguientes rutas:

### `/`
Home / Tus dobles

Debe mostrar:

- Header: “ParallelMe” + bajada “Tus dobles viven. Vos observás.”
- Lista de doppelgangers activos.
- Cada card debe mostrar:
  - nombre del doppel;
  - tipo: activo, inestable, dormido, en expansión;
  - ubicación narrativa;
  - última señal;
  - semejanza %;
  - divergencia %;
  - tensión %;
  - estado emocional;
  - botón “Observar”.

Ejemplos de dobles:

1. Mauro en Bangkok
   - Doppel activo
   - Última señal: “Volvió al rooftop sin saber por qué.”
   - Semejanza: 84
   - Divergencia: 31
   - Tensión: 72
   - Estado: deseo alto

2. Mauro más atrevido
   - Doppel inestable
   - Última señal: “Hizo algo que vos venís postergando.”
   - Semejanza: 76
   - Divergencia: 58
   - Tensión: 89
   - Estado: impulso

3. Mauro arquitecto en Marte
   - Doppel en expansión
   - Última señal: “Recibió una orden que no esperaba.”
   - Semejanza: 67
   - Divergencia: 64
   - Tensión: 61
   - Estado: aislamiento

4. Mauro en silencio
   - Doppel dormido
   - Última señal: “No publica hace 3 días. Algo cambió en su línea.”
   - Semejanza: 91
   - Divergencia: 12
   - Tensión: 44
   - Estado: latente

### `/feed`
Línea de vida / Momentos observados

Debe mostrar un feed vertical de fragmentos.

Cada fragmento debe tener:

- doppel asociado;
- ubicación narrativa;
- hora relativa;
- imagen placeholder atmosférica;
- texto breve narrativo;
- métricas renombradas:
  - miradas;
  - ecos;
  - presencias;
- comentarios/señales de personajes secundarios.

Ejemplos:

- “Volvió al café donde alguien recordó su pedido. Esta vez, el vaso tenía una nota.”
- “Subió una foto borrosa desde un taxi. No etiquetó el lugar.”
- “Alguien vio su perfil tres veces antes de escribirle.”
- “Tu doble respondió con una frase que vos no hubieras usado.”

### `/doppel/[id]`
Perfil del doppel

Debe mostrar:

- Hero con nombre y tipo de doppel.
- Medidores:
  - Semejanza.
  - Divergencia.
  - Tensión.
  - Atracción.
- Datos narrativos:
  - diferencia principal;
  - deseo dominante;
  - miedo oculto;
  - última señal;
  - personajes vinculados;
  - resumen actual de la vida.
- Botones:
  - “Ver línea”
  - “Abrir cruce”
  - “Mensaje del doble”

### `/messages`
Mensajes / Señales privadas

Debe mostrar una lista de conversaciones:

- Tu yo en Bangkok
- Tu yo más atrevido
- Observador desconocido
- Nicolás
- Sistema narrativo

Al seleccionar una conversación, mostrar mensajes mockeados.

Ejemplos:

Tu yo en Bangkok:
- “No sé si esto era lo que querías ver.”
- “Hoy volví al mismo lugar. Esta vez me estaban esperando.”

Tu yo más atrevido:
- “Hoy hice algo que vos venís postergando.”

Sistema narrativo:
- “Se detectó una divergencia entre vos y tu doble.”

Observador desconocido:
- “Él se parece a vos, pero ya no decide igual.”

### `/crossings`
Cruces / Decisiones

Debe mostrar decisiones narrativas pendientes.

Cada cruce debe tener:

- contexto;
- dos o tres opciones;
- impacto estimado en semejanza, divergencia y tensión;
- botón para elegir.

Ejemplo:

Contexto:
“Tu yo en Bangkok recibió un mensaje de Nicolás después de tres días de silencio.”

Opciones:
1. Responder ahora.
2. Esperar.
3. Preguntar por qué desapareció.

Al elegir, actualizar visualmente el estado local y mostrar una consecuencia mockeada.

### `/create`
Crear nuevo doble

Formulario simple:

- Nombre del doppel.
- Premisa.
- Lugar.
- Tono:
  - nocturno;
  - íntimo;
  - sci-fi;
  - deseo;
  - melancólico;
  - urbano;
  - aventura.
- Diferencia principal:
  - se anima antes;
  - se fue de la ciudad;
  - eligió otra profesión;
  - vive de noche;
  - no volvió;
  - dijo que sí.

Al crear, agregarlo al estado local o simular creación con una pantalla de resultado.

## 7. Componentes sugeridos

Crear componentes reutilizables:

- `AppShell`
- `BottomNav`
- `DoppelCard`
- `MetricBar`
- `SignalCard`
- `FragmentCard`
- `MessageThread`
- `CrossingCard`
- `AtmosphericImage`
- `SectionHeader`

## 8. Estructura de datos mock

Crear tipos TypeScript:

```ts
type DoppelStatus = 'active' | 'unstable' | 'dormant' | 'expanding';

type Doppel = {
  id: string;
  name: string;
  type: string;
  status: DoppelStatus;
  location: string;
  lastSignal: string;
  similarity: number;
  divergence: number;
  tension: number;
  attraction: number;
  emotionalState: string;
  dominantDesire: string;
  hiddenFear: string;
  mainDifference: string;
  linkedCharacters: string[];
  summary: string;
};

type Fragment = {
  id: string;
  doppelId: string;
  location: string;
  timeAgo: string;
  text: string;
  gazes: number;
  echoes: number;
  presences: number;
  signals: string[];
};

type Conversation = {
  id: string;
  title: string;
  subtitle: string;
  messages: {
    id: string;
    sender: 'user' | 'doppel' | 'character' | 'system' | 'observer';
    text: string;
    time: string;
  }[];
};

type Crossing = {
  id: string;
  doppelId: string;
  context: string;
  options: {
    id: string;
    label: string;
    effect: string;
    similarityDelta: number;
    divergenceDelta: number;
    tensionDelta: number;
  }[];
};
```

## 9. Interacciones mínimas

Implementar:

- navegación entre pantallas;
- cards clickeables;
- elección de cruces con consecuencia visual;
- creación simulada de un nuevo doppel;
- filtros simples en feed por doppel;
- animaciones suaves con CSS o Framer Motion si ya está instalado, pero no agregar complejidad innecesaria.

## 10. Criterios de aceptación

El prototipo está bien si:

- se puede correr localmente con `npm run dev`;
- no hay errores de TypeScript;
- el diseño es mobile-first y se ve bien en ancho 390px;
- se entiende inmediatamente que no es Instagram, sino una red de dobles;
- la home transmite intriga;
- el perfil del doppel tiene profundidad psicológica;
- los mensajes generan sensación de misterio;
- los cruces permiten intervenir en la vida paralela;
- todo funciona sin backend real.

## 11. Fase posterior, no construir todavía

Dejar preparado conceptualmente para una futura fase con:

- Supabase Auth;
- Postgres;
- Supabase Storage;
- generación narrativa con LLM;
- generación de imágenes con referencia facial y consentimiento explícito;
- scheduler para eventos autónomos;
- notificaciones;
- memoria narrativa;
- planes premium.

## 12. Seguridad y privacidad futura

Agregar en algún lugar del código o README una nota de producto:

- La app sólo debe permitir generar dobles con consentimiento explícito del usuario.
- No debe permitir subir fotos de terceros para crear doppelgangers sin autorización.
- Las imágenes generadas deben estar asociadas a un usuario y protegidas.
- El tono de la app debe evitar manipulación psicológica agresiva.

## 13. Primer entregable esperado

Quiero que entregues:

1. Prototipo funcional.
2. README con instrucciones.
3. Lista de archivos creados/modificados.
4. Explicación breve de decisiones de diseño.
5. Próximos pasos sugeridos para conectar backend e IA.

