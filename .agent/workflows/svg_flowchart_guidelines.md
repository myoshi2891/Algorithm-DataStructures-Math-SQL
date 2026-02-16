---
description: SVG flowchart and data visualization best practices to avoid common rendering issues
---

# SVG Flowchart & Data Visualization Guidelines

## Arrow Marker Best Practices

1. **`refX` should be less than the arrowhead length.** If your arrowhead path is `M0,0 L0,6 L9,3 z` (length=9), set `refX` to `5` (not `9`). A `refX` equal to the arrowhead length causes the tip to land exactly at the path endpoint, which gets hidden behind destination nodes.

2. **End arrow paths 5-10px before the target node boundary.** This leaves room for the arrowhead to be visible and not obscured by the node's fill.

3. **Use `markerUnits="strokeWidth"`** for consistent arrowhead sizing regardless of stroke width changes.

## SVG viewBox Sizing

1. **Always add 30-50px padding** below the last element in your viewBox height. If the last element ends at y=940 with ry=35, set viewBox height to at least `1000`.

2. **For dynamic data tables**, calculate viewBox height based on number of rows:
    ```
    viewBox height = header_height + (row_count × row_height) + summary_text_spacing + padding
    ```

## Text Overlap Prevention

1. **Summary text below data tables**: Position summary text at least `30px` below the last row's bottom edge (y + height), not at a fixed y coordinate.

2. **For N data rows at spacing S starting at Y0**: Last row bottom = `Y0 + (N-1) × S + row_height`. Summary text y should be `last_row_bottom + 30`.

## Prism.js Copy Button with Tailwind CSS

Tailwind's preflight CSS resets button styles. Override with `!important`:

```css
.code-toolbar > .toolbar {
    opacity: 1 !important;
}
.code-toolbar > .toolbar .toolbar-item {
    display: inline-block !important;
}
.code-toolbar > .toolbar button,
.code-toolbar > .toolbar a,
.code-toolbar > .toolbar span {
    background: #10b981 !important;
    color: white !important;
    border: none !important;
    display: inline-block !important;
    opacity: 1 !important;
    visibility: visible !important;
}
```
