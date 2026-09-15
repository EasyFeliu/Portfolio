import { createApp, startRateLimitCleanup } from "./app";
import { closeDb, getDb } from "./db";
import { env } from "./env";
import { logger } from "./logger";

function main(): void {
  // Abre la base de datos al arrancar: si el esquema o el disco fallan,
  // preferimos enterarnos ahora y no en la primera petición.
  getDb();

  const app = createApp();
  const cleanupTimer = startRateLimitCleanup();

  const server = app.listen(env.port, env.host, () => {
    logger.info("API escuchando", { url: `http://${env.host}:${env.port}`, env: env.nodeEnv });
  });

  server.on("error", (error) => {
    logger.error("no se pudo arrancar el servidor", { error: String(error) });
    process.exit(1);
  });

  const shutdown = (signal: string) => {
    logger.info("cerrando servidor", { signal });
    clearInterval(cleanupTimer);
    server.close(() => {
      closeDb();
      process.exit(0);
    });
  };

  for (const signal of ["SIGINT", "SIGTERM"] as const) {
    process.on(signal, () => shutdown(signal));
  }
}

main();
