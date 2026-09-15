import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { MAIN_CONTENT_ID, copy } from "@/lib/content";

export default function HomePage() {
  return (
    <>
      <a
        href={`#${MAIN_CONTENT_ID}`}
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:text-accent-contrast"
      >
        {copy.skipToContent}
      </a>

      <SiteHeader />

      <main id={MAIN_CONTENT_ID} className="flex-1">
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Contact />
      </main>

      <SiteFooter />
    </>
  );
}
