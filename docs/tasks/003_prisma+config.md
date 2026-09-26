# Task: Verify PostgreSQL Connection & Establish Prisma Scripts

You are working on the **Wedding Management Backend** repository.

Before doing anything, read and comply with:

1. `AI_CONTEXT.md`
2. `.ai/AGENTS.md`
3. All applicable rules under `.ai/rules/`

The project has already made the following decisions:

- Database provider: **PostgreSQL**
- PostgreSQL has already been configured by the developer.
- Prisma is already part of the project's technology stack.
- The project uses `pnpm`.
- The backend uses TypeScript + ESM + `NodeNext`.
- Code-quality tooling (ESLint/Prettier) has already been configured.

## Objective

Verify that the application's **Prisma → PostgreSQL connection is actually established successfully** and establish a clean set of **Prisma-related package scripts** for development and database management.

This task is about **verification and Prisma tooling only**.

Do **not** design or implement the application's domain schema yet.

---

# Phase 1 — Explore Existing Configuration

Inspect the repository before making any changes.

### Prisma

Inspect:

- `prisma/schema.prisma`
- `prisma.config.ts`, if present
- Prisma package versions
- `@prisma/client` version
- Prisma CLI version
- Prisma generator configuration
- Prisma datasource configuration
- Prisma output configuration
- Existing migrations
- Existing generated Prisma Client configuration
- Existing Prisma-related files

Determine exactly how Prisma is currently configured.

### PostgreSQL

Inspect:

- Environment configuration
- `DATABASE_URL`
- Environment validation/configuration
- PostgreSQL datasource configuration
- Existing migration state

**Never print or expose the actual database credentials/password/token from `.env`.**

You may report:

```text
DATABASE_URL: configured
DATABASE_URL: missing
DATABASE_URL: invalid format
```

but never expose its secret value.

### Package Scripts

Inspect the existing `package.json` scripts.

Determine whether Prisma scripts already exist.

Do not blindly add duplicate scripts.

---

# Phase 2 — Verify Database Connectivity

Determine the safest and most appropriate way to verify:

```text
Application
    ↓
Prisma
    ↓
PostgreSQL
```

The verification must confirm an **actual database connection**, not merely that `DATABASE_URL` exists.

Prefer the project's existing Prisma setup and CLI where appropriate.

The verification should establish whether:

1. Prisma can load its configuration.
2. Prisma can read the configured datasource.
3. PostgreSQL is reachable.
4. Prisma can successfully communicate with PostgreSQL.
5. The current migration/schema state is valid.

If a temporary connection-check script is required, explain why before creating it.

Do not create unnecessary permanent application code solely for testing.

---

# Phase 3 — Prisma Scripts

Review the existing `package.json` and determine the appropriate Prisma scripts.

Consider scripts such as:

```text
pnpm prisma:generate
pnpm prisma:validate
pnpm prisma:format
pnpm prisma:migrate
pnpm prisma:migrate:dev
pnpm prisma:migrate:deploy
pnpm prisma:studio
pnpm prisma:db:push
pnpm prisma:db:pull
pnpm prisma:status
```

Do **not** automatically add all of them.

Select only the scripts that make sense for this project's current Prisma version and workflow.

For every proposed script, explain:

- What command it executes
- What it is used for
- Whether it is intended for development, CI/CD, or production
- Whether it should be included now or deferred

Pay particular attention to the difference between:

```text
prisma migrate
prisma db push
```

Do not establish a workflow that could accidentally bypass migrations.

---

# Phase 4 — Migration Workflow

Determine the project's recommended database workflow.

The plan should clearly distinguish:

### Development

```text
Schema change
    ↓
Migration
    ↓
Generate Prisma Client
    ↓
Application verification
```

### Production

```text
Committed migrations
    ↓
Prisma migration deployment
    ↓
Application startup
```

Do not implement production deployment infrastructure in this task.

---

# Phase 5 — Prisma Client

Inspect whether the project already has a centralized Prisma Client.

The intended architecture should remain compatible with:

```text
src/
└── libs/
    └── prisma/
        └── client.ts
```

If the client does not exist, determine whether it should be created as part of this task.

If it already exists, verify that it is correctly configured.

Pay attention to:

- Prisma 7 configuration
- ESM
- NodeNext
- TypeScript
- development hot reload
- avoiding unnecessary multiple Prisma Client instances

Do not introduce a second Prisma architecture if one already exists.

---

# Constraints

Strictly follow these rules:

- Do not create User/Guest/Event/Vendor/etc. domain models.
- Do not redesign the database schema.
- Do not add authentication.
- Do not modify unrelated application code.
- Do not expose database credentials.
- Do not commit `.env` secrets.
- Do not introduce unnecessary dependencies.
- Do not upgrade Prisma without justification.
- Do not blindly modify `schema.prisma`.
- Do not use `db push` as a replacement for migrations unless the existing project workflow explicitly requires it.
- Preserve the existing ESM + NodeNext architecture.
- Follow existing project conventions.
- Do not make changes before completing the exploration and planning phase.

---

# Required Workflow

Follow this exact process:

```text
1. Read project governance
2. Explore Prisma configuration
3. Explore PostgreSQL configuration
4. Inspect package scripts
5. Determine connection verification method
6. Determine required Prisma scripts
7. Produce implementation plan
8. STOP
9. Wait for explicit approval
10. Implement only after approval
11. Validate
12. Review final diff
13. Report results
```

---

# Expected Output — Planning Phase

Return:

## 1. Current Prisma Configuration

Explain what is currently configured.

## 2. PostgreSQL Configuration

Explain whether the PostgreSQL configuration appears complete.

Do not expose secrets.

## 3. Connection Verification Plan

Explain exactly how you will prove that:

```text
Prisma → PostgreSQL
```

is working.

## 4. Current Prisma Scripts

List the Prisma-related scripts already present in `package.json`.

## 5. Proposed Prisma Scripts

For each proposed script:

```text
Script
Command
Purpose
Environment
Reason
```

## 6. Prisma Client Assessment

Explain whether the current Prisma Client architecture is correct and whether anything needs to change.

## 7. Files to Modify

List exact files.

## 8. Files to Create

List exact files, if any.

## 9. Validation Plan

Explain the commands/checks that will prove the implementation works.

## 10. Implementation Plan

Provide the exact implementation sequence.

End with:

> **Implementation plan prepared. Waiting for explicit approval before making changes.**

**Do not modify any files during this planning phase.**
