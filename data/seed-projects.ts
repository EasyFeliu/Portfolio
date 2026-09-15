/**
 * Datos iniciales de proyectos.
 *
 * Edita este archivo y vuelve a ejecutar `npm run db:seed` para actualizar el
 * contenido que sirve la API en `GET /api/projects`.
 */
export type SeedProject = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  year: number;
  repoUrl: string | null;
  demoUrl: string | null;
  featured: boolean;
};

export const seedProjects: SeedProject[] = [
  {
    slug: "atlas-analytics",
    title: "Atlas Analytics",
    summary:
      "Panel de analítica en tiempo real para equipos de producto: métricas de uso, embudos y alertas configurables sobre una base de eventos propia.",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "WebSockets"],
    year: 2025,
    repoUrl: "https://github.com/EasyFeliu",
    demoUrl: null,
    featured: true,
  },
  {
    slug: "nimbus-api",
    title: "Nimbus API",
    summary:
      "API modular para sincronizar catálogos entre tiendas online, con validación estricta, reintentos idempotentes y documentación generada automáticamente.",
    tags: ["Node.js", "Fastify", "Zod", "Docker"],
    year: 2024,
    repoUrl: "https://github.com/EasyFeliu",
    demoUrl: null,
    featured: true,
  },
  {
    slug: "focus-habits",
    title: "Focus Habits",
    summary:
      "App de hábitos con enfoque minimalista: seguimiento diario offline-first, rachas, estadísticas y sincronización opcional entre dispositivos.",
    tags: ["React Native", "SQLite", "Expo"],
    year: 2024,
    repoUrl: "https://github.com/EasyFeliu",
    demoUrl: null,
    featured: false,
  },
  {
    slug: "design-tokens-kit",
    title: "Design Tokens Kit",
    summary:
      "Sistema de design tokens y componentes accesibles que unifica tipografía, color y espaciado entre varios productos web del mismo equipo.",
    tags: ["Tailwind CSS", "Radix UI", "Storybook", "a11y"],
    year: 2023,
    repoUrl: "https://github.com/EasyFeliu",
    demoUrl: null,
    featured: false,
  },
];
