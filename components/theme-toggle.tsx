"use client";

import { MoonIcon, SunIcon } from "@/components/icons";
import { useTheme } from "@/components/use-theme";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const label = isDark ? "Activar modo claro" : "Activar modo oscuro";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      aria-pressed={isDark}
      className={[
        "inline-flex size-10 items-center justify-center rounded-full border border-hairline text-ink",
        "transition-colors duration-200 hover:bg-subtle active:scale-95",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {isDark ? <MoonIcon className="size-[1.15rem]" /> : <SunIcon className="size-[1.15rem]" />}
    </button>
  );
}
