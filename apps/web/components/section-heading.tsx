import { Reveal } from "@/components/reveal";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "start" | "center";
};

export function SectionHeading({ eyebrow, title, description, align = "start" }: SectionHeadingProps) {
  const alignment = align === "center" ? "items-center text-center mx-auto" : "items-start";

  return (
    <Reveal className={`flex max-w-2xl flex-col gap-3 ${alignment}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="text-3xl leading-[1.08] sm:text-4xl lg:text-5xl">{title}</h2>
      {description ? (
        <p className="max-w-xl text-base leading-relaxed text-muted sm:text-lg">{description}</p>
      ) : null}
    </Reveal>
  );
}
