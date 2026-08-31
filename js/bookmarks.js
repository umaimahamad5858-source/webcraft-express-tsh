/* ==========================================================
   bookmarks.js
   Bookmark state, fully persisted in LocalStorage as an
   array of resource IDs. Uses event delegation on the grid
   so newly-rendered cards are always wired up automatically.
   ========================================================== */

const BOOKMARKS_KEY = "webcraft_bookmarks";

function getBookmarks() {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn("Could not read bookmarks from LocalStorage:", err);
    return [];
  }
}

function saveBookmarks(ids) {
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(ids));
  } catch (err) {
    console.warn("Could not save bookmarks to LocalStorage:", err);
  }
}

function isBookmarked(id) {
  return getBookmarks().includes(id);
}

/**
 * Add or remove a resource ID from the saved bookmarks list.
 * Returns the new bookmarked state (true/false) for that ID.
 */
function toggleBookmark(id) {
  const current = getBookmarks();
  const index = current.indexOf(id);
  let nowBookmarked;

  if (index === -1) {
    current.push(id);
    nowBookmarked = true;
  } else {
    current.splice(index, 1);
    nowBookmarked = false;
  }

  saveBookmarks(current);
  document.getElementById("stat-bookmarks").textContent = current.length;
  return nowBookmarked;
}

/**
 * Sync every bookmark button/icon currently in the DOM (cards + modal)
 * for a given resource ID, so state never gets out of sync between them.
 */
function syncBookmarkUI(id, bookmarked) {
  document.querySelectorAll(`[data-bookmark-id="${id}"]`).forEach((btn) => {
    btn.setAttribute("aria-pressed", String(bookmarked));
    const path = btn.querySelector("path");
    if (path) path.closest("svg").setAttribute("fill", bookmarked ? "currentColor" : "none");
  });

  const modalBtn = document.getElementById("modal-bookmark-btn");
  if (modalBtn && modalBtn.dataset.currentId === id) {
    modalBtn.setAttribute("aria-pressed", String(bookmarked));
    modalBtn.textContent = bookmarked ? "★ Bookmarked" : "★ Bookmark";
  }
}

function initBookmarkDelegation() {
  // Card grid: delegated click listener catches bookmark-star clicks
  // on any card, including ones re-rendered after a filter change.
  document.getElementById("card-grid").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-bookmark-id]");
    if (!btn) return;
    const id = btn.dataset.bookmarkId;
    const nowBookmarked = toggleBookmark(id);
    syncBookmarkUI(id, nowBookmarked);

    // If the "bookmarked only" filter is active, un-bookmarking
    // an item should immediately remove it from view.
    if (window.APP.filter.bookmarkedOnly) renderCards();
  });

  // "★ Bookmarked only" toggle button
  const filterBtn = document.getElementById("bookmarks-filter-btn");
  filterBtn.addEventListener("click", () => {
    const active = filterBtn.getAttribute("aria-pressed") === "true";
    filterBtn.setAttribute("aria-pressed", String(!active));
    window.APP.filter.bookmarkedOnly = !active;
    renderCards();
  });
}

document.addEventListener("DOMContentLoaded", initBookmarkDelegation);
