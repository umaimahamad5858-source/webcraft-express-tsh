/* ==========================================================
   form.js
   Client-side validation only — per the assignment, no
   backend submission is required. Validates on submit,
   shows inline errors, and moves focus to the first
   invalid field for keyboard/screen-reader users.
   ========================================================== */

const URL_PATTERN = /^https?:\/\/[^\s]+\.[^\s]+$/i;

function setFieldValid(fieldId) {
  document.getElementById(fieldId).setAttribute("data-invalid", "false");
}

function setFieldInvalid(fieldId) {
  document.getElementById(fieldId).setAttribute("data-invalid", "true");
}

function showFormStatus(message, type) {
  const status = document.getElementById("form-status");
  status.textContent = message;
  status.className = `form-status form-status--${type}`;
  status.setAttribute("data-visible", "true");
}

function hideFormStatus() {
  const status = document.getElementById("form-status");
  status.setAttribute("data-visible", "false");
}

function initSuggestForm() {
  const form = document.getElementById("suggest-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    hideFormStatus();

    const name = document.getElementById("input-name").value.trim();
    const title = document.getElementById("input-title").value.trim();
    const url = document.getElementById("input-url").value.trim();

    let firstInvalidField = null;
    let isValid = true;

    if (name.length === 0) {
      setFieldInvalid("field-name");
      isValid = false;
      firstInvalidField = firstInvalidField || "input-name";
    } else {
      setFieldValid("field-name");
    }

    if (title.length === 0) {
      setFieldInvalid("field-title");
      isValid = false;
      firstInvalidField = firstInvalidField || "input-title";
    } else {
      setFieldValid("field-title");
    }

    if (url.length === 0 || !URL_PATTERN.test(url)) {
      setFieldInvalid("field-url");
      isValid = false;
      firstInvalidField = firstInvalidField || "input-url";
    } else {
      setFieldValid("field-url");
    }

    if (!isValid) {
      showFormStatus("Please fix the highlighted fields before submitting.", "error");
      document.getElementById(firstInvalidField).focus();
      return;
    }

    // No backend exists for this assignment — success is a confirmed,
    // client-side acknowledgment only.
    showFormStatus(`Thanks, ${name}! "${title}" has been noted.`, "success");
    form.reset();
    ["field-name", "field-title", "field-url"].forEach(setFieldValid);
  });
}

document.addEventListener("DOMContentLoaded", initSuggestForm);
