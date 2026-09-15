"use client";

import { useEffect, useRef } from "react";

type RevealProps = {
  children: React.ReactNode;
  /** Retardo en ms para encadenar apariciones. */
  delay?: number;
  className?: string;
  as?: "div" | "li" | "article" | "section";
};

/**
 * Muestra su contenido con un fundido suave cuando entra en el viewport.
 * La visibilidad se marca directamente en el DOM (`data-visible`) para evitar
 * renders en cascada; si el usuario prefiere menos movimiento, aparece ya visible.
 */
export function Reveal({ children, delay = 0, className, as: Tag = "div" }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const show = () => {
      node.dataset.visible = "true";
    };

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      show();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            show();
            observer.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={["reveal", className].filter(Boolean).join(" ")}
      data-visible="false"
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
