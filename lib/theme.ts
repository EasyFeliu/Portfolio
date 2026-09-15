export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "portfolio-theme";

/**
 * Script que se ejecuta antes del primer paint para aplicar el tema guardado
 * (o el del sistema) y evitar el destello de color al cargar la página.
 */
export const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('${THEME_STORAGE_KEY}');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var dark = stored === 'dark' || (stored !== 'light' && prefersDark);
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  } catch (error) {}
})();
`;
