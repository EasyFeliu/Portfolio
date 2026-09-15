import { isProduction } from "./env";

type Level = "info" | "warn" | "error";

/**
 * Log mínimo: JSON por línea en producción (fácil de ingerir) y legible en
 * desarrollo. Suficiente para esta API; si crece, aquí se enchufa pino.
 */
function write(level: Level, message: string, meta?: Record<string, unknown>): void {
  const stream = level === "error" ? console.error : console.log;

  if (isProduction) {
    stream(JSON.stringify({ level, time: new Date().toISOString(), message, ...meta }));
    return;
  }

  stream(`[${level}] ${message}`, meta ?? "");
}

export const logger = {
  info: (message: string, meta?: Record<string, unknown>) => write("info", message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => write("warn", message, meta),
  error: (message: string, meta?: Record<string, unknown>) => write("error", message, meta),
};
