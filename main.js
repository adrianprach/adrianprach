const loadDarkMode = () => {
  const themeSwitcherBtn = document.getElementById("theme-switcher");
  themeSwitcherBtn.innerHTML = "☀️";
  document.documentElement.style.setProperty("--background", "var(--background-dark)");
  document.documentElement.style.setProperty("--text", "var(--text-dark)");
  document.documentElement.style.setProperty("--color", "var(--color-dark)");
  document.documentElement.style.setProperty("--blockquote-color", "var(--blockquote-color-dark)");
};

const loadLightMode = () => {
  const themeSwitcherBtn = document.getElementById("theme-switcher");
  themeSwitcherBtn.innerHTML = "🌙";
  document.documentElement.style.removeProperty("--background");
  document.documentElement.style.removeProperty("--text");
  document.documentElement.style.removeProperty("--color");
  document.documentElement.style.removeProperty("--blockquote-color");
};

const switchTheme = () => {
  const theme = localStorage.getItem("theme");
  if (theme === "light") {
    loadDarkMode();
    localStorage.setItem("theme", "dark");
  } else {
    loadLightMode();
    localStorage.setItem("theme", "light");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const isLightMode = localStorage.getItem("theme") === "light";

  if (isLightMode) {
    loadLightMode();
  } else {
    loadDarkMode();
  }

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
