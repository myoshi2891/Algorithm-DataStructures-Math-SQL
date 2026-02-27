---
name: spec-driven-development
description: >
    Provides best practices, folder structures, and templates for AI Spec-Driven Development (SDD) Markdown files. Use this skill when creating, updating, or reviewing project spec documents (`spec.md`, `requirements.md`, `design.md`, `tasks.md`), agent configuration files (`CLAUDE.md`, `GEMINI.md`, `rules/`), or other Antigravity/Claude Code specific assets.
---

# AI Spec-Driven Development (SDD) Markdown Guide

## Goal

To maintain high-quality, standardized Markdown files that serve as the foundation for Agent-First IDEs (Google Antigravity and Claude Code). This ensures the agent perfectly aligns with human intent through a rigorous "Spec First, Code Second" approach.

## SDD Workflow (4 Phases)

1. **仕様策定 (Spec & Requirements)**: `docs/spec.md` → `docs/requirements.md`
2. **設計 (Design)**: `docs/design.md` & `.agent/rules/*.md`
3. **エージェント実行 (Execution)**: `docs/tasks.md` & `workflows/`
4. **検証 (Verification)**: Artifacts (Walkthrough, Screenshots, Recordings), Feedback Loop into Knowledge Base

## File Roles & Best Practices

### 1. Specification Documents (`docs/`)

- **`spec.md`**: The starting point. Defines the "What" and "Why" in 2-4 sentences, main features, non-functional constraints, and raw acceptance criteria. Must be treated as a living document.
- **`requirements.md`**: Decomposes `spec.md` into Functional Requirements (FR-001) and Non-Functional Requirements (NFR-001) with strict acceptance criteria and priorities (P0/P1). Acts as the "contract".
- **`design.md` / `architecture.md`**: Technical design including Mermaid sequence diagrams, DDLs, API endpoints, and system architecture.
- **`tasks.md`**: Granular, independently testable tasks. Use checkboxes `- [ ]`. For Antigravity, explicitly state multi-agent parallelization (e.g., "Agent A", "Agent B / Parallelizable"). Always mark completed tasks `[x]` and log generated artifacts.

### 2. General Agent Configurations

- **`CLAUDE.md` (Claude)**: Project persistent memory. Must be kept under 500 lines. Prioritize critical rules and use `@import` for long texts. Avoid excessive instructions that can be enforced by Hooks.
- **`GEMINI.md` (Antigravity)**: Global persistent memory (`~/.gemini/GEMINI.md`). Contains cross-project preferences and global tools. Avoid project-specific rules here!

### 3. Antigravity-Specific Advanced Features

- **Rules (`.agent/rules/*.md`)**: Passive constraints (System Prompts).
    - Use `always-on.md` for project core rules and SDD spec-loading enforcement (e.g., instructing the agent to always read `docs/spec.md` ~ `docs/tasks.md` before coding).
    - Use file-specific rules like `go-style.md` using `activation: fileMatch` and `pattern: "**/*.go"` to save context window.
- **Skills (`.agent/skills/`)**: Progressive disclosure knowledge.
    - The `description` field in `SKILL.md` is the "meaningful trigger". Make it highly specific ("what", "when", "why").
    - Do not mix up Rules (passive constraints) and Skills (procedural active knowledge).
- **Workflows (`.agent/workflows/`)**: Active automation scripts for repetitive tasks (e.g., `/deploy`, `/review`). They can be chained.
- **Knowledge Base (`.context/`)**: Auto-injected context where the agent records discovered "Gotchas", architectural decisions, and bug patterns (like `MEMORY.md` in Claude Code).
- **Artifacts**: Agents automatically generate _Task Lists_, _Implementation Plans_, _Walkthroughs_, _Screenshots_, and _Recordings_. **Crucial Rule**: Humans must always review Implementation Plans and Artifacts before allowing major code changes.

## Global SDD Rules

1. **Spec First, Code Second**: Write zero lines of code until `spec` → `requirements` → `design` → `tasks` are prepared.
2. **Keep Specs Alive**: If code changes, the design and specs must be updated immediately to prevent project rot.
3. **Independent Tasks**: Decompose tasks so they can be executed and tested independently without polluting overall context.
4. **Use Subagents/Parallel Agents**: Execute tasks via subagents (Claude) or parallel Agent Manager (Antigravity) to keep context pristine.
5. **Enforce Why, Not Just What**: When defining rules or architectural choices, explain the reasoning (e.g., "Ban ORMs because performance tests showed 20x latency").
