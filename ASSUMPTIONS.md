# Assumptions

This document lists every assumption made while building this test suite, why it was made, and what was verified versus inferred.

## 1. "Handla" step is not a separate click on the current live site

The original brief says: *navigate to telenor.se → click Handla → click Bredband*.

On inspecting the live site (English locale), the top navigation has no item literally labeled "Handla" — the equivalent entry is labeled **"Broadband"** (English) / **"Bredband"** (Swedish). Clicking it opens a dropdown whose first items are "Bredband" (a parent link) and a list of sub-items including **"Bredband via fiber"**, which links to `/handla/bredband/` — the exact address-search page described in the brief.

**Assumption:** the brief's "Handla" step describes an older or differently-localized version of the site's navigation. The current real equivalent is: click the **Broadband/Bredband** nav item (opens a dropdown) → click **"Bredband via fiber"** inside it. This is what the suite automates (`BreddbandPage.navigateToBredband()`), verified against the live DOM and accessibility tree, not guessed.

## 2. "featured-product-grid" is not the real selector

The brief says to verify `featured-product-grid` is not empty. No element with that literal class/id exists on the live page.

**Assumption:** this refers to the real result container, found via DOM inspection:
```
[data-test="featured-fixed-product-grid-item-container"]
```
This is used instead of guessing at the name in the brief, since `data-test` attributes are purpose-built for automation and are the most stable selector available on this page.

## 3. Selecting an address suggestion submits the search — no separate submit click needed

The address field has a circular arrow button (`aria-label="Sök adress"`) visible while the user is typing. It was assumed early on that this button always needed to be clicked after picking a suggestion.

**Verified by direct inspection:** once a suggestion is selected from the dropdown, the arrow button is replaced by a clear/reset (✕) button — there is nothing left to click. The arrow button only applies to the alternate path where the user types a full address that produces no matching suggestion, and must submit manually.

**Current behavior:**
- Suggestion matched and selected → nothing further triggered; selection itself submits the search.
- No suggestion matched → `Enter` is pressed to submit (this path has not been exercised against a real non-matching address in this suite, since the only address used is the one from the brief, which always resolves to a suggestion).

## 4. The OneTrust cookie consent dialog loads asynchronously

The cookie banner (`body.enable-one-trust-cookie-consent`) is a third-party script (OneTrust) that does not always render immediately after navigation. An early implementation used a single quick visibility check right after page load, which sometimes missed the dialog if it rendered a moment later — causing a click on an address suggestion to hang indefinitely because the dialog silently covered the page.

**Fix applied:** `dismissCookieBanner()` uses a real `waitFor({ state: 'visible' })` with a 6-second window instead of an instant check, and is called again after navigating to the Bredband page (not just once on the homepage), since the dialog can reappear per-navigation.

## 5. Typing the address via simulated keystrokes corrupts the input

Initial implementation used Playwright's `pressSequentially()` to simulate real per-character typing, intended to trigger the address-autocomplete widget's key listeners. Diagnostic testing showed this combobox resets its internal caret position to index 0 on each re-render, so characters typed after the third or fourth keystroke were inserted at the *start* of the string instead of the end (e.g. typing "Kungsgatan" produced `"gsgatanKun"`).

**Fix applied:** `fillAddress()` uses `.fill()` (atomic value set) instead, which was confirmed via a standalone diagnostic run to correctly populate the field and still trigger the suggestions dropdown.

## 6. Suggestion text is rendered uppercase

The dropdown renders suggestion text as `"KUNGSGATAN 103, UPPSALA"` regardless of the casing typed. Suggestion matching in `selectAddressSuggestion()` is case-insensitive to account for this.

## 7. English-language toggle was not pursued

The site's default locale when visited directly is Swedish. An earlier attempt included a `selectEnglish()` method to switch locale via a language toggle, but in every test run this toggle was never actually found/clickable — it was a no-op in practice across the whole suite. Since none of the required assertions in the brief depend on page language, this method was removed rather than kept as dead, misleading code. **The suite currently runs and asserts against the Swedish-default UI.**

## 8. Single browser (Chromium) only

The suite runs against Chromium only, configured in `playwright.config.ts`. Cross-browser coverage (Firefox/WebKit) was not added — this was a scope decision to keep the suite focused on the brief's core assertion rather than expanding coverage unasked.

## 9. Single worker / sequential execution

Tests run with `workers: 1` (sequential, not parallel) per explicit instruction during development, rather than Playwright's default parallel execution. This trades speed for simpler, more predictable log output when debugging against a live third-party site.

## 10. GitHub Pages deployment requires a one-time manual repository setting

The CI workflow deploys the Allure report to GitHub Pages via `actions/deploy-pages`, which requires the repository's **Settings → Pages → Source** to be set to **"GitHub Actions"** (not "Deploy from a branch"). This is a one-time manual step in the GitHub web UI that cannot be performed by the workflow itself and must be done once after the repository is created.
