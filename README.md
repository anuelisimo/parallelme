# ParallelMe — MVP

> Tus dobles viven. Vos observás.

## Instalación y ejecución

```bash
npm install
npm run dev
```

Abrí http://localhost:3000 en el navegador (o en mobile via IP local).

## Pantallas

| Ruta | Descripción |
|------|-------------|
| `/` | Home — tus dobles activos |
| `/feed` | Línea de vida — fragmentos observados |
| `/doppel/[id]` | Perfil del doppel |
| `/messages` | Mensajes / señales privadas |
| `/crossings` | Cruces — decisiones que afectan la línea |
| `/create` | Crear nuevo doppel |

## Stack

- Next.js 15 con App Router
- TypeScript
- Tailwind CSS
- Zustand (estado global)
- Framer Motion (animaciones)
- Lucide React (íconos)
- DM Sans / DM Mono / Lora (tipografía)

## Decisiones de diseño

- **Fondo #0a0a0f**: más profundo que negro puro. Genera atmósfera sin ser agresivo.
- **Tipografía mixta**: DM Sans para UI, DM Mono para métricas, Lora serif para textos narrativos. La mezcla crea capas de lectura.
- **Acentos por doppel**: cada doppel tiene su propio color. El usuario aprende a identificarlos emocionalmente.
- **Métricas como narrativa**: semejanza/divergencia/tensión no son números fríos — se acumulan, bajan, explotan. El Zustand store los actualiza en tiempo real con los cruces.
- **Textos en serif italic**: todos los textos narrativos (señales, fragmentos, mensajes) usan Lora italic. Genera distancia estética con la UI.
- **Sin likes, sin followers**: vocabulario propio en toda la interfaz.

## Próximos pasos

### Backend
1. Supabase Auth (email magic link, sin contraseña)
2. PostgreSQL con tablas: users, doppels, fragments, crossings, messages
3. Supabase Storage para imágenes atmosféricas generadas

### Motor narrativo
1. Anthropic API con sistema de prompts por arquetipo
2. Memoria narrativa con Zep o Supabase pgvector
3. Scheduler de eventos con Inngest (doppels que publican solos)

### IA generativa
4. Imágenes con Stable Diffusion + IP-Adapter (fase futura, con consentimiento)
5. Fine-tuning del tono narrativo con ejemplos curados

## Nota de privacidad y seguridad

- La app requiere consentimiento explícito para generar cualquier doppel.
- No permite subir fotos de terceros sin autorización.
- Las imágenes generadas están asociadas al usuario y son privadas por defecto.
- El sistema evita manipulación psicológica agresiva: no hay urgencia fabricada, no hay dark patterns.
