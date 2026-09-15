/**
 * Contenido del sitio en un único lugar: ningún texto visible vive dentro de
 * los componentes. Los proyectos son la excepción, porque se sirven desde la
 * API (`data/seed-projects.ts` → SQLite → `GET /api/projects`).
 *
 * Los valores marcados con `PLACEHOLDER` son de ejemplo y están pensados para
 * sustituirse por datos reales (ver la sección «Qué personalizar» del README).
 */
import { siteConfig } from "@/lib/config";

export const SECTION_IDS = {
  hero: "inicio",
  about: "sobre-mi",
  projects: "proyectos",
  experience: "experiencia",
  contact: "contacto",
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];

/** Ancla de una sección, para no repetir la almohadilla por el código. */
export function sectionHref(id: SectionId): string {
  return `#${id}`;
}

export const MAIN_CONTENT_ID = "contenido";

export const profile = {
  name: "Luis Feliu Gomez Polo",
  shortName: "Luis Feliu",
  initials: "LF",
  role: "Software Engineer",
  tagline: "Construyo productos web rápidos, cuidados y fáciles de mantener.",
  location: "España · Remoto", // PLACEHOLDER
  email: siteConfig.email,
  availability: "Disponible para nuevos proyectos", // PLACEHOLDER
  heroLead:
    "Desarrollo de principio a fin: interfaces con las que apetece interactuar y backends sencillos de operar. Me obsesionan los detalles, el rendimiento y la accesibilidad.",
  about: [
    "Soy Luis Feliu Gomez Polo, ingeniero de software centrado en producto. Me muevo con soltura entre el frontend y el backend: diseño la interfaz, modelo los datos y me aseguro de que todo encaje sin fricción.",
    "Trabajo con TypeScript, React y Node.js, y me gusta cuidar lo que casi nadie ve: tipografía coherente, estados de carga honestos, formularios que explican los errores y APIs con contratos claros.",
    "Cuando no estoy programando, ando leyendo sobre diseño de interfaces, optimizando algún detalle de rendimiento o preparando la siguiente idea que quiero construir.",
  ],
  // PLACEHOLDER: ajusta o elimina estas cifras.
  stats: [
    { value: "+6", label: "años construyendo producto" },
    { value: "+20", label: "proyectos entregados" },
    { value: "100%", label: "enfoque mobile first" },
  ],
} as const;

export type SocialNetwork = "github" | "linkedin";

export const socialLinks: {
  network: SocialNetwork;
  label: string;
  handle: string;
  href: string;
}[] = [
  {
    network: "github",
    label: "GitHub",
    handle: siteConfig.github.handle,
    href: siteConfig.github.profileUrl,
  },
  {
    network: "linkedin",
    label: "LinkedIn",
    handle: siteConfig.linkedin.handle,
    href: siteConfig.linkedin.profileUrl, // PLACEHOLDER: usa NEXT_PUBLIC_LINKEDIN_USER
  },
];

export const navLinks: { id: SectionId; label: string }[] = [
  { id: SECTION_IDS.about, label: "Sobre mí" },
  { id: SECTION_IDS.projects, label: "Proyectos" },
  { id: SECTION_IDS.experience, label: "Experiencia" },
  { id: SECTION_IDS.contact, label: "Contacto" },
];

// PLACEHOLDER: trayectoria de ejemplo.
export const experience = [
  {
    period: "2023 — Actualidad",
    role: "Senior Software Engineer",
    company: "Producto propio / Freelance",
    description:
      "Diseño y desarrollo de aplicaciones web completas para clientes: arquitectura, interfaz, API y despliegue. Foco en rendimiento, accesibilidad y mantenibilidad.",
    highlights: ["Next.js App Router", "Diseño de APIs", "Design systems"],
  },
  {
    period: "2021 — 2023",
    role: "Full-Stack Developer",
    company: "Startup SaaS",
    description:
      "Desarrollo de un panel de analítica usado a diario por equipos de producto. Migración a TypeScript estricto y reducción del tiempo de carga inicial a menos de la mitad.",
    highlights: ["React", "Node.js", "PostgreSQL"],
  },
  {
    period: "2019 — 2021",
    role: "Frontend Developer",
    company: "Agencia digital",
    description:
      "Implementación de webs y e-commerce para marcas, con especial atención al comportamiento en móvil y a las métricas de Core Web Vitals.",
    highlights: ["JavaScript", "CSS moderno", "Core Web Vitals"],
  },
] as const;

export const skillGroups = [
  {
    title: "Frontend",
    items: ["TypeScript", "React", "Next.js", "Tailwind CSS", "Accesibilidad (WCAG)", "Animación UI"],
  },
  {
    title: "Backend",
    items: ["Node.js", "API REST", "Zod", "SQLite / PostgreSQL", "Prisma", "Testing"],
  },
  {
    title: "Herramientas",
    items: ["Git", "Docker", "Vercel", "CI/CD", "Figma", "Vitest"],
  },
] as const;

/** Todos los textos de interfaz (etiquetas, estados, mensajes). */
export const copy = {
  skipToContent: "Saltar al contenido",
  openInNewTab: "se abre en una pestaña nueva",
  nav: {
    mainLabel: "Navegación principal",
    mobileLabel: "Navegación móvil",
    dialogLabel: "Menú de navegación",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    homeHint: "inicio",
    cta: "Hablemos",
  },
  theme: {
    toLight: "Activar modo claro",
    toDark: "Activar modo oscuro",
  },
  hero: {
    primaryCta: "Ver proyectos",
    secondaryCta: "Contactar",
    scrollHint: "Ir a la sección Sobre mí",
  },
  about: {
    eyebrow: "Sobre mí",
    title: "Ingeniero de producto, de la idea al detalle final.",
    facts: [
      { term: "Ubicación", value: profile.location },
      { term: "Enfoque", value: "Web · Producto · DX" },
      { term: "Idiomas", value: "Español · Inglés" },
    ],
  },
  projects: {
    eyebrow: "Proyectos",
    title: "Cosas que he construido.",
    description:
      "Una selección de trabajos recientes. Los datos se cargan desde la API del propio sitio (GET /api/projects).",
    loading: "Cargando proyectos…",
    empty: "Todavía no hay proyectos publicados. Ejecuta `npm run db:seed` para cargar los de ejemplo.",
    error: "No se han podido cargar los proyectos. Comprueba que el servidor está activo.",
    retry: "Reintentar",
    featured: "Destacado",
    codeLink: "Código",
    demoLink: "Ver demo",
    demoPending: "Demo próximamente",
  },
  experience: {
    eyebrow: "Experiencia",
    title: "Trayectoria y herramientas.",
    description:
      "Años construyendo producto en equipos pequeños, donde hay que tocar tanto la interfaz como la infraestructura.",
  },
  contact: {
    eyebrow: "Contacto",
    title: "¿Construimos algo juntos?",
    description:
      "Cuéntame en qué estás trabajando y te responderé lo antes posible. Los mensajes se guardan en el backend del propio sitio.",
    directTitle: "Directo, sin formulario",
    directDescription: "Si prefieres el email o las redes, aquí me tienes.",
    responseTime: "Tiempo de respuesta habitual: 1–2 días laborables.", // PLACEHOLDER
    fields: {
      name: { label: "Nombre", placeholder: "Tu nombre" },
      email: { label: "Email", placeholder: "tu@email.com" },
      message: {
        label: "Mensaje",
        placeholder: "Cuéntame brevemente tu proyecto, plazos y cómo puedo ayudar.",
      },
    },
    submit: "Enviar mensaje",
    submitting: "Enviando…",
    validationError: "Revisa los campos marcados y vuelve a enviarlo.",
    networkError: "No hay conexión con el servidor. Inténtalo de nuevo en un momento.",
    privacy:
      "Al enviar el formulario, tu mensaje se guarda en la base de datos de este sitio. No se comparte con terceros.",
  },
  footer: {
    madeWith: "Hecho con Next.js y SQLite",
    backToTop: "Volver arriba",
  },
} as const;
