/* ==========================================================
   modal.js
   Opens a detail dialog for a resource card. Closes via the
   × button, an overlay click, or Escape. Keeps its own
   bookmark button in sync with the card grid.
   ========================================================== */

let lastFocusedBeforeModal = null;

function openModal(resourceId) {
  const resource = window.APP.resources.find((r) => r.id === resourceId);
  if (!resource) return;

  lastFocusedBeforeModal = document.activeElement;

  document.getElementById("modal-title").textContent = resource.title;
  document.getElementById("modal-description").textContent = resource.description;
  document.getElementById("modal-provider").textContent = resource.provider;
  document.getElementById("modal-level").textContent = resource.level;

  const visitLink = document.getElementById("modal-visit-link");
  visitLink.href = resource.url;

  const bookmarkBtn = document.getElementById("modal-bookmark-btn");
  bookmarkBtn.dataset.currentId = resource.id;
  const bookmarked = isBookmarked(resource.id);
  bookmarkBtn.setAttribute("aria-pressed", String(bookmarked));
  bookmarkBtn.textContent = bookmarked ? "★ Bookmarked" : "★ Bookmark";

  const overlay = document.getElementById("modal-overlay");
  overlay.setAttribute("data-open", "true");
  document.body.style.overflow = "hidden";
  document.getElementById("modal-close-btn").focus();
}

function closeModal() {
  const overlay = document.getElementById("modal-overlay");
  overlay.setAttribute("data-open", "false");
  document.body.style.overflow = "";
  if (lastFocusedBeforeModal && typeof lastFocusedBeforeModal.focus === "function") {
    lastFocusedBeforeModal.focus();
  }
}

function initModal() {
  // Delegated: "View details" buttons are re-rendered on every filter change.
  document.getElementById("card-grid").addEventListener("click", (e) => {
    const openBtn = e.target.closest("[data-open-modal]");
    if (!openBtn) return;
    openModal(openBtn.dataset.openModal);
  });

  document.getElementById("modal-close-btn").addEventListener("click", closeModal);

  document.getElementById("modal-overlay").addEventListener("click", (e) => {
    if (e.target.id === "modal-overlay") closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const overlay = document.getElementById("modal-overlay");
      if (overlay.getAttribute("data-open") === "true") closeModal();
    }
  });

  document.getElementById("modal-bookmark-btn").addEventListener("click", (e) => {
    const id = e.currentTarget.dataset.currentId;
    const nowBookmarked = toggleBookmark(id);
    syncBookmarkUI(id, nowBookmarked);
    // Keep the "bookmarked only" grid filter in sync even when the
    // bookmark is toggled from inside the modal rather than the card.
    if (window.APP.filter.bookmarkedOnly) renderCards();
  });
}

document.addEventListener("DOMContentLoaded", initModal);
