import cors from "cors";
import express, { type Express } from "express";
import morgan from "morgan";

import { env, isProduction } from "./env";
import { pruneRateLimitBuckets } from "./rate-limit";
import { errorHandler, notFoundHandler } from "./middleware/error-handler";
import { contactRouter } from "./routes/contact";
import { healthRouter } from "./routes/health";
import { projectsRouter } from "./routes/projects";

const API_PREFIX = "/api";
const JSON_BODY_LIMIT = "16kb";
const BUCKET_PRUNE_INTERVAL_MS = 10 * 60 * 1000;

/** Crea la aplicación sin ponerla a escuchar (útil para tests). */
export function createApp(): Express {
  const app = express();

  // Necesario para que `request.ip` use X-Forwarded-For cuando hay proxy delante.
  app.set("trust proxy", env.trustProxy);
  app.disable("x-powered-by");

  app.use(morgan(isProduction ? "combined" : "dev"));
  app.use(cors({ origin: env.corsOrigins, methods: ["GET", "POST"] }));
  app.use(express.json({ limit: JSON_BODY_LIMIT }));

  app.use(API_PREFIX, healthRouter, projectsRouter, contactRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

/** Evita que el mapa del límite de peticiones crezca indefinidamente. */
export function startRateLimitCleanup(): NodeJS.Timeout {
  const timer = setInterval(() => pruneRateLimitBuckets(), BUCKET_PRUNE_INTERVAL_MS);
  timer.unref();
  return timer;
}
