import type { ApiErrorResponse, ProjectsResponse } from "@portfolio/shared";
import { Router } from "express";

import { logger } from "../logger";
import { listProjects } from "../projects";

export const projectsRouter = Router();

projectsRouter.get("/projects", (_request, response) => {
  try {
    const projects = listProjects();
    const body: ProjectsResponse = { ok: true, count: projects.length, projects };
    response.json(body);
  } catch (error) {
    logger.error("projects: no se pudieron leer los proyectos", { error: String(error) });
    const body: ApiErrorResponse = {
      ok: false,
      error: "DATABASE_ERROR",
      message: "No se pudieron cargar los proyectos.",
    };
    response.status(500).json(body);
  }
});
