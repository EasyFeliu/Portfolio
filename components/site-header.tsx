"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { CloseIcon, MenuIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { navLinks, profile } from "@/lib/content";

const sectionIds = navLinks.map((link) => link.href.replace("#", ""));

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Resalta en el menú la sección que se está viendo.
  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null);

    if (sections.length === 0 || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          setActiveSection(visible.target.id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.2, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen, closeMenu]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={[
          "glass-bar transition-[border-color,box-shadow] duration-300",
          scrolled || menuOpen ? "border-b border-hairline" : "border-b border-transparent",
        ].join(" ")}
      >
        <div className="container-page flex h-14 items-center justify-between gap-4 sm:h-16">
          <a
            href="#inicio"
            className="rounded-full text-[0.9375rem] font-semibold tracking-tight text-ink transition-opacity hover:opacity-70"
            onClick={() => setMenuOpen(false)}
          >
            {profile.shortName}
            <span className="sr-only"> — inicio</span>
          </a>

          <nav aria-label="Navegación principal" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.replace("#", "");
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      aria-current={isActive ? "true" : undefined}
                      className={[
                        "inline-flex items-center rounded-full px-3.5 py-2 text-[0.875rem] transition-colors duration-200",
                        isActive ? "bg-subtle text-ink" : "text-muted hover:text-ink",
                      ].join(" ")}
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a href="#contacto" className="btn btn-primary hidden min-h-9 px-4 py-2 text-sm md:inline-flex">
              Hablemos
            </a>
            <button
              ref={menuButtonRef}
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-full border border-hairline text-ink transition-colors hover:bg-subtle active:scale-95 md:hidden"
              aria-expanded={menuOpen}
              aria-controls="menu-movil"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      <div
        id="menu-movil"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        hidden={!menuOpen}
        className="glass-bar h-[calc(100dvh-3.5rem)] overflow-y-auto border-b border-hairline md:hidden"
      >
        <nav aria-label="Navegación móvil" className="container-page py-4">
          <ul className="flex flex-col">
            {navLinks.map((link) => (
              <li key={link.href} className="border-b border-hairline last:border-b-0">
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between py-4 text-2xl font-semibold tracking-tight text-ink transition-opacity active:opacity-60"
                >
                  {link.label}
                  <span aria-hidden="true" className="text-muted">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#contacto"
            onClick={() => setMenuOpen(false)}
            className="btn btn-primary mt-6 w-full"
          >
            Hablemos
          </a>
        </nav>
      </div>
    </header>
  );
}
