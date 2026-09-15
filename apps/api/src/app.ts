import cors from "@fastify/cors";
import type { ApiErrorResponse } from "@portfolio/shared";
import Fastify, { type FastifyError, type FastifyInstance } from "fastify";

import { env, isProduction } from "./env";
import { pruneRateLimitBuckets } from "./rate-limit";
import { contactRoutes } from "./routes/contact";
import { healthRoutes } from "./routes/health";
import { projectRoutes } from "./routes/projects";

const API_PREFIX = "/api";
const BUCKET_PRUNE_INTERVAL_MS = 10 * 60 * 1000;

/** Errores del parser de cuerpo de Fastify (JSON inválido, vacío, ilegible…). */
const BODY_PARSER_ERROR_PREFIX = "FST_ERR_CTP_";

/** Crea la aplicación sin ponerla a escuchar (útil para tests). */
export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: { level: isProduction ? "info" : "debug" },
    trustProxy: env.trustProxy,
  });

  await app.register(cors, {
    origin: env.corsOrigins,
    methods: ["GET", "POST"],
  });

  app.setNotFoundHandler((request, reply) => {
    const body: ApiErrorResponse = {
      ok: false,
      error: "NOT_FOUND",
      message: `No existe el endpoint ${request.method} ${request.url}.`,
    };
    return reply.code(404).send(body);
  });

  app.setErrorHandler((error: FastifyError, _request, reply) => {
    if (error.code?.startsWith(BODY_PARSER_ERROR_PREFIX)) {
      const body: ApiErrorResponse = {
        ok: false,
        error: "INVALID_JSON",
        message: "El cuerpo de la petición debe ser JSON válido.",
      };
      return reply.code(400).send(body);
    }

    app.log.error({ error }, "error no controlado");
    const body: ApiErrorResponse = {
      ok: false,
      error: "INTERNAL_ERROR",
      message: "Error inesperado en el servidor.",
    };
    return reply.code(error.statusCode && error.statusCode < 500 ? error.statusCode : 500).send(body);
  });

  // Las rutas se registran después de los manejadores para que hereden ambos.
  await app.register(
    async (instance) => {
      await instance.register(healthRoutes);
      await instance.register(projectRoutes);
      await instance.register(contactRoutes);
    },
    { prefix: API_PREFIX },
  );

  // Evita que el mapa del límite de peticiones crezca indefinidamente.
  const pruneTimer = setInterval(() => pruneRateLimitBuckets(), BUCKET_PRUNE_INTERVAL_MS);
  pruneTimer.unref();
  app.addHook("onClose", async () => clearInterval(pruneTimer));

  return app;
}
