const getSystemTheme = () =>
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const setThemeButton = (effectiveTheme) => {
  const themeSwitcherBtn = document.getElementById("theme-switcher");
  if (!themeSwitcherBtn) return;
  themeSwitcherBtn.textContent = effectiveTheme === "dark" ? "[*]" : "[o]";
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
    root.style.setProperty("--text", "#111111");
    root.style.setProperty("--color", "10, 70, 120");
    root.style.setProperty("--blockquote-color", "10, 70, 120");
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

const initCodeBlocks = () => {
  document.querySelectorAll("pre").forEach((pre) => {
    if (pre.parentElement && pre.parentElement.classList.contains("code-block")) {
      return;
    }

    const code = pre.querySelector("code");
    let lang = "";
    if (code && code.className) {
      const match = code.className.match(/language-([^\s]+)/);
      if (match) {
        lang = match[1];
      }
    }

    const wrapper = document.createElement("div");
    wrapper.className = "code-block";

    const header = document.createElement("div");
    header.className = "code-header";

    const langSpan = document.createElement("span");
    langSpan.className = "code-lang";
    langSpan.textContent = lang || "code";

    const copyBtn = document.createElement("button");
    copyBtn.className = "code-copy-btn";
    copyBtn.type = "button";
    copyBtn.setAttribute("aria-label", "Copy code");
    copyBtn.textContent = "copy";

    copyBtn.addEventListener("click", async () => {
      const textToCopy = (code ? code.innerText : pre.innerText).replace(/\n$/, "");
      try {
        await navigator.clipboard.writeText(textToCopy);
        copyBtn.textContent = "copied!";
        copyBtn.classList.add("copied");
        setTimeout(() => {
          copyBtn.textContent = "copy";
          copyBtn.classList.remove("copied");
        }, 2000);
      } catch {
        const textarea = document.createElement("textarea");
        textarea.value = textToCopy;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        copyBtn.textContent = "copied!";
        copyBtn.classList.add("copied");
        setTimeout(() => {
          copyBtn.textContent = "copy";
          copyBtn.classList.remove("copied");
        }, 2000);
      }
    });

    header.appendChild(langSpan);
    header.appendChild(copyBtn);

    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(header);
    wrapper.appendChild(pre);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const stored = localStorage.getItem("theme"); // "light" | "dark" | null
  applyTheme(stored);
  initCodeBlocks();

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
