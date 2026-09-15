import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { profile, socialLinks } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="hairline-top py-10">
      <div className="container-page flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="text-sm font-medium">{profile.name}</p>
          <p className="mt-1 text-sm text-muted">
            © {new Date().getFullYear()} · Hecho con Next.js y SQLite
          </p>
        </div>

        <ul className="flex items-center gap-2">
          {socialLinks.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${social.label} (se abre en una pestaña nueva)`}
                className="inline-flex size-10 items-center justify-center rounded-full border border-hairline text-muted transition-colors hover:bg-subtle hover:text-ink"
              >
                {social.label === "GitHub" ? (
                  <GithubIcon className="size-[1.1rem]" />
                ) : (
                  <LinkedinIcon className="size-[1.1rem]" />
                )}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#inicio"
              className="ml-1 inline-flex items-center rounded-full px-3 py-2 text-sm text-muted transition-colors hover:text-ink"
            >
              Volver arriba
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
