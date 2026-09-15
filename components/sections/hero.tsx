import { ArrowDownIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { profile } from "@/lib/content";

export function Hero() {
  return (
    <section id="inicio" className="relative isolate overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28 lg:pt-44">
      <div className="hero-glow" aria-hidden="true" />

      <div className="container-page flex flex-col items-center text-center">
        <Reveal>
          <p className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-hairline bg-surface/70 px-3.5 py-1.5 text-[0.8125rem] font-medium text-muted shadow-soft">
            <span
              aria-hidden="true"
              className="size-2 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgb(16_185_129/0.18)]"
            />
            {profile.availability}
          </p>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="mt-7 text-[clamp(2.75rem,11vw,5.5rem)] leading-[0.98] font-semibold tracking-[-0.04em]">
            <span className="text-gradient block">{profile.name}</span>
          </h1>
        </Reveal>

        <Reveal delay={150}>
          <p className="mt-5 text-[clamp(1.125rem,4.6vw,1.75rem)] leading-snug font-medium text-ink/90">
            {profile.tagline}
          </p>
        </Reveal>

        <Reveal delay={220}>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {profile.heroLead}
          </p>
        </Reveal>

        <Reveal delay={300} className="mt-9 w-full">
          <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
            <a href="#proyectos" className="btn btn-primary">
              Ver proyectos
            </a>
            <a href="#contacto" className="btn btn-secondary">
              Contactar
            </a>
          </div>
        </Reveal>

        <Reveal delay={380} className="mt-14 w-full sm:mt-20">
          <dl className="mx-auto grid w-full max-w-lg grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-card)] border border-hairline bg-hairline sm:grid-cols-3">
            {profile.stats.map((stat) => (
              <div key={stat.label} className="bg-canvas px-5 py-5 text-center">
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block text-2xl font-semibold tracking-tight sm:text-3xl">
                    {stat.value}
                  </span>
                  <span className="mt-1 block text-[0.8125rem] leading-snug text-muted">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <a
          href="#sobre-mi"
          aria-label="Ir a la sección Sobre mí"
          className="mt-14 inline-flex size-11 items-center justify-center rounded-full border border-hairline text-muted transition-colors hover:bg-subtle hover:text-ink sm:mt-20"
        >
          <ArrowDownIcon className="size-5" />
        </a>
      </div>
    </section>
  );
}
