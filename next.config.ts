import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // better-sqlite3 es un módulo nativo: debe cargarse desde node_modules en
  // tiempo de ejecución en lugar de empaquetarse con el bundle del servidor.
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
