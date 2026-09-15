import { GithubIcon, LinkedinIcon, MailIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { profile, socialLinks } from "@/lib/content";

const socialIcons = {
  GitHub: GithubIcon,
  LinkedIn: LinkedinIcon,
} as const;

export function About() {
  return (
    <section id="sobre-mi" className="py-20 sm:py-28 lg:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="Sobre mí"
          title="Ingeniero de producto, de la idea al detalle final."
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-start lg:gap-14">
          <div className="flex flex-col gap-5">
            {profile.about.map((paragraph, index) => (
              <Reveal key={paragraph.slice(0, 24)} delay={index * 90}>
                <p className="text-base leading-relaxed text-muted sm:text-lg sm:leading-relaxed">
                  {paragraph}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <div className="card p-6 sm:p-7">
              <div className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="flex size-14 items-center justify-center rounded-2xl bg-accent-soft text-lg font-semibold tracking-tight text-accent"
                >
                  {profile.initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold">{profile.shortName}</p>
                  <p className="truncate text-sm text-muted">{profile.role}</p>
                </div>
              </div>

              <dl className="mt-6 flex flex-col gap-3 text-sm">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-muted">Ubicación</dt>
                  <dd className="text-right font-medium">{profile.location}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-muted">Enfoque</dt>
                  <dd className="text-right font-medium">Web · Producto · DX</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-muted">Idiomas</dt>
                  <dd className="text-right font-medium">Español · Inglés</dd>
                </div>
              </dl>

              <div className="mt-6 flex flex-col gap-2 border-t border-hairline pt-5">
                <a
                  href={`mailto:${profile.email}`}
                  className="group flex items-center gap-3 rounded-xl px-2 py-2 text-sm transition-colors hover:bg-subtle"
                >
                  <MailIcon className="size-[1.1rem] text-muted transition-colors group-hover:text-accent" />
                  <span className="truncate">{profile.email}</span>
                </a>

                {socialLinks.map((social) => {
                  const IconComponent = socialIcons[social.label as keyof typeof socialIcons];
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group flex items-center gap-3 rounded-xl px-2 py-2 text-sm transition-colors hover:bg-subtle"
                    >
                      {IconComponent ? (
                        <IconComponent className="size-[1.1rem] text-muted transition-colors group-hover:text-accent" />
                      ) : null}
                      <span className="truncate">{social.handle}</span>
                      <span className="sr-only">{`Perfil de ${social.label} (se abre en una pestaña nueva)`}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
