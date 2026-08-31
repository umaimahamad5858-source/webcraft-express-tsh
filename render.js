/* ==========================================================
   render.js
   Loads js/data.json, renders cards into the DOM using
   template literals, builds the category dropdown, and
   re-renders whenever the active filter changes.
   Shared app state lives on `window.APP` so bookmarks.js,
   modal.js, and theme.js can all read/update it.
   ========================================================== */

window.APP = {
  resources: [],
  filter: {
    category: "all",
    bookmarkedOnly: false
  }
};

const CATEGORY_LABELS = {
  "html-css": "HTML &amp; CSS",
  "javascript": "JavaScript",
  "frameworks": "Frameworks",
  "practice": "Practice",
  "tools": "Tools"
};

/**
 * Load the mock data file. Runs once on page load.
 */
async function loadResources() {
  const grid = document.getElementById("card-grid");
  try {
    const response = await fetch("js/data.json");
    if (!response.ok) throw new Error("Network response was not ok");
    window.APP.resources = await response.json();
    buildCategoryDropdown(window.APP.resources);
    renderCards();
    updateStats();
  } catch (err) {
    grid.innerHTML = `
      <div class="empty-state">
        <p>Couldn't load the resource list.</p>
        <span class="empty-state__code">${escapeHtml(String(err.message))} — if you opened this file directly, run it through a local server instead (see README).</span>
      </div>`;
  }
}

/**
 * Build a single resource card as an HTML string (template literal).
 */
function cardTemplate(resource) {
  const bookmarked = isBookmarked(resource.id);
  return `
    <article class="card" data-id="${resource.id}" data-category="${resource.category}">
      <div class="card__tab">
        <span class="card__filename"><b>${escapeHtml(resource.file)}</b>${escapeHtml(resource.tag)}</span>
        <button
          type="button"
          class="card__bookmark"
          data-bookmark-id="${resource.id}"
          aria-pressed="${bookmarked}"
          aria-label="${bookmarked ? "Remove bookmark for " : "Bookmark "}${escapeHtml(resource.title)}"
        >
          <svg viewBox="0 0 24 24" fill="${bookmarked ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 3h12a1 1 0 0 1 1 1v16l-7-4-7 4V4a1 1 0 0 1 1-1z"/>
          </svg>
        </button>
      </div>
      <div class="card__body">
        <h3 class="card__title">${escapeHtml(resource.title)}</h3>
        <p class="card__desc">${escapeHtml(resource.description)}</p>
        <div class="card__meta">
          <span class="badge">${escapeHtml(resource.level)}</span>
          <span class="card__provider">${escapeHtml(resource.provider)}</span>
        </div>
      </div>
      <button type="button" class="card__open-btn" data-open-modal="${resource.id}">View details</button>
    </article>
  `;
}

/**
 * Apply the current filter (category + bookmarked-only) and
 * re-render the grid. Called on load and whenever a filter changes.
 */
function renderCards() {
  const grid = document.getElementById("card-grid");
  const { category, bookmarkedOnly } = window.APP.filter;

  let list = window.APP.resources.filter((r) => {
    const categoryMatch = category === "all" || r.category === category;
    const bookmarkMatch = !bookmarkedOnly || isBookmarked(r.id);
    return categoryMatch && bookmarkMatch;
  });

  if (list.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <p>No resources match this filter.</p>
        <span class="empty-state__code">try: filter.category = "all"</span>
      </div>`;
  } else {
    grid.innerHTML = list.map(cardTemplate).join("");
  }

  const countEl = document.getElementById("results-count");
  countEl.textContent =
    category === "all" && !bookmarkedOnly
      ? `Showing all ${window.APP.resources.length} resources`
      : `Showing ${list.length} of ${window.APP.resources.length} resources`;
}

/**
 * Populate the dropdown menu options from the unique categories
 * present in the data (never hard-coded).
 */
function buildCategoryDropdown(resources) {
  const menu = document.getElementById("dropdown-menu");
  const categories = [...new Set(resources.map((r) => r.category))];

  const allOption = `
    <li>
      <button type="button" class="dropdown__option" data-category="all" aria-current="true">
        <span>All categories</span>
        <span class="dropdown__option-tag">${resources.length}</span>
      </button>
    </li>`;

  const options = categories
    .map((cat) => {
      const count = resources.filter((r) => r.category === cat).length;
      const label = CATEGORY_LABELS[cat] || cat;
      return `
        <li>
          <button type="button" class="dropdown__option" data-category="${cat}" aria-current="false">
            <span>${label}</span>
            <span class="dropdown__option-tag">${count}</span>
          </button>
        </li>`;
    })
    .join("");

  menu.innerHTML = allOption + options;
}

function updateStats() {
  const resources = window.APP.resources;
  const categories = new Set(resources.map((r) => r.category));
  document.getElementById("stat-total").textContent = resources.length;
  document.getElementById("stat-categories").textContent = categories.size;
  document.getElementById("stat-bookmarks").textContent = getBookmarks().length;
}

/** Basic HTML-escaping so resource data can never break markup. */
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Dropdown filter: open/close on trigger click, close on outside
 * click or Escape, and apply the chosen category on selection.
 */
function initDropdown() {
  const dropdown = document.getElementById("category-dropdown");
  const trigger = document.getElementById("dropdown-trigger");
  const menu = document.getElementById("dropdown-menu");
  const currentLabel = document.getElementById("dropdown-current-label");

  function openMenu() {
    dropdown.setAttribute("data-open", "true");
    trigger.setAttribute("aria-expanded", "true");
  }
  function closeMenu() {
    dropdown.setAttribute("data-open", "false");
    trigger.setAttribute("aria-expanded", "false");
  }

  trigger.addEventListener("click", () => {
    const isOpen = dropdown.getAttribute("data-open") === "true";
    isOpen ? closeMenu() : openMenu();
  });

  // Event delegation: menu options are rebuilt whenever data loads,
  // so listen on the stable parent rather than each button.
  menu.addEventListener("click", (e) => {
    const option = e.target.closest(".dropdown__option");
    if (!option) return;

    menu.querySelectorAll(".dropdown__option").forEach((opt) => {
      opt.setAttribute("aria-current", "false");
    });
    option.setAttribute("aria-current", "true");

    const category = option.dataset.category;
    currentLabel.textContent = option.querySelector("span").textContent.toLowerCase();
    window.APP.filter.category = category;
    renderCards();
    closeMenu();
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) closeMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadResources();
  initDropdown();
});
