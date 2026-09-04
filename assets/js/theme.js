(() => {
  "use strict";

  const root = document.documentElement;
  const storageKey = "visualise-info-theme";

  function getStoredTheme() {
    try {
      return window.localStorage.getItem(storageKey);
    } catch {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      window.localStorage.setItem(storageKey, theme);
    } catch {
      // The selected mode still applies for this page when storage is unavailable.
    }
  }

  function updateToggle(toggle, theme) {
    const isDark = theme === "dark";
    const nextTheme = isDark ? "light" : "dark";
    const label = `Switch to ${nextTheme} mode`;
    const icon = toggle.querySelector("i");
    const visibleLabel = toggle.querySelector("[data-theme-toggle-label]");

    toggle.setAttribute("aria-label", label);
    toggle.setAttribute("title", label);
    if (visibleLabel) {
      visibleLabel.textContent = `${nextTheme[0].toUpperCase()}${nextTheme.slice(1)} mode`;
    }
    icon?.classList.toggle("bi-sun-fill", isDark);
    icon?.classList.toggle("bi-moon-stars-fill", !isDark);
  }

  function setTheme(theme, persist = false) {
    const nextTheme = theme === "dark" ? "dark" : "light";
    root.setAttribute("data-bs-theme", nextTheme);
    document.querySelectorAll("[data-theme-toggle]").forEach((toggle) => {
      updateToggle(toggle, nextTheme);
    });

    if (persist) storeTheme(nextTheme);
  }

  setTheme(getStoredTheme());

  window.addEventListener("DOMContentLoaded", () => {
    setTheme(root.getAttribute("data-bs-theme"));

    document.querySelectorAll("[data-theme-toggle]").forEach((toggle) => {
      toggle.addEventListener("click", () => {
        const nextTheme =
          root.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
        setTheme(nextTheme, true);
      });
    });
  });

  window.addEventListener("storage", (event) => {
    if (event.key !== storageKey) return;
    setTheme(event.newValue);
  });
})();
