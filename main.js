const getSystemTheme = () =>
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const setThemeButton = (effectiveTheme) => {
  const themeSwitcherBtn = document.getElementById("theme-switcher");
  if (!themeSwitcherBtn) return;
  themeSwitcherBtn.innerHTML = effectiveTheme === "dark" ? "☀️" : "🌙";
};

const applyTheme = (theme) => {
  if (theme === "dark" || theme === "light") {
    document.documentElement.dataset.theme = theme;
    setThemeButton(theme);
    return;
  }

  // "system" (or unset): let CSS `prefers-color-scheme` decide
  delete document.documentElement.dataset.theme;
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
