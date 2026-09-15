import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { SECTION_IDS, copy, experience, skillGroups } from "@/lib/content";

export function Experience() {
  return (
    <section id={SECTION_IDS.experience} className="py-20 sm:py-28 lg:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow={copy.experience.eyebrow}
          title={copy.experience.title}
          description={copy.experience.description}
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          <ol className="relative flex flex-col gap-8 border-l border-hairline pl-6 sm:pl-8">
            {experience.map((item, index) => (
              <Reveal as="li" key={item.period} delay={index * 90} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute top-2 -left-[1.9rem] size-2.5 rounded-full bg-accent ring-4 ring-canvas sm:-left-[2.4rem]"
                />
                <p className="text-[0.8125rem] font-medium tracking-wide text-faint uppercase">
                  {item.period}
                </p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight sm:text-xl">{item.role}</h3>
                <p className="text-[0.9375rem] text-accent">{item.company}</p>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{item.description}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {item.highlights.map((highlight) => (
                    <li key={highlight} className="chip">
                      {highlight}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </ol>

          <div className="flex flex-col gap-5">
            {skillGroups.map((group, index) => (
              <Reveal key={group.title} delay={index * 90}>
                <div className="card p-6">
                  <h3 className="text-[0.8125rem] font-semibold tracking-wide text-faint uppercase">
                    {group.title}
                  </h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li key={item} className="chip bg-transparent">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
