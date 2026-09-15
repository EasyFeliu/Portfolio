import type { ApiErrorResponse } from "@portfolio/shared";
import type { ErrorRequestHandler, RequestHandler } from "express";

import { logger } from "../logger";

/** Error del parser de JSON de Express (`express.json`). */
function isJsonSyntaxError(error: unknown): boolean {
  return error instanceof SyntaxError && "body" in error;
}

function isPayloadTooLarge(error: unknown): boolean {
  return typeof error === "object" && error !== null && "type" in error
    ? (error as { type?: string }).type === "entity.too.large"
    : false;
}

export const notFoundHandler: RequestHandler = (request, response) => {
  const body: ApiErrorResponse = {
    ok: false,
    error: "NOT_FOUND",
    message: `No existe el endpoint ${request.method} ${request.originalUrl}.`,
  };
  response.status(404).json(body);
};

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (isJsonSyntaxError(error)) {
    const body: ApiErrorResponse = {
      ok: false,
      error: "INVALID_JSON",
      message: "El cuerpo de la petición debe ser JSON válido.",
    };
    response.status(400).json(body);
    return;
  }

  if (isPayloadTooLarge(error)) {
    const body: ApiErrorResponse = {
      ok: false,
      error: "PAYLOAD_TOO_LARGE",
      message: "El cuerpo de la petición es demasiado grande.",
    };
    response.status(413).json(body);
    return;
  }

  logger.error("error no controlado", { error: String(error) });
  const body: ApiErrorResponse = {
    ok: false,
    error: "INTERNAL_ERROR",
    message: "Error inesperado en el servidor.",
  };
  response.status(500).json(body);
};
