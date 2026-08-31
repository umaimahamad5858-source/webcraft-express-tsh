# WebCraft Express — Web Development Learning Resources

A bookmarkable directory of free web development learning resources, built for the **TechSkillHub Web Development Internship** (Intern: Umaima Hamad, ID: TSH/529EC6F5).

## What it does

- Browse a curated list of HTML/CSS, JavaScript, framework, tools, and practice resources
- Filter by category using a dropdown
- Bookmark resources you want to revisit — saved in your browser (LocalStorage), survives refresh
- Toggle between light and dark themes — also saved and restored on refresh
- View full details of a resource in a modal dialog
- Suggest a new resource via a validated form (client-side only, no backend)

## Tech stack

Vanilla HTML5, CSS3 (Grid + Flexbox + custom properties), and JavaScript ES6+. No frameworks, no build step, no dependencies.

## Project structure

```
webcraft-express/
├── index.html
├── css/
│   ├── variables.css     — design tokens (colors, spacing, type), light/dark theme values
│   ├── layout.css        — reset, page structure, responsive grid/flex layout
│   └── components.css    — buttons, cards, dropdown, modal, form styles
├── js/
│   ├── data.json         — mock resource data (fetched, never hard-coded into HTML)
│   ├── render.js          — fetches data, renders cards dynamically, builds/handles the dropdown filter
│   ├── theme.js           — dark/light theme toggle + LocalStorage persistence
│   ├── bookmarks.js       — bookmark toggle + LocalStorage persistence
│   ├── modal.js            — resource detail modal
│   └── form.js             — client-side form validation
└── README.md
```

## Running it locally

This project fetches `js/data.json` with the Fetch API, which browsers block on the `file://` protocol. You need to serve it over `http://` — pick one:

**Option A — Python (already on most machines):**
```bash
cd webcraft-express
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

**Option B — VS Code Live Server extension:** right-click `index.html` → "Open with Live Server".

## Manual test checklist

- [ ] Page loads, cards appear (not blank, not "couldn't load")
- [ ] Refresh the page — cards still appear
- [ ] Click the dark theme button — page goes dark
- [ ] Refresh — still dark
- [ ] Click the light theme button — back to light — refresh — still light
- [ ] Click a bookmark star on a card — it fills in
- [ ] Refresh — bookmark still shows filled
- [ ] Click "★ Bookmarked only" — only bookmarked cards show
- [ ] Un-bookmark the last visible one while filter is active — it disappears from the list immediately
- [ ] Open the category dropdown, pick a category — grid filters, count updates
- [ ] Click "View details" on a card — modal opens with correct info
- [ ] Click the × , click outside the modal, and press Escape — all three close it
- [ ] Submit the suggestion form empty — see validation errors, nothing submits
- [ ] Enter an invalid URL (e.g. `not-a-url`) — see the URL error specifically
- [ ] Fill in valid values — see a success message, form resets
- [ ] Resize the browser (or open dev tools device toolbar) at ~360px, ~390px, ~768px, and desktop width — no horizontal scrollbar at any width
- [ ] Open browser dev tools console — no red errors on load or during any of the above

## Known limitations

- The category dropdown is a custom disclosure widget operable by mouse and Tab/Enter/Space, but does not implement full arrow-key roving-tabindex listbox navigation.
- The "suggest a resource" form is intentionally client-side only per the assignment scope — submissions are not persisted or sent anywhere.

## Deploying (GitHub Pages)

1. Create a new **public** repo on GitHub (e.g. `webcraft-express`).
2. From this folder:
   ```bash
   git init
   git add .
   git commit -m "WebCraft Express - initial submission"
   git branch -M main
   git remote add origin https://github.com/<your-username>/webcraft-express.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Source → Deploy from branch → main → / (root)** → Save.
4. Your live URL will be `https://<your-username>.github.io/webcraft-express/` (takes ~1 minute to go live).
5. Visit the live URL yourself and re-run the manual test checklist above — LocalStorage and fetch behave slightly differently on a real host than locally, so this step matters.

## Running a real Lighthouse audit

1. Open the **live deployed URL** (not localhost — scores differ) in Chrome.
2. Open DevTools (F12) → **Lighthouse** tab.
3. Check "Performance" and "Accessibility" categories, device = Mobile, click **Analyze page load**.
4. Save the report (top-right ⋮ menu → "Save as HTML" or "Export JSON") — this file is your Lighthouse deliverable.
5. If either score comes in under 90, common fixes for this project: confirm Google Fonts aren't blocking render (the `preconnect` tag already helps), check for any large unused CSS, and confirm no console errors are firing.
