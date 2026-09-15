import {
  contactSchema,
  fieldErrorsFrom,
  type ApiErrorResponse,
  type ContactSuccessResponse,
} from "@portfolio/shared";
import type { FastifyPluginAsync } from "fastify";

import { createContactMessage } from "../messages";
import { rateLimit } from "../rate-limit";

export const contactRoutes: FastifyPluginAsync = async (app) => {
  app.post("/contact", async (request, reply) => {
    const limit = rateLimit(`contact:${request.ip}`);
    if (!limit.allowed) {
      const body: ApiErrorResponse = {
        ok: false,
        error: "RATE_LIMITED",
        message: "Has enviado demasiados mensajes seguidos. Inténtalo de nuevo en unos minutos.",
      };
      return reply.code(429).header("Retry-After", String(limit.retryAfterSeconds)).send(body);
    }

    const parsed = contactSchema.safeParse(request.body);
    if (!parsed.success) {
      const body: ApiErrorResponse = {
        ok: false,
        error: "VALIDATION_ERROR",
        message: "Revisa los campos marcados y vuelve a enviarlo.",
        errors: fieldErrorsFrom(parsed.error),
      };
      return reply.code(400).send(body);
    }

    try {
      const saved = createContactMessage(parsed.data);
      app.log.info({ id: saved.id }, "contact: mensaje guardado");

      const body: ContactSuccessResponse = {
        ok: true,
        id: saved.id,
        message: "¡Gracias! He recibido tu mensaje y te responderé pronto.",
      };
      return reply.code(201).send(body);
    } catch (error) {
      app.log.error({ error }, "contact: no se pudo guardar el mensaje");
      const body: ApiErrorResponse = {
        ok: false,
        error: "DATABASE_ERROR",
        message: "No se pudo guardar tu mensaje. Inténtalo de nuevo en un momento.",
      };
      return reply.code(500).send(body);
    }
  });
};
