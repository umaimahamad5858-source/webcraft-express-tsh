/* ==========================================================
   theme.js
   Dark/Light theme toggle. Preference is saved to
   LocalStorage and re-applied on every page load, so a
   refresh always preserves the user's chosen theme.
   Falls back to the OS-level color-scheme preference the
   very first time a visitor arrives with nothing saved yet.
   ========================================================== */

const THEME_KEY = "webcraft_theme";

function getSavedTheme() {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch (err) {
    // LocalStorage can throw in private-browsing edge cases —
    // fail gracefully rather than breaking the page.
    console.warn("Could not read theme from LocalStorage:", err);
    return null;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (err) {
    console.warn("Could not save theme to LocalStorage:", err);
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);

  const lightBtn = document.getElementById("theme-light-btn");
  const darkBtn = document.getElementById("theme-dark-btn");
  lightBtn.setAttribute("aria-pressed", String(theme === "light"));
  darkBtn.setAttribute("aria-pressed", String(theme === "dark"));
}

function initTheme() {
  const saved = getSavedTheme();
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = saved || (systemPrefersDark ? "dark" : "light");
  applyTheme(theme);

  document.getElementById("theme-light-btn").addEventListener("click", () => {
    applyTheme("light");
    saveTheme("light");
  });

  document.getElementById("theme-dark-btn").addEventListener("click", () => {
    applyTheme("dark");
    saveTheme("dark");
  });
}

document.addEventListener("DOMContentLoaded", initTheme);
