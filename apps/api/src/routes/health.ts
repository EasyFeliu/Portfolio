import type { ApiErrorResponse, HealthResponse } from "@portfolio/shared";
import { Router } from "express";

import { logger } from "../logger";
import { countContactMessages } from "../messages";
import { countProjects } from "../projects";

export const healthRouter = Router();

healthRouter.get("/health", (_request, response) => {
  try {
    const body: HealthResponse = {
      ok: true,
      status: "ok",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.round(process.uptime()),
      database: { ok: true, projects: countProjects(), messages: countContactMessages() },
    };
    response.json(body);
  } catch (error) {
    logger.error("health: la base de datos no responde", { error: String(error) });
    const body: ApiErrorResponse = {
      ok: false,
      error: "DATABASE_ERROR",
      message: "No se pudo consultar la base de datos.",
    };
    response.status(503).json(body);
  }
});
