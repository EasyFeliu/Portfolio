# Portfolio · Luis Feliu Gomez Polo

Portfolio personal de **Luis Feliu Gomez Polo** ([@EasyFeliu](https://github.com/EasyFeliu)):
una web de una sola página con estética inspirada en Apple, diseño **mobile first**
y un backend propio, separado del frontend.

```
portfolio/
├── apps/
│   ├── web/        Frontend  · Next.js 16 (App Router) + React 19 + Tailwind CSS v4
│   └── api/        Backend   · Express 5 + SQLite (better-sqlite3)
├── packages/
│   └── shared/     Contratos compartidos: tipos y validación con Zod
└── package.json    Monorepo con npm workspaces
```

- **`apps/web`** no contiene lógica de servidor ni acceso a datos: pinta la
  interfaz y habla con el backend a través de `lib/api.ts`.
- **`apps/api`** es un servicio HTTP independiente (se puede arrancar, probar y
  desplegar por su cuenta) con su propia base de datos y configuración.
- **`packages/shared`** evita que los dos lados se desincronicen: tipos de la API,
  esquema Zod del formulario y límites de los campos viven una sola vez.

En desarrollo el navegador siempre llama a `/api/...` en el mismo origen y Next
hace de proxy hacia el backend (`API_URL`), así que no hay CORS ni URLs absolutas
repartidas por el código del cliente. Si prefieres llamar al backend directamente,
define `NEXT_PUBLIC_API_BASE_URL` y añade el origen del frontend a `CORS_ORIGINS`.

---

## Puesta en marcha

Requisitos: **Node.js 20 o superior** y npm 10+ (workspaces).

```bash
# 1. Instalar dependencias de los tres paquetes
npm install

# 2. Cargar los proyectos de ejemplo en SQLite
npm run db:seed

# 3. Arrancar backend (:4000) y frontend (:3000) a la vez
npm run dev
```

La web queda en <http://localhost:3000> y la API en <http://localhost:4000>.

Para arrancar solo una parte: `npm run dev:api` o `npm run dev:web`.

> La base de datos se crea sola en `apps/api/data/portfolio.db` al arrancar el
> backend, y si está vacía se rellena con los proyectos de ejemplo. `npm run db:seed`
> sirve para volver a sincronizarlos cuando los edites.

### Producción

```bash
npm run build   # esbuild para la API + next build para la web
npm run start   # node dist/server.cjs + next start
```

---

## Scripts

Desde la raíz (se reenvían al workspace correspondiente):

| Script | Descripción |
| --- | --- |
| `npm run dev` | Backend y frontend juntos, con recarga en caliente. |
| `npm run dev:api` / `npm run dev:web` | Solo uno de los dos. |
| `npm run build` | Compila la API (esbuild) y la web (Next.js). |
| `npm run start` | Arranca ambos en modo producción. |
| `npm run lint` | ESLint en todos los workspaces. |
| `npm run typecheck` | TypeScript en todos los workspaces. |
| `npm run db:seed` | Inserta o actualiza los proyectos. Acepta `-- --reset`. |
| `npm run db:messages` | Muestra los mensajes de contacto recibidos. |

---

## Variables de entorno

Cada app tiene su propio `.env.example`; cópialo a `.env.local` si quieres cambiar
algo. No hay secretos y todo tiene valor por defecto, así que el proyecto arranca
sin configurar nada.

**Backend — `apps/api/.env.example`**

| Variable | Por defecto | Descripción |
| --- | --- | --- |
| `NODE_ENV` | `development` | En `production` los logs salen en JSON por línea. |
| `PORT` / `HOST` | `4000` / `0.0.0.0` | Dónde escucha la API. |
| `DATABASE_PATH` | `data/portfolio.db` | Fichero SQLite (relativo a `apps/api` o absoluto). |
| `CORS_ORIGINS` | `http://localhost:3000` | Orígenes autorizados, separados por comas. |
| `TRUST_PROXY` | `true` | Leer la IP real de `X-Forwarded-For`. |
| `CONTACT_RATE_LIMIT_MAX` | `5` | Envíos permitidos por IP y ventana. |
| `CONTACT_RATE_LIMIT_WINDOW_MINUTES` | `10` | Duración de la ventana. |
| `GITHUB_USER` | `EasyFeliu` | Usuario con el que se construyen las URLs de los proyectos. |

**Frontend — `apps/web/.env.example`**

| Variable | Por defecto | Descripción |
| --- | --- | --- |
| `API_URL` | `http://localhost:4000` | Backend al que Next redirige `/api/*`. |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | URL pública; base de los metadatos Open Graph. |
| `NEXT_PUBLIC_API_BASE_URL` | *(vacío)* | Vacío = proxy de Next. Con valor, el navegador llama al backend directamente. |
| `NEXT_PUBLIC_GITHUB_USER` | `EasyFeliu` | Perfil de GitHub que se muestra. |
| `NEXT_PUBLIC_LINKEDIN_USER` | `luisfeliu` | Perfil de LinkedIn. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | `hola@luisfeliu.dev` | Email de contacto. |

El backend carga `.env.local` y `.env` al arrancar (`process.loadEnvFile`); las
variables ya presentes en el entorno tienen prioridad.

---

## API

Servida por `apps/api` bajo el prefijo `/api`. Todas las respuestas son JSON y los
errores comparten formato: `{ "ok": false, "error": "CODIGO", "message": "texto legible" }`.

### `GET /api/health`

```bash
curl http://localhost:4000/api/health
```

```json
{
  "ok": true,
  "status": "ok",
  "timestamp": "2026-01-01T10:00:00.000Z",
  "uptimeSeconds": 42,
  "database": { "ok": true, "projects": 4, "messages": 1 }
}
```

### `GET /api/projects`

Proyectos ordenados por destacados y posición. Es la fuente de datos de la sección
**Proyectos**, que los pide desde el cliente con estado de carga, error y reintento.

```bash
curl http://localhost:4000/api/projects
```

```json
{
  "ok": true,
  "count": 4,
  "projects": [
    {
      "id": 1,
      "slug": "atlas-analytics",
      "title": "Atlas Analytics",
      "summary": "Panel de analítica en tiempo real…",
      "tags": ["Next.js", "TypeScript"],
      "year": 2025,
      "repoUrl": "https://github.com/EasyFeliu/atlas-analytics",
      "demoUrl": null,
      "featured": true
    }
  ]
}
```

### `POST /api/contact`

```bash
curl -X POST http://localhost:4000/api/contact \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ana Ruiz","email":"ana@example.com","message":"Hola Luis, me gustaría comentarte un proyecto."}'
```

Respuesta correcta (`201`):

```json
{ "ok": true, "id": 1, "message": "¡Gracias! He recibido tu mensaje y te responderé pronto." }
```

Validación (misma para cliente y servidor, definida en `packages/shared/src/contact.ts`):

| Campo | Regla |
| --- | --- |
| `name` | 2–80 caracteres |
| `email` | email válido, máx. 160 caracteres (se normaliza a minúsculas) |
| `message` | 10–2000 caracteres |

Los números viven una sola vez en `CONTACT_LIMITS` y los usan el esquema Zod, los
`maxLength` del formulario y el contador de caracteres.

Errores:

| HTTP | `error` | Cuándo ocurre |
| --- | --- | --- |
| `400` | `INVALID_JSON` | El cuerpo no es JSON válido, está vacío o no es un objeto. |
| `400` | `VALIDATION_ERROR` | Algún campo no cumple las reglas. Incluye `errors` con el mensaje por campo. |
| `404` | `NOT_FOUND` | El endpoint no existe. |
| `413` | `PAYLOAD_TOO_LARGE` | El cuerpo supera el límite de 16 kB. |
| `429` | `RATE_LIMITED` | Se superó el límite de envíos por IP. Incluye cabecera `Retry-After`. |
| `500` | `DATABASE_ERROR` | Fallo al escribir en SQLite. |

```json
{
  "ok": false,
  "error": "VALIDATION_ERROR",
  "message": "Revisa los campos marcados y vuelve a enviarlo.",
  "errors": { "email": "Introduce un email válido, por ejemplo hola@dominio.com." }
}
```

---

## Estructura

```
apps/api/
  src/
    server.ts          # arranque, escucha y apagado ordenado
    app.ts             # app de Express: logs, CORS, JSON, rutas, errores
    env.ts             # configuración con valores por defecto
    logger.ts          # log JSON en producción, legible en desarrollo
    db.ts              # conexión SQLite, migración y semilla
    projects.ts        # consultas de proyectos
    messages.ts        # consultas de mensajes
    rate-limit.ts      # límite de peticiones en memoria
    seed-projects.ts   # proyectos de ejemplo
    middleware/        # error-handler.ts (404 + errores)
    routes/            # health.ts · projects.ts · contact.ts
  scripts/             # seed.ts · messages.ts
  data/portfolio.db    # SQLite (no versionado)

apps/web/
  app/                 # layout, página y estilos globales (design tokens)
  components/
    sections/          # hero, sobre mí, proyectos, experiencia, contacto
    site-header.tsx    # cabecera fija con menú móvil
    site-footer.tsx
    reveal.tsx         # aparición al hacer scroll
    theme-toggle.tsx   # claro/oscuro
    use-theme.ts
    social-icon.tsx
  lib/
    api.ts             # única capa que llama al backend
    config.ts          # configuración pública (NEXT_PUBLIC_*)
    content.ts         # todos los textos e ids de sección
    theme.ts

packages/shared/src/
  contact.ts           # esquema Zod + CONTACT_LIMITS
  types.ts             # Project, respuestas y códigos de error
  github.ts            # helpers de URLs de GitHub
```

### Base de datos

```sql
projects(id, slug UNIQUE, title, summary, tags JSON, year,
         repo_url, demo_url, featured, position, created_at)

contact_messages(id, name, email, message, created_at)
```

El esquema se crea al abrir la conexión (`apps/api/src/db.ts`), así que no hay
paso de migración manual.

---

## Qué personalizar

El contenido de ejemplo está marcado con `PLACEHOLDER`
(`grep -rn PLACEHOLDER apps packages`). Checklist:

1. **Identidad y enlaces** → `apps/web/.env.local`: `NEXT_PUBLIC_GITHUB_USER`,
   `NEXT_PUBLIC_LINKEDIN_USER`, `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_SITE_URL`.
   Ningún perfil ni email está escrito a mano en los componentes.
2. **Textos** → `apps/web/lib/content.ts`: bio, cifras del hero, trayectoria,
   skills y todas las etiquetas de interfaz (objeto `copy`).
3. **Proyectos** → `apps/api/src/seed-projects.ts` y después `npm run db:seed`.
   Las URLs de repositorio se construyen con `GITHUB_USER`; deja `demoUrl: null`
   mientras no haya demo (la tarjeta lo indica sola).
4. **Diseño** → `apps/web/app/globals.css`: los design tokens están en `:root`
   (modo claro) y `.dark` (oscuro): acento, superficies, hairlines, sombras,
   colores de estado (`--danger`, `--success`) y altura de cabecera (`--header-h`).
   Los componentes solo usan tokens, no colores literales.

---

## Diseño y accesibilidad

- **Mobile first:** los estilos base son para móvil y crecen con `min-width`
  (`sm`, `md`, `lg`); el menú se convierte en navegación a pantalla completa.
- **Estética Apple:** tipografía Inter con fallback al stack del sistema
  (San Francisco en Apple), titulares grandes con tracking negativo, mucho aire,
  hairlines de 1 px, sombras suaves, cabecera con efecto cristal y un único color
  de acento.
- **Modo claro/oscuro:** respeta la preferencia del sistema, se puede cambiar a
  mano y la elección se guarda en `localStorage` (sin parpadeo al recargar).
- **Accesibilidad:** HTML semántico, enlace «Saltar al contenido», foco visible,
  `aria-*` en menú y formulario, errores asociados a cada campo, mensajes de estado
  con `aria-live` y respeto por `prefers-reduced-motion`.

---

## Notas de despliegue

Los dos servicios se despliegan por separado:

- **`apps/api`** necesita un sistema de ficheros persistente para SQLite: VPS,
  Docker con volumen o plataformas con disco (Fly.io, Railway, Render).
  Para cambiar de base de datos solo hay que reescribir `db.ts`, `projects.ts` y
  `messages.ts`: el resto del backend solo habla con esas funciones.
- **`apps/web`** funciona en cualquier hosting de Next.js; define `API_URL`
  apuntando al backend desplegado.

No se envían emails: los mensajes se guardan en la base de datos y se consultan
con `npm run db:messages`.
