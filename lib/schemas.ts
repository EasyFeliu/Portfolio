import { z } from "zod";

/**
 * Límites del formulario de contacto. Son la única fuente de verdad: los usan
 * el esquema de validación, los atributos del formulario y el README.
 */
export const CONTACT_LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 160 },
  message: { min: 10, max: 2000 },
} as const;

const text = z.string({ error: "Este campo es obligatorio." }).trim();

/**
 * Esquema compartido entre el formulario (cliente) y `POST /api/contact`
 * (servidor), para que los mensajes de error sean siempre los mismos.
 */
export const contactSchema = z.object({
  name: text
    .min(CONTACT_LIMITS.name.min, `Escribe tu nombre (al menos ${CONTACT_LIMITS.name.min} caracteres).`)
    .max(CONTACT_LIMITS.name.max, `El nombre no puede superar los ${CONTACT_LIMITS.name.max} caracteres.`),
  email: text
    .min(1, "El email es obligatorio.")
    .max(CONTACT_LIMITS.email.max, `El email no puede superar los ${CONTACT_LIMITS.email.max} caracteres.`)
    .pipe(z.email("Introduce un email válido, por ejemplo hola@dominio.com."))
    .transform((value) => value.toLowerCase()),
  message: text
    .min(CONTACT_LIMITS.message.min, `Cuéntame algo más: mínimo ${CONTACT_LIMITS.message.min} caracteres.`)
    .max(
      CONTACT_LIMITS.message.max,
      `El mensaje no puede superar los ${CONTACT_LIMITS.message.max} caracteres.`,
    ),
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
