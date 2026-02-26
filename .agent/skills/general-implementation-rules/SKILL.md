---
name: general-implementation-rules
description: >
    Applies general implementation best practices, coding conventions, and architectural constraints.
    Use when writing new code, implementing algorithms, scaffolding new features, or deciding on technical approaches.
---

# General Implementation Rules Skill

## Goal

To ensure high-quality, secure, maintainable, and predictable code implementation across all languages and scripts within the project.

## Instructions

Whenever you are writing new implementation code, scripts, or frontend UI, you **MUST** adhere to the following rules:

### 1. Language & Library Constraints

- **Algorithmic Code (Python/DataStructures/Math)**: You MUST only use standard built-in libraries (e.g., `typing`, `collections`, `itertools`, `math`, `heapq` in Python). Third-party packages are strictly forbidden.
- **JavaScript/TypeScript**: Stick to Node.js/Deno/Browser built-ins. Do not use external utility libraries like `lodash`.
- **SQL Domain Exception**: For SQL domain `.ipynb` files only, data science libraries like `Pandas` or `NumPy` are permitted.
- **Package Manager**: Exclusively use `bun` (e.g., `bun install`, `bunx`) instead of `npm`.

### 2. Implementation Style & Types

- **TypeScript**: Enforce `strict: true` and `noImplicitAny: true`. Target ES2022. Write functions as: `function functionName(...): ReturnType { ... }`.
- **Python**: Always use type hints. Class methods must be strictly typed: `class Solution:\n    def methodName(self, ...) -> ReturnType:`.
- **JavaScript**: Use module exports standard for the repo: `var functionName = function(...) { ... }; module.exports = { functionName };`.

### 3. Security & DOM Manipulation

- **Strict No `innerHTML`**: Never write to `innerHTML` directly. Use `document.createElement`, `textContent`, `replaceChildren`, and other standard DOM APIs to prevent XSS.
- **Variable Escaping**: Any dynamic strings interpolated into HTML output (including attributes like `href` in Python generation scripts) MUST be escaped using native libraries (e.g., `html.escape(str, quote=True)`).

### 4. Code Generation Rule

- **Do NOT manually edit output files**: Files under the `public/` directory (like `public/index.html`) are auto-generated. Do never edit them directly. Always edit the generator scripts (e.g., `generate_index.py`).

### 5. Robustness & Best Practices

- **Idempotency**: Write scripts and functions idempotently. E.g., before appending a specific suffix to a title or writing a log, verify it doesn't already exist.
- **Native Data Types**: When holding data state in memory (like JSON UI models), use native primitive types (e.g., `null`). Only convert them to string representations (like `"NULL"`) at the exact point of UI rendering.

## Examples

### Strict DOM Manipulation

**Input**: "Update the UI with the user's input"
**Output**:

```javascript
// GOOD
const div = document.getElementById('output');
div.textContent = userInput;

// BAD - XSS vulnerability
const div = document.getElementById('output');
div.innerHTML = `<span>${userInput}</span>`;
```

### Idempotency Example

**Input**: "Append ' (detailed)' to the title"
**Output**:

```python
# GOOD
if " (detailed)" not in title:
    title += " (detailed)"

# BAD - Can duplicate
title += " (detailed)"
```

## Constraints

- Never bypass the standard library limitations (no `pip install <lib>` or `bun add <lib>` for algorithmic solutions).
- Do not write code that assumes synchronous execution for heavy DOM updates; prefer async scheduling like `requestIdleCallback`.
