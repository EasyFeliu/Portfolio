import type { NextConfig } from "next";

/**
 * URL del backend (`apps/api`). El navegador siempre llama a `/api/...` en el
 * mismo origen y Next hace de proxy hacia el backend, así no hay CORS ni URLs
 * absolutas repartidas por el código del cliente.
 */
const apiUrl = process.env.API_URL?.trim() || "http://localhost:4000";

const nextConfig: NextConfig = {
  // El paquete compartido se distribuye como fuente TypeScript.
  transpilePackages: ["@portfolio/shared"],
  // No generamos AGENTS.md/CLAUDE.md dentro del repositorio.
  agentRules: false,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
