# PROJECT-SPECIFIC CONSTRAINTS & SAFETY RULES

This document defines repository-specific constraints, tech stack boundaries, strict Database/Prisma safety rules, Git safety enforcement, and context management protocols for the **Wedding Management Backend** project.

---

## 1. Repository Architecture & Scope Boundaries

1. **Standalone Backend Repository**:
   * This repository (`wedding_management_backend`) is a **standalone backend API service**.
   * It is **NOT** a monorepo. It does **NOT** use pnpm workspaces, lerna, or multi-package tooling.
   * Frontend code is maintained in a completely separate repository (Next.js, React, shadcn/ui, npm).
   * Creating a monorepo, combining frontend and backend into one repository, or creating workspace setups is **strictly prohibited**.
2. **Current Project Stage**: Initial Scaffold / Boilerplate Stage.
   * Express and TypeScript setup exist (`src/app.ts`, `src/server.ts`, `package.json`, `tsconfig.json`).
   * Source directory structure is scaffolded (`src/config/`, `src/constants/`, `src/libs/`, `src/middlewares/`, `src/modules/`, `src/routes/`, `src/services/`, `src/types/`, `src/utils/`).
   * Database connections and schema models remain pending developer configuration.

---

## 2. Tech Stack & Source of Truth

* **Canonical Context Source**: `AI_CONTEXT.md` at the repository root is the active source of truth.
* **Stack Components**:
  * **Runtime**: Node.js (`ES2022`)
  * **Language**: TypeScript (`^7.0.2`, `moduleResolution: NodeNext`)
  * **Package Manager**: `pnpm` (`10.34.5`)
  * **Framework**: Express (`^5.2.1`)
  * **Validation**: Zod (`^4.5.4`)
  * **ORM**: Prisma (`@prisma/client ^7.10.0`)
* **Handling Undecided Requirements**:
  * If a project decision (e.g. database provider target, entity relations) is pending or unconfirmed in `AI_CONTEXT.md`, agents MUST treat it strictly as `Not yet decided` or `Unknown`.
  * Agents must **never** state undecided items as finalized choices.

---

## 3. Strict Database & Prisma Safety Rules

1. **Per-Execution Approval Requirement**:
   * AI agents MUST request explicit developer approval for **every single database or Prisma command execution**.
   * Approval granted for one command (e.g. `pnpm prisma generate`) **DOES NOT** grant authorization for subsequent commands (e.g. `pnpm prisma migrate dev`). Permission must be requested separately every time.
2. **Effect-Based Database Restriction**:
   * The restriction applies to ANY command, script, tool, API, or program capable of creating, modifying, deleting, migrating, seeding, resetting, or synchronizing database state.
   * Restricted commands include, but are not limited to:
     * `pnpm prisma generate`
     * `pnpm prisma migrate dev`
     * `pnpm prisma migrate deploy`
     * `pnpm prisma migrate reset`
     * `pnpm prisma db push`
     * `pnpm prisma db pull`
     * `pnpm prisma db seed`
     * `node scripts/setup-db.js` (or any custom DB setup script)
     * Direct SQL DDL (`CREATE`, `ALTER`, `DROP`) or DML (`INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`)
   * If an agent is uncertain whether a command modifies database state: **STOP and ask the developer**.
3. **Destructive Database Operations Protocol**:
   * For destructive database operations (`DROP`, `TRUNCATE`, `DELETE`, `migrate reset`, database reset), the agent MUST follow this exact sequence:
     1. Explain the exact command to be executed.
     2. Explain what data or schema elements it will change.
     3. Explain the risks involved.
     4. Ask for explicit confirmation immediately before execution.
     5. Execute ONLY after explicit confirmation is received.
   * Confirmation must NEVER be inferred from earlier discussions or general approvals.

---

## 4. Strict Git Safety & Remote Synchronization Rules

1. **Developer-Controlled Git Operations**:
   * The developer strictly controls Git repository history, commits, branch management, and remote synchronization.
   * AI agents may perform READ-ONLY Git inspections (`git status`, `git diff`, `git log`, `git branch`, `git show`).
2. **Forbidden Autonomous Git Commands**:
   * AI agents MUST NOT execute any history-modifying, remote-synchronizing, or branch-mutating operations without explicit developer permission:
     * `git push`
     * `git pull`
     * `git fetch`
     * `git merge`
     * `git rebase`
     * `git reset`
     * `git revert`
     * `git cherry-pick`
     * `git clean`
     * `git branch -D`
     * Any command utilizing `--force` or `--hard` variants.
3. **Effect-Based Git Protection**:
   * The restriction applies based on the **EFFECT** of the operation. Any script, tool, automation, or custom command that indirectly performs a restricted Git operation (e.g. `npm run deploy-script` running `git push`) is subject to the exact same restrictions.
4. **Absolute Prohibitions**:
   * Without explicit approval, AI agents MUST NEVER: rewrite Git history, force push, delete branches, modify remote URLs/configurations, create/merge pull requests, or perform destructive repository cleanups.

---

## 5. Context Lifecycle Management

1. **Inspect Before Execution**: Always inspect `AI_CONTEXT.md` before planning or executing tasks.
2. **Milestone Updates Only**: Update `AI_CONTEXT.md` strictly when a milestone is completed, architecture is updated, or a decision is confirmed by the developer. Never log temporary task notes or conversation logs into `AI_CONTEXT.md`.
