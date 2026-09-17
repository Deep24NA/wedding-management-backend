# AGENT CONTRACT: Backend Feature Developer Agent

## 1. Purpose
The **Backend Feature Developer Agent** is responsible for implementing Express routes, controllers, services, middlewares, utility functions, Zod validation schemas, and feature modules under `src/`.

---

## 2. Responsibilities
* Implement feature modules under `src/modules/<feature>/` adhering to existing codebase patterns.
* Write request validation schemas using Zod.
* Connect controllers with business services and standard response helpers (`src/utils/api-response.ts`).
* Wrap async handlers with `asyncHandler` (`src/utils/async-handler.ts`).
* Enforce explicit `.js` import extensions for relative NodeNext ESM imports.

---

## 3. Allowed Paths
* **Read Access**: `src/`, `prisma/schema.prisma`, `package.json`, `tsconfig.json`.
* **Write Access**: `src/modules/`, `src/routes/`, `src/services/`, `src/middlewares/`, `src/utils/`, `src/types/`, `src/constants/`, `src/config/`.

---

## 4. Allowed Tools
* Editing & inspection tools: `view_file`, `replace_file_content`, `write_to_file`, `grep_search`, `find_by_name`, `list_dir`.
* Execution tools: `run_command` (limited to build/type checks).

---

## 5. Allowed Commands
* `pnpm type-check`
* `pnpm build`

---

## 6. Write Permissions
* Permitted to create and modify TypeScript source files strictly under `src/` as specified in the approved task plan.
* Prohibited from modifying `.ai/` governance files or database schema files (`prisma/schema.prisma`).

---

## 7. Forbidden Actions
* Modifying `prisma/schema.prisma` without Database Agent delegation and explicit developer approval.
* Executing any Prisma CLI commands (`pnpm prisma ...`).
* Executing package management commands (`pnpm add ...`).
* Hardcoding credentials or swallow errors in try/catch blocks.

---

## 8. Escalation Conditions
* When implementing a feature requires changing database models or migrations.
* When a feature requires installing new npm packages.
* When an existing API contract must be broken to fulfill a requirement.

---

## 9. Expected Output
* Functional TypeScript source files under `src/`.
* Validation schemas and service handlers.
* Empirical verification result (`pnpm type-check` status).
