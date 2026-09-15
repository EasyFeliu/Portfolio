import { NextResponse } from "next/server";

import { createContactMessage } from "@/lib/messages";
import { clientKeyFromHeaders, rateLimit } from "@/lib/rate-limit";
import { contactSchema, fieldErrorsFrom } from "@/lib/schemas";
import type { ApiErrorResponse, ContactSuccessResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const limit = rateLimit(`contact:${clientKeyFromHeaders(request.headers)}`);
  if (!limit.allowed) {
    return NextResponse.json<ApiErrorResponse>(
      {
        ok: false,
        error: "RATE_LIMITED",
        message: "Has enviado demasiados mensajes seguidos. Inténtalo de nuevo en unos minutos.",
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json<ApiErrorResponse>(
      {
        ok: false,
        error: "INVALID_JSON",
        message: "El cuerpo de la petición debe ser JSON válido.",
      },
      { status: 400 },
    );
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json<ApiErrorResponse>(
      {
        ok: false,
        error: "VALIDATION_ERROR",
        message: "Revisa los campos marcados y vuelve a enviarlo.",
        errors: fieldErrorsFrom(parsed.error),
      },
      { status: 400 },
    );
  }

  try {
    const saved = createContactMessage(parsed.data);
    return NextResponse.json<ContactSuccessResponse>(
      {
        ok: true,
        id: saved.id,
        message: "¡Gracias! He recibido tu mensaje y te responderé pronto.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[api/contact] no se pudo guardar el mensaje", error);
    return NextResponse.json<ApiErrorResponse>(
      {
        ok: false,
        error: "DATABASE_ERROR",
        message: "No se pudo guardar tu mensaje. Inténtalo de nuevo en un momento.",
      },
      { status: 500 },
    );
  }
}
