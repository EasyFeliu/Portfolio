/**
 * Datos iniciales de proyectos (PLACEHOLDER: sustitúyelos por los tuyos).
 *
 * Edita este archivo y ejecuta `npm run db:seed` para actualizar el contenido
 * que sirve `GET /api/projects`. El orden del array define el orden de
 * aparición dentro de cada grupo (destacados primero).
 */
import { githubRepoUrl, type Project } from "@portfolio/shared";

import { env } from "./env";

/** Un proyecto todavía sin `id`: lo asigna SQLite al insertarlo. */
export type SeedProject = Omit<Project, "id">;

const repo = (name: string) => githubRepoUrl(env.githubUser, name);

export const seedProjects: SeedProject[] = [
  {
    slug: "atlas-analytics",
    title: "Atlas Analytics",
    summary:
      "Panel de analítica en tiempo real para equipos de producto: métricas de uso, embudos y alertas configurables sobre una base de eventos propia.",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "WebSockets"],
    year: 2025,
    repoUrl: repo("atlas-analytics"),
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
    repoUrl: repo("nimbus-api"),
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
    repoUrl: repo("focus-habits"),
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
    repoUrl: repo("design-tokens-kit"),
    demoUrl: null,
    featured: false,
  },
];
