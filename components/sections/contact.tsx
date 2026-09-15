"use client";

import { useState } from "react";

import { AlertIcon, CheckIcon, GithubIcon, LinkedinIcon, MailIcon, SpinnerIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { profile, socialLinks } from "@/lib/content";
import { contactSchema, fieldErrorsFrom } from "@/lib/schemas";
import type { ApiErrorResponse, ContactSuccessResponse } from "@/lib/types";

type Status = "idle" | "submitting" | "success" | "error";

const MESSAGE_MAX_LENGTH = 2000;

const emptyForm = { name: "", email: "", message: "" };

export function Contact() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");

  const updateField = (field: keyof typeof emptyForm) => (value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      setErrors(fieldErrorsFrom(parsed.error));
      setStatus("error");
      setFeedback("Revisa los campos marcados y vuelve a enviarlo.");
      return;
    }

    setErrors({});
    setStatus("submitting");
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = (await response.json()) as ContactSuccessResponse | ApiErrorResponse;

      if (!response.ok || !data.ok) {
        const error = data as ApiErrorResponse;
        setErrors(error.errors ?? {});
        setStatus("error");
        setFeedback(error.message ?? "No se pudo enviar el mensaje. Inténtalo de nuevo.");
        return;
      }

      setForm(emptyForm);
      setStatus("success");
      setFeedback(data.message);
    } catch {
      setStatus("error");
      setFeedback("No hay conexión con el servidor. Inténtalo de nuevo en un momento.");
    }
  }

  const isSubmitting = status === "submitting";

  return (
    <section id="contacto" className="scroll-mt-24 bg-subtle/60 py-20 sm:py-28 lg:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="Contacto"
          title="¿Construimos algo juntos?"
          description="Cuéntame en qué estás trabajando y te responderé lo antes posible. Los mensajes se guardan en el backend del propio sitio."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
          <Reveal className="flex flex-col gap-4">
            <div className="card p-6 sm:p-7">
              <h3 className="text-lg font-semibold tracking-tight">Directo, sin formulario</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
                Si prefieres el email o las redes, aquí me tienes.
              </p>

              <div className="mt-5 flex flex-col gap-2">
                <a
                  href={`mailto:${profile.email}`}
                  className="group flex items-center gap-3 rounded-xl px-2 py-2.5 text-[0.9375rem] transition-colors hover:bg-subtle"
                >
                  <MailIcon className="size-[1.15rem] text-muted transition-colors group-hover:text-accent" />
                  <span className="truncate">{profile.email}</span>
                </a>
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group flex items-center gap-3 rounded-xl px-2 py-2.5 text-[0.9375rem] transition-colors hover:bg-subtle"
                  >
                    {social.label === "GitHub" ? (
                      <GithubIcon className="size-[1.15rem] text-muted transition-colors group-hover:text-accent" />
                    ) : (
                      <LinkedinIcon className="size-[1.15rem] text-muted transition-colors group-hover:text-accent" />
                    )}
                    <span className="truncate">{social.label}</span>
                    <span className="ml-auto text-sm text-faint">{social.handle}</span>
                  </a>
                ))}
              </div>
            </div>

            <p className="px-2 text-sm leading-relaxed text-muted">
              Tiempo de respuesta habitual: 1–2 días laborables.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <form onSubmit={handleSubmit} noValidate className="card p-6 sm:p-7">
              <div className="flex flex-col gap-5">
                <Field
                  id="name"
                  label="Nombre"
                  placeholder="Tu nombre"
                  autoComplete="name"
                  value={form.name}
                  error={errors.name}
                  disabled={isSubmitting}
                  onChange={updateField("name")}
                />

                <Field
                  id="email"
                  type="email"
                  label="Email"
                  placeholder="tu@email.com"
                  autoComplete="email"
                  inputMode="email"
                  value={form.email}
                  error={errors.email}
                  disabled={isSubmitting}
                  onChange={updateField("email")}
                />

                <div className="flex flex-col gap-2">
                  <div className="flex items-baseline justify-between gap-3">
                    <label htmlFor="message" className="text-sm font-medium">
                      Mensaje
                    </label>
                    <span className="text-xs text-faint" aria-hidden="true">
                      {form.message.length}/{MESSAGE_MAX_LENGTH}
                    </span>
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    maxLength={MESSAGE_MAX_LENGTH}
                    placeholder="Cuéntame brevemente tu proyecto, plazos y cómo puedo ayudar."
                    className="field-input resize-y"
                    value={form.message}
                    disabled={isSubmitting}
                    aria-invalid={errors.message ? "true" : undefined}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    onChange={(event) => updateField("message")(event.target.value)}
                  />
                  {errors.message ? (
                    <p id="message-error" className="text-sm text-[#e5484d]">
                      {errors.message}
                    </p>
                  ) : null}
                </div>

                <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <SpinnerIcon className="size-[1.1rem] animate-spin" />
                      Enviando…
                    </>
                  ) : (
                    "Enviar mensaje"
                  )}
                </button>

                <div aria-live="polite" role="status" className="min-h-6">
                  {status === "success" && feedback ? (
                    <p className="flex items-start gap-2 rounded-xl bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-700 dark:text-emerald-400">
                      <CheckIcon className="mt-0.5 size-4 shrink-0" />
                      {feedback}
                    </p>
                  ) : null}

                  {status === "error" && feedback ? (
                    <p className="flex items-start gap-2 rounded-xl bg-[#e5484d]/10 px-3 py-2.5 text-sm text-[#c62a2f] dark:text-[#ff9ea1]">
                      <AlertIcon className="mt-0.5 size-4 shrink-0" />
                      {feedback}
                    </p>
                  ) : null}
                </div>

                <p className="text-xs leading-relaxed text-faint">
                  Al enviar el formulario, tu mensaje se guarda en la base de datos de este sitio. No se
                  comparte con terceros.
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

type FieldProps = {
  id: "name" | "email";
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: "text" | "email";
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "email";
  disabled?: boolean;
};

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  autoComplete,
  inputMode,
  disabled,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required
        className="field-input"
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        disabled={disabled}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? (
        <p id={`${id}-error`} className="text-sm text-[#e5484d]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
