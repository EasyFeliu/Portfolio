/**
 * Todo el contenido editable del sitio vive aquí (menos los proyectos, que se
 * sirven desde la API). Cambia estos textos para personalizar el portfolio.
 */

export const profile = {
  name: "Luis Feliu Gomez Polo",
  shortName: "Luis Feliu",
  initials: "LF",
  role: "Software Engineer",
  tagline: "Construyo productos web rápidos, cuidados y fáciles de mantener.",
  location: "España · Remoto",
  email: "hola@luisfeliu.dev",
  availability: "Disponible para nuevos proyectos",
  heroLead:
    "Desarrollo de principio a fin: interfaces con las que apetece interactuar y backends sencillos de operar. Me obsesionan los detalles, el rendimiento y la accesibilidad.",
  about: [
    "Soy Luis Feliu Gomez Polo, ingeniero de software centrado en producto. Me muevo con soltura entre el frontend y el backend: diseño la interfaz, modelo los datos y me aseguro de que todo encaje sin fricción.",
    "Trabajo con TypeScript, React y Node.js, y me gusta cuidar lo que casi nadie ve: tipografía coherente, estados de carga honestos, formularios que explican los errores y APIs con contratos claros.",
    "Cuando no estoy programando, ando leyendo sobre diseño de interfaces, optimizando algún detalle de rendimiento o preparando la siguiente idea que quiero construir.",
  ],
  stats: [
    { value: "+6", label: "años construyendo producto" },
    { value: "+20", label: "proyectos entregados" },
    { value: "100%", label: "enfoque mobile first" },
  ],
} as const;

export const navLinks = [
  { href: "#sobre-mi", label: "Sobre mí" },
  { href: "#proyectos", label: "Proyectos" },
  { href: "#experiencia", label: "Experiencia" },
  { href: "#contacto", label: "Contacto" },
] as const;

export const socialLinks = [
  { href: "https://github.com/EasyFeliu", label: "GitHub", handle: "@EasyFeliu" },
  { href: "https://www.linkedin.com/", label: "LinkedIn", handle: "/in/luisfeliu" },
] as const;

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
