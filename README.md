# Portfolio · Luis Feliu Gomez Polo

Portfolio personal de **Luis Feliu Gomez Polo** ([@EasyFeliu](https://github.com/EasyFeliu)):
una web de una sola página con estética inspirada en Apple, diseño **mobile first** y
backend real (API + base de datos), no solo HTML estático.

- **Frontend:** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4.
- **Backend:** Route Handlers de Next.js con validación mediante Zod.
- **Base de datos:** SQLite con `better-sqlite3` (sin servicios externos).
- **Extras:** modo claro/oscuro persistente, animaciones al hacer scroll, formulario
  de contacto que guarda los mensajes y límite de peticiones básico.

---

## Puesta en marcha

Requisitos: **Node.js 20 o superior** y npm.

```bash
# 1. Instalar dependencias
npm install

# 2. (Opcional) configurar variables de entorno
cp .env.example .env.local

# 3. Cargar los proyectos de ejemplo en la base de datos
npm run db:seed

# 4. Arrancar en modo desarrollo
npm run dev
```

La web queda disponible en <http://localhost:3000>.

> La base de datos SQLite se crea sola en `data/portfolio.db` la primera vez que
> se ejecuta la app, y si está vacía se rellena con los proyectos de ejemplo.
> `npm run db:seed` sirve para volver a sincronizarlos cuando los edites.

### Producción

```bash
npm run build
npm run start
```

---

## Scripts disponibles

| Script | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con recarga en caliente. |
| `npm run build` | Compila la aplicación para producción. |
| `npm run start` | Sirve la build de producción. |
| `npm run lint` | ESLint (configuración de Next.js). |
| `npm run typecheck` | Comprobación de tipos con TypeScript. |
| `npm run db:seed` | Inserta o actualiza los proyectos de `data/seed-projects.ts`. Acepta `-- --reset` para vaciar la tabla antes. |
| `npm run db:messages` | Muestra por consola los mensajes de contacto recibidos. |

---

## Variables de entorno

Copia `.env.example` a `.env.local`. No hay secretos y todas tienen valor por
defecto, así que la app arranca sin configurar nada.

| Variable | Por defecto | Descripción |
| --- | --- | --- |
| `DATABASE_PATH` | `data/portfolio.db` | Ruta (relativa a la raíz o absoluta) del fichero SQLite. |
| `CONTACT_RATE_LIMIT_MAX` | `5` | Envíos permitidos por IP en cada ventana. |
| `CONTACT_RATE_LIMIT_WINDOW_MINUTES` | `10` | Duración de la ventana del límite, en minutos. |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | URL pública; base de los metadatos Open Graph. |
| `NEXT_PUBLIC_GITHUB_USER` | `EasyFeliu` | Usuario de GitHub (perfil y URLs de repos). |
| `NEXT_PUBLIC_LINKEDIN_USER` | `luisfeliu` | Usuario de LinkedIn. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | `hola@luisfeliu.dev` | Email de contacto que se muestra en la web. |

Las `NEXT_PUBLIC_*` se leen en `lib/config.ts` y viajan al navegador; la
configuración de servidor vive junto a quien la usa (`lib/db.ts` y
`lib/rate-limit.ts`).

---

## API

Todos los endpoints devuelven JSON. Los errores siguen el formato
`{ "ok": false, "error": "CODIGO", "message": "texto legible" }`.

### `GET /api/health`

Estado del servicio y de la base de datos.

```bash
curl http://localhost:3000/api/health
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

Proyectos ordenados por destacados y posición. Es la fuente de datos de la
sección **Proyectos** de la web (se cargan desde el cliente, con estado de carga,
error y reintento).

```bash
curl http://localhost:3000/api/projects
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
      "repoUrl": "https://github.com/EasyFeliu",
      "demoUrl": null,
      "featured": true
    }
  ]
}
```

### `POST /api/contact`

Valida y guarda un mensaje de contacto.

```bash
curl -X POST http://localhost:3000/api/contact \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ana Ruiz","email":"ana@example.com","message":"Hola Luis, me gustaría comentarte un proyecto."}'
```

Respuesta correcta (`201`):

```json
{ "ok": true, "id": 1, "message": "¡Gracias! He recibido tu mensaje y te responderé pronto." }
```

Reglas de validación (compartidas entre cliente y servidor en `lib/schemas.ts`):

| Campo | Regla |
| --- | --- |
| `name` | 2–80 caracteres |
| `email` | email válido, máx. 160 caracteres (se normaliza a minúsculas) |
| `message` | 10–2000 caracteres |

Los límites están en `CONTACT_LIMITS` (`lib/schemas.ts`) y son la única fuente de
verdad: los usan el esquema Zod, los `maxLength` del formulario y el contador de
caracteres.

Errores posibles:

| Código HTTP | `error` | Cuándo ocurre |
| --- | --- | --- |
| `400` | `INVALID_JSON` | El cuerpo no es JSON válido. |
| `400` | `VALIDATION_ERROR` | Algún campo no cumple las reglas. Incluye `errors` con el mensaje por campo. |
| `429` | `RATE_LIMITED` | Se ha superado el límite de envíos por IP (configurable, por defecto 5 cada 10 minutos). Incluye cabecera `Retry-After`. |
| `500` | `DATABASE_ERROR` | Fallo al escribir en SQLite. |

Ejemplo de error de validación:

```json
{
  "ok": false,
  "error": "VALIDATION_ERROR",
  "message": "Revisa los campos marcados y vuelve a enviarlo.",
  "errors": { "email": "Introduce un email válido, por ejemplo hola@dominio.com." }
}
```

---

## Estructura del proyecto

```
app/
  api/
    contact/route.ts     # POST /api/contact  (validación + persistencia)
    health/route.ts      # GET  /api/health
    projects/route.ts    # GET  /api/projects
  globals.css            # design tokens + estilos base
  layout.tsx             # metadatos, fuente Inter, script de tema
  page.tsx               # composición de la página
components/
  sections/              # hero, sobre mí, proyectos, experiencia, contacto
  site-header.tsx        # cabecera fija con menú móvil
  site-footer.tsx
  reveal.tsx             # animación de aparición al hacer scroll
  theme-toggle.tsx       # botón claro/oscuro
  use-theme.ts           # estado del tema (leído del DOM)
  social-icon.tsx        # mapa exhaustivo red social → icono
  section-heading.tsx
  icons.tsx
lib/
  config.ts              # configuración pública (NEXT_PUBLIC_*)
  content.ts             # todos los textos e ids de sección
  db.ts                  # conexión SQLite, migración y semilla
  messages.ts            # acceso a mensajes de contacto
  projects.ts            # acceso a proyectos
  schemas.ts             # esquemas Zod + límites compartidos
  rate-limit.ts          # límite de peticiones en memoria
  theme.ts               # tema: clave, colores meta y script anti-parpadeo
  types.ts               # tipos compartidos (Project, respuestas de la API)
data/
  seed-projects.ts       # proyectos de ejemplo
  portfolio.db           # SQLite (no versionado)
scripts/
  seed.ts                # npm run db:seed
  messages.ts            # npm run db:messages
```

### Base de datos

```sql
projects(id, slug UNIQUE, title, summary, tags JSON, year,
         repo_url, demo_url, featured, position, created_at)

contact_messages(id, name, email, message, created_at)
```

El esquema se crea automáticamente al abrir la conexión (`lib/db.ts`), así que no
hace falta un paso de migración manual.

---

## Qué personalizar

El contenido de ejemplo está marcado con el comentario `PLACEHOLDER` para que sea
fácil de localizar (`grep -rn PLACEHOLDER lib data`). Checklist:

1. **Identidad y enlaces** → `.env.local`: `NEXT_PUBLIC_GITHUB_USER`,
   `NEXT_PUBLIC_LINKEDIN_USER`, `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_SITE_URL`.
   Ningún perfil ni email está escrito a mano en los componentes.
2. **Textos** → `lib/content.ts`: bio, cifras del hero, trayectoria, skills y
   todas las etiquetas de interfaz (objeto `copy`).
3. **Proyectos** → `data/seed-projects.ts` y después `npm run db:seed`. Las URLs
   de repositorio se construyen desde el usuario de GitHub configurado; pon
   `demoUrl: null` mientras no haya demo (la tarjeta lo indica sola).
4. **Diseño** → `app/globals.css`: los design tokens están en `:root` (modo claro)
   y `.dark` (oscuro): color de acento, superficies, hairlines, sombras, colores de
   estado (`--danger`, `--success`) y altura de la cabecera (`--header-h`). Los
   componentes solo usan tokens, no colores literales.

---

## Diseño y accesibilidad

- **Mobile first:** los estilos base son para móvil y crecen con `min-width`
  (`sm`, `md`, `lg`); el menú se convierte en navegación a pantalla completa.
- **Estética Apple:** tipografía Inter con fallback al stack del sistema
  (San Francisco en Apple), titulares grandes con tracking negativo, mucho aire,
  hairlines de 1 px, sombras suaves, cabecera con efecto cristal y un único color
  de acento.
- **Modo claro/oscuro:** se respeta la preferencia del sistema, se puede cambiar a
  mano y la elección se guarda en `localStorage` (sin parpadeo al recargar).
- **Accesibilidad:** HTML semántico, enlace «Saltar al contenido», foco visible,
  `aria-*` en el menú y en el formulario, errores asociados a cada campo,
  mensajes de estado con `aria-live` y respeto por `prefers-reduced-motion`.

---

## Notas de despliegue

SQLite necesita un sistema de ficheros persistente y escribible. Funciona sin
cambios en un VPS, en Docker con volumen o en plataformas con disco persistente
(Fly.io, Railway, Render). En entornos serverless de solo lectura (como Vercel)
habría que sustituir `better-sqlite3` por una base de datos gestionada
(Postgres, Turso, Neon…): basta con reescribir `lib/db.ts`, `lib/projects.ts` y
`lib/messages.ts`, ya que el resto de la aplicación solo habla con esas funciones.

No se envían emails: los mensajes se guardan en la base de datos y se consultan
con `npm run db:messages`.
