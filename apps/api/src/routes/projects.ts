import type { ApiErrorResponse, ProjectsResponse } from "@portfolio/shared";
import type { FastifyPluginAsync } from "fastify";

import { listProjects } from "../projects";

export const projectRoutes: FastifyPluginAsync = async (app) => {
  app.get("/projects", async (_request, reply) => {
    try {
      const projects = listProjects();
      const body: ProjectsResponse = { ok: true, count: projects.length, projects };
      return body;
    } catch (error) {
      app.log.error({ error }, "projects: no se pudieron leer los proyectos");
      const body: ApiErrorResponse = {
        ok: false,
        error: "DATABASE_ERROR",
        message: "No se pudieron cargar los proyectos.",
      };
      return reply.code(500).send(body);
    }
  });
};
