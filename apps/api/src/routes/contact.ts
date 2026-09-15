import {
  contactSchema,
  fieldErrorsFrom,
  type ApiErrorResponse,
  type ContactSuccessResponse,
} from "@portfolio/shared";
import { Router } from "express";

import { logger } from "../logger";
import { createContactMessage } from "../messages";
import { rateLimit } from "../rate-limit";

export const contactRouter = Router();

/** `express.json()` deja `body` sin definir si la petición no trae cuerpo. */
function isJsonObject(body: unknown): body is Record<string, unknown> {
  return typeof body === "object" && body !== null && !Array.isArray(body);
}

contactRouter.post("/contact", (request, response) => {
  const limit = rateLimit(`contact:${request.ip ?? "desconocida"}`);
  if (!limit.allowed) {
    const body: ApiErrorResponse = {
      ok: false,
      error: "RATE_LIMITED",
      message: "Has enviado demasiados mensajes seguidos. Inténtalo de nuevo en unos minutos.",
    };
    response.status(429).set("Retry-After", String(limit.retryAfterSeconds)).json(body);
    return;
  }

  if (!isJsonObject(request.body)) {
    const body: ApiErrorResponse = {
      ok: false,
      error: "INVALID_JSON",
      message: "El cuerpo debe ser un objeto JSON con los campos name, email y message.",
    };
    response.status(400).json(body);
    return;
  }

  const parsed = contactSchema.safeParse(request.body);
  if (!parsed.success) {
    const body: ApiErrorResponse = {
      ok: false,
      error: "VALIDATION_ERROR",
      message: "Revisa los campos marcados y vuelve a enviarlo.",
      errors: fieldErrorsFrom(parsed.error),
    };
    response.status(400).json(body);
    return;
  }

  try {
    const saved = createContactMessage(parsed.data);
    logger.info("contact: mensaje guardado", { id: saved.id });

    const body: ContactSuccessResponse = {
      ok: true,
      id: saved.id,
      message: "¡Gracias! He recibido tu mensaje y te responderé pronto.",
    };
    response.status(201).json(body);
  } catch (error) {
    logger.error("contact: no se pudo guardar el mensaje", { error: String(error) });
    const body: ApiErrorResponse = {
      ok: false,
      error: "DATABASE_ERROR",
      message: "No se pudo guardar tu mensaje. Inténtalo de nuevo en un momento.",
    };
    response.status(500).json(body);
  }
});
