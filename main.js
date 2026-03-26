const getSystemTheme = () =>
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const setThemeButton = (effectiveTheme) => {
  const themeSwitcherBtn = document.getElementById("theme-switcher");
  if (!themeSwitcherBtn) return;
  themeSwitcherBtn.innerHTML = effectiveTheme === "dark" ? "☀️" : "🌙";
};

const setThemeVars = (theme) => {
  const root = document.documentElement;

  if (theme === "dark") {
    root.style.setProperty("--background", "var(--background-dark)");
    root.style.setProperty("--text", "var(--text-dark)");
    root.style.setProperty("--color", "var(--color-dark)");
    root.style.setProperty("--blockquote-color", "var(--blockquote-color-dark)");
    root.classList.add("theme-dark");
    root.classList.remove("theme-light");
    return;
  }

  if (theme === "light") {
    root.style.setProperty("--background", "var(--background-light)");
    root.style.setProperty("--text", "#000304");
    root.style.setProperty("--color", "76, 99, 119");
    root.style.setProperty("--blockquote-color", "76, 99, 119");
    root.classList.add("theme-light");
    root.classList.remove("theme-dark");
    return;
  }

  // System/unset: do not set inline CSS vars so `prefers-color-scheme` can apply.
  root.style.removeProperty("--background");
  root.style.removeProperty("--text");
  root.style.removeProperty("--color");
  root.style.removeProperty("--blockquote-color");
  root.classList.remove("theme-dark");
  root.classList.remove("theme-light");
};

const applyTheme = (theme) => {
  if (theme === "dark" || theme === "light") {
    document.documentElement.dataset.theme = theme;
    setThemeButton(theme);
    setThemeVars(theme);
    return;
  }

  // "system" (or unset): let CSS `prefers-color-scheme` decide
  delete document.documentElement.dataset.theme;
  setThemeVars(null);
  setThemeButton(getSystemTheme());
};

const switchTheme = () => {
  const stored = localStorage.getItem("theme"); // "light" | "dark" | null
  const effective = stored === "light" || stored === "dark" ? stored : getSystemTheme();
  const next = effective === "dark" ? "light" : "dark";
  localStorage.setItem("theme", next);
  applyTheme(next);
};

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const stored = localStorage.getItem("theme"); // "light" | "dark" | null
  applyTheme(stored);

  if (params.has("q") && params.get("q") === "1") {
    sessionStorage.setItem("hidden", "0");
  }

  if (sessionStorage.getItem("hidden") === "0") {
    document.querySelectorAll(".hidden").forEach((el) => {
      el.classList.remove("hidden");
      el.classList.add("show");
    });
  }
});
