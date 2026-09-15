import type { ApiErrorResponse, HealthResponse } from "@portfolio/shared";
import type { FastifyPluginAsync } from "fastify";

import { countContactMessages } from "../messages";
import { countProjects } from "../projects";

export const healthRoutes: FastifyPluginAsync = async (app) => {
  app.get("/health", async (_request, reply) => {
    try {
      const body: HealthResponse = {
        ok: true,
        status: "ok",
        timestamp: new Date().toISOString(),
        uptimeSeconds: Math.round(process.uptime()),
        database: { ok: true, projects: countProjects(), messages: countContactMessages() },
      };
      return body;
    } catch (error) {
      app.log.error({ error }, "health: la base de datos no responde");
      const body: ApiErrorResponse = {
        ok: false,
        error: "DATABASE_ERROR",
        message: "No se pudo consultar la base de datos.",
      };
      return reply.code(503).send(body);
    }
  });
};
