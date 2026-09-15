import { z } from "zod";

const text = z.string({ error: "Este campo es obligatorio." }).trim();

/**
 * Esquema compartido entre el formulario (cliente) y `POST /api/contact`
 * (servidor), para que los mensajes de error sean siempre los mismos.
 */
export const contactSchema = z.object({
  name: text
    .min(2, "Escribe tu nombre (al menos 2 caracteres).")
    .max(80, "El nombre no puede superar los 80 caracteres."),
  email: text
    .min(1, "El email es obligatorio.")
    .max(160, "El email no puede superar los 160 caracteres.")
    .pipe(z.email("Introduce un email válido, por ejemplo hola@dominio.com."))
    .transform((value) => value.toLowerCase()),
  message: text
    .min(10, "Cuéntame algo más: mínimo 10 caracteres.")
    .max(2000, "El mensaje no puede superar los 2000 caracteres."),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;

/** Devuelve el primer error por campo, listo para pintar bajo cada input. */
export function fieldErrorsFrom(error: z.ZodError<ContactInput>): Record<string, string> {
  const { fieldErrors } = z.flattenError(error);
  return Object.entries(fieldErrors).reduce<Record<string, string>>((acc, [field, messages]) => {
    const first = messages?.[0];
    if (first) {
      acc[field] = first;
    }
    return acc;
  }, {});
}
