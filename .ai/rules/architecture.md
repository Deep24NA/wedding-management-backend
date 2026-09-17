# ARCHITECTURE & DESIGN PRESERVATION RULES

This document defines architectural guidelines, module boundaries, code structure preservation, UI/UX interaction flow protection, and API contract stability rules for the **Wedding Management Backend** repository.

---

## 1. Architectural Inspection & Pattern Adherence

Before modifying or creating any code, AI agents MUST inspect and understand the existing repository architecture and strictly follow established patterns:

1. **Layered Modular Architecture**:
   * `src/app.ts`: Express application setup and global middleware registration.
   * `src/server.ts`: HTTP server initialization and port binding.
   * `src/routes/`: Top-level route aggregation mapping HTTP paths to controllers and feature routers.
   * `src/modules/`: Domain feature modules (containing module-specific controllers, services, routes, schemas, and types).
   * `src/services/`: Core business logic services.
   * `src/middlewares/`: Express middlewares (Auth, Error handling, Rate limiting, Validation).
   * `src/libs/`: Wrappers and shared client instances (`prisma`, `logger`, `jwt`, `swagger`).
   * `src/utils/`: Helpers (`asyncHandler`, API response formatters).
   * `src/config/`: Validated environment and runtime configurations.
2. **Precedence of Existing Architecture**:
   * Existing architecture ALWAYS takes precedence over an agent's personal design preferences.
   * Agents must identify and follow existing codebase patterns rather than introducing alternative patterns, frameworks, or utility paradigms.

---

## 2. Code Structure Protection & Smallest Safe Change

1. **No Unnecessary Restructuring**:
   * Do NOT introduce new architectural paradigms without explicit developer justification and approval.
   * Do NOT reorganize directory structures, relocate working files, or rename modules unnecessarily.
   * Do NOT rewrite existing working modules simply because an alternative approach appears cleaner.
2. **Smallest Safe Change**:
   * Always choose the smallest, least invasive modification that fulfills the task requirements safely.
   * Do NOT refactor unrelated code or perform opportunistic cleanup while implementing a feature or bug fix.
3. **Strict Dependency Direction**:
   * Routes / Controllers depend on Services.
   * Services depend on Prisma database client (`src/libs/prisma/`).
   * Controllers / Routes depend on Validation schemas (Zod).
   * Layered hierarchy must be strictly maintained. Circular dependencies across modules or layers are strictly forbidden.

---

## 3. Preservation of System Interaction & UI/UX Flows

1. **UI/UX & Interaction Flow Preservation**:
   * Existing user interaction flows, page navigation patterns, user journey flows, and frontend/backend interaction contracts MUST be preserved.
   * Do NOT introduce unrequested "UX improvements" or alter existing backend endpoint behaviors that impact frontend interaction flows.
2. **Mandatory STOP on Flow Impact**:
   * If a backend feature, bug fix, or data model change appears to require changing an established user interaction flow, page navigation sequence, or API interaction behavior:
     * **STOP execution immediately**.
     * Explain why the flow modification is necessary.
     * Detail what exact interaction flow or API contract would change.
     * Present alternative technical approaches that preserve the existing flow.
     * Request explicit developer authorization before proceeding.

---

## 4. API Contract Preservation

1. **Contract Stability**: Existing API request formats, query parameters, URL path structures, HTTP status codes, and JSON response payload schemas MUST remain stable and backward-compatible.
2. **Side-Effect Prevention**: Adding a new endpoint or feature module must NEVER alter or disrupt existing route handlers, middleware chains, or error response structures.

---

## 5. Architecture Decision Records (ADRs) Directory

* **Decision Documentation Path**: [`docs/decisions/`](file:///d:/coding/projects/wedding_management_backend/docs/decisions)
* **ADR Format**: When a major technical or architectural decision is approved by the developer, it MUST be documented as a Markdown file in `docs/decisions/` (e.g. `docs/decisions/0001-database-provider.md`) and referenced in `AI_CONTEXT.md`.

---

## 6. Separation of Application and AI Governance

* **Strict Isolation**: Application source code under `src/` must remain completely decoupled from AI governance rules in `.ai/` and `AI_CONTEXT.md`.
* **Zero Runtime Dependency**: Runtime application code must NEVER import, reference, or depend upon `.ai/` rule files or AI documentation.
