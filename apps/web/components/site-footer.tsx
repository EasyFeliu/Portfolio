import { SocialIcon } from "@/components/social-icon";
import { SECTION_IDS, copy, profile, sectionHref, socialLinks } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="hairline-top py-10">
      <div className="container-page flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="text-sm font-medium">{profile.name}</p>
          <p className="mt-1 text-sm text-muted">
            © {new Date().getFullYear()} · {copy.footer.madeWith}
          </p>
        </div>

        <ul className="flex items-center gap-2">
          {socialLinks.map((social) => (
            <li key={social.network}>
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${social.label} (${copy.openInNewTab})`}
                className="inline-flex size-10 items-center justify-center rounded-full border border-hairline text-muted transition-colors hover:bg-subtle hover:text-ink"
              >
                <SocialIcon network={social.network} className="size-[1.1rem]" />
              </a>
            </li>
          ))}
          <li>
            <a
              href={sectionHref(SECTION_IDS.hero)}
              className="ml-1 inline-flex items-center rounded-full px-3 py-2 text-sm text-muted transition-colors hover:text-ink"
            >
              {copy.footer.backToTop}
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
