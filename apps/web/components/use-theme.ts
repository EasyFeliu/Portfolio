"use client";

import { useCallback, useSyncExternalStore } from "react";

import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

/**
 * El tema vive en el DOM (clase `.dark` en <html>), aplicado por
 * `themeInitScript` antes del primer paint. Aquí solo lo leemos y lo
 * cambiamos, para que no haya dos fuentes de verdad ni parpadeos.
 */
const listeners = new Set<() => void>();

function notify(): void {
  for (const listener of listeners) {
    listener();
  }
}

function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
  notify();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);

  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystemChange = (event: MediaQueryListEvent) => {
    // Solo seguimos al sistema si el visitante no ha elegido tema.
    if (window.localStorage.getItem(THEME_STORAGE_KEY)) return;
    applyTheme(event.matches ? "dark" : "light");
  };

  media.addEventListener("change", onSystemChange);

  return () => {
    listeners.delete(listener);
    media.removeEventListener("change", onSystemChange);
  };
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot(): Theme {
  return "light";
}

export function useTheme(): { theme: Theme; toggleTheme: () => void } {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = useCallback(() => {
    const next: Theme = document.documentElement.classList.contains("dark") ? "light" : "dark";
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
    applyTheme(next);
  }, []);

  return { theme, toggleTheme };
}
