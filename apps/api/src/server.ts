import { buildApp } from "./app";
import { closeDb, getDb } from "./db";
import { env } from "./env";

async function main(): Promise<void> {
  // Abre la base de datos al arrancar: si el esquema o el disco fallan,
  // preferimos enterarnos ahora y no en la primera petición.
  getDb();

  const app = await buildApp();

  const shutdown = async (signal: string) => {
    app.log.info({ signal }, "cerrando servidor");
    await app.close();
    closeDb();
    process.exit(0);
  };

  for (const signal of ["SIGINT", "SIGTERM"] as const) {
    process.on(signal, () => void shutdown(signal));
  }

  try {
    await app.listen({ host: env.host, port: env.port });
  } catch (error) {
    app.log.error({ error }, "no se pudo arrancar el servidor");
    process.exit(1);
  }
}

void main();
