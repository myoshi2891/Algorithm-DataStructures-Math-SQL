---
name: code-review-guidelines
description: >
    Applies accumulated project-specific codebase review rules and best practices.
    Use when generating, refactoring, or reviewing frontend HTML, rendering logic, or Python generation scripts (like generate_index.py).
---

# Code Review Guidelines Skill

## Goal

To maintain security, robustness, idempotency, and technical accuracy across the project's frontend and generator code, based on accumulated review feedback.

## Instructions

Whenever you write, refactor, or review code for this project, you **MUST** ensure the following rules are met:

### 1. Security & XSS Prevention

- Never use `innerHTML` in templates or frontend JavaScript. Always use `textContent` and DOM APIs.
- When embedding variables into HTML attributes (e.g., `href`, `class`) or text from backend/generator scripts (like `generate_index.py`), you **MUST** escape them using native escaping functions (e.g., `html.escape(..., quote=True)` in Python).

### 2. Asset Management & CDN Links

- **Regex Replacing:** When rewriting CDN URLs to local `/vendor/...` paths, use robust regex patterns (e.g., matching `@<version>` segments) rather than literal string replacements.
- **SRI Stripping:** If an asset link is changed from an external CDN to a local `/vendor/` path, you **MUST** strip any `integrity="..."` and `crossorigin="..."` attributes from the corresponding `<script>` or `<link>` tags to prevent the browser from blocking the local file due to hash mismatch.

### 3. Rendering Robustness (PrismJS & UI)

- Do not rely on brittle `setTimeout` delays to wait for the DOM or dynamic content to render.
- **High-Performance Scheduling:** Use `requestIdleCallback` (with a `requestAnimationFrame` and `setTimeout` fallback for Safari/older browsers) to trigger UI updates like `Prism.highlightAll()`.
- **Dynamic Content Observation:** Attach a `MutationObserver` to re-trigger highlighting or UI updates automatically when new elements are injected into the DOM.

### 4. Data Handling & Idempotency

- **UI Data Types:** Use the correct native data types in source data (e.g., use the primitive `null` instead of the string `"NULL"` in JSON/JS objects). Convert them to display strings (like `"NULL"`) _only_ at the rendering/display layer.
- **Idempotency:** When appending labels, suffixes, or classes (e.g., appending " (detailed)" to a title), check if the string is already present before appending it to avoid duplicates.

### 5. Technical Accuracy

- Ensure that technical explanations in learning materials (e.g., `README.html`) are precise and accurately reflect the differences between tools.
- _Example:_ SQL `GROUP BY` treats `NULL` values as a single group, whereas `pandas.groupby` explicitly drops `NA` keys by default (`dropna=True`).

## Examples

### XSS Prevention in Python

**Input:** Outputting an encoded path to an href attribute.
**Output:**

```python
# GOOD
safe_encoded_path = html.escape(urllib.parse.quote(path), quote=True)
html_str = f'<a href="{safe_encoded_path}">'

# BAD
html_str = f'<a href="{urllib.parse.quote(path)}">'
```

### Robust Rendering in JavaScript

**Input:** Triggering Prism highlighting after React renders.
**Output:**

```javascript
// GOOD
const scheduleHighlight = () => {
    const highlight = () => {
        if (window.Prism) {
            Prism.highlightAll();
        }
    };
    if (window.requestIdleCallback) {
        requestIdleCallback(highlight, { timeout: 1000 });
    } else {
        requestAnimationFrame(() => setTimeout(highlight, 0));
    }
};

const observer = new MutationObserver((mutations) => {
    if (mutations.some((m) => m.addedNodes.length > 0)) {
        scheduleHighlight();
    }
});
observer.observe(document.getElementById('root'), { childList: true, subtree: true });
scheduleHighlight();
```

## Constraints

- Do not bypass security validations for the sake of brevity.
- Do not add external library dependencies to solve these issues; use native browser/language features (e.g., vanilla JS `MutationObserver`, standard lib `html`).
