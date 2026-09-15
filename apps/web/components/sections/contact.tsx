"use client";

import { useState } from "react";

import { CONTACT_LIMITS, contactSchema, fieldErrorsFrom } from "@portfolio/shared";

import { AlertIcon, CheckIcon, MailIcon, SpinnerIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { SocialIcon } from "@/components/social-icon";
import { submitContact } from "@/lib/api";
import { SECTION_IDS, copy, profile, socialLinks } from "@/lib/content";

type Status = "idle" | "submitting" | "success" | "error";

const MESSAGE_ROWS = 5;

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
      setFeedback(copy.contact.validationError);
      return;
    }

    setErrors({});
    setStatus("submitting");
    setFeedback("");

    try {
      const result = await submitContact(parsed.data);

      if (!result.ok) {
        setErrors(result.errors);
        setStatus("error");
        setFeedback(result.message);
        return;
      }

      setForm(emptyForm);
      setStatus("success");
      setFeedback(result.message);
    } catch {
      setStatus("error");
      setFeedback(copy.contact.networkError);
    }
  }

  const isSubmitting = status === "submitting";

  return (
    <section id={SECTION_IDS.contact} className="bg-subtle/60 py-20 sm:py-28 lg:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow={copy.contact.eyebrow}
          title={copy.contact.title}
          description={copy.contact.description}
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
          <Reveal className="flex flex-col gap-4">
            <div className="card p-6 sm:p-7">
              <h3 className="text-lg font-semibold tracking-tight">{copy.contact.directTitle}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
                {copy.contact.directDescription}
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
                    key={social.network}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group flex items-center gap-3 rounded-xl px-2 py-2.5 text-[0.9375rem] transition-colors hover:bg-subtle"
                  >
                    <SocialIcon
                      network={social.network}
                      className="size-[1.15rem] text-muted transition-colors group-hover:text-accent"
                    />
                    <span className="truncate">{social.label}</span>
                    <span className="ml-auto text-sm text-faint">{social.handle}</span>
                    <span className="sr-only">{` (${copy.openInNewTab})`}</span>
                  </a>
                ))}
              </div>
            </div>

            <p className="px-2 text-sm leading-relaxed text-muted">{copy.contact.responseTime}</p>
          </Reveal>

          <Reveal delay={120}>
            <form onSubmit={handleSubmit} noValidate className="card p-6 sm:p-7">
              <div className="flex flex-col gap-5">
                <Field
                  id="name"
                  label={copy.contact.fields.name.label}
                  placeholder={copy.contact.fields.name.placeholder}
                  autoComplete="name"
                  maxLength={CONTACT_LIMITS.name.max}
                  value={form.name}
                  error={errors.name}
                  disabled={isSubmitting}
                  onChange={updateField("name")}
                />

                <Field
                  id="email"
                  type="email"
                  label={copy.contact.fields.email.label}
                  placeholder={copy.contact.fields.email.placeholder}
                  autoComplete="email"
                  inputMode="email"
                  maxLength={CONTACT_LIMITS.email.max}
                  value={form.email}
                  error={errors.email}
                  disabled={isSubmitting}
                  onChange={updateField("email")}
                />

                <div className="flex flex-col gap-2">
                  <div className="flex items-baseline justify-between gap-3">
                    <label htmlFor="message" className="text-sm font-medium">
                      {copy.contact.fields.message.label}
                    </label>
                    <span className="text-xs text-faint" aria-hidden="true">
                      {form.message.length}/{CONTACT_LIMITS.message.max}
                    </span>
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    rows={MESSAGE_ROWS}
                    required
                    maxLength={CONTACT_LIMITS.message.max}
                    placeholder={copy.contact.fields.message.placeholder}
                    className="field-input resize-y"
                    value={form.message}
                    disabled={isSubmitting}
                    aria-invalid={errors.message ? "true" : undefined}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    onChange={(event) => updateField("message")(event.target.value)}
                  />
                  {errors.message ? (
                    <p id="message-error" className="field-error">
                      {errors.message}
                    </p>
                  ) : null}
                </div>

                <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <SpinnerIcon className="size-[1.1rem] animate-spin" />
                      {copy.contact.submitting}
                    </>
                  ) : (
                    copy.contact.submit
                  )}
                </button>

                <div aria-live="polite" role="status" className="min-h-6">
                  {status === "success" && feedback ? (
                    <p className="notice notice-success">
                      <CheckIcon className="mt-0.5 size-4 shrink-0" />
                      {feedback}
                    </p>
                  ) : null}

                  {status === "error" && feedback ? (
                    <p className="notice notice-error">
                      <AlertIcon className="mt-0.5 size-4 shrink-0" />
                      {feedback}
                    </p>
                  ) : null}
                </div>

                <p className="text-xs leading-relaxed text-faint">{copy.contact.privacy}</p>
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
  maxLength?: number;
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
  maxLength,
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
        maxLength={maxLength}
        disabled={disabled}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? (
        <p id={`${id}-error`} className="field-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
