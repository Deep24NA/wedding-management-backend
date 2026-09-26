# Task: Establish Code Quality & Tooling Foundation

You are working on the **Wedding Management Backend** repository.

Before doing anything, read and comply with:

1. `AI_CONTEXT.md`
2. `.ai/AGENTS.md`
3. All applicable rules under `.ai/rules/`

## Objective

We need to complete and formalize the project's **code-quality and development-tooling foundation** before moving to Prisma/database architecture or business modules.

The scope of this task is:

- ESLint configuration
- Prettier integration/refinement
- TypeScript strictness verification
- Lint and formatting scripts
- Import/order rules if appropriate
- Build and type-check verification

## Important Workflow Rule

**DO NOT MODIFY ANY FILES YET.**

This is the exploration and planning phase only.

Follow this workflow:

```text
1. Understand
2. Explore existing repository
3. Identify gaps/problems
4. Create implementation plan
5. STOP and wait for approval
6. Only implement after explicit approval
```

---

## Phase 1 — Explore

Inspect the existing repository and determine:

### ESLint

Check:

- Whether ESLint is already installed
- Current ESLint version
- Existing configuration files
- Existing plugins/configs
- Whether the configuration supports TypeScript
- Whether it supports the current ESM + `NodeNext` setup
- Whether it conflicts with Prettier
- Existing lint scripts

Do not assume ESLint is absent. Verify the current state first.

### Prettier

Inspect:

- Existing Prettier configuration
- `.prettierignore`
- `package.json` scripts
- Existing formatting rules
- Existing ADR related to Prettier
- Whether the current configuration is consistent with the project's ESM/TypeScript structure

Preserve already-confirmed Prettier decisions unless there is a concrete reason to change them.

### TypeScript

Inspect:

- `tsconfig.json`
- TypeScript version
- `module`
- `moduleResolution`
- `target`
- `strict`
- `noImplicitAny`
- `strictNullChecks`
- `noUncheckedIndexedAccess`
- `noImplicitReturns`
- `noUnusedLocals`
- `noUnusedParameters`
- Other relevant strictness settings

Determine what is currently configured and what should be verified rather than blindly changing settings.

The project currently targets:

```text
Node.js
ES2022
TypeScript
ESM
moduleResolution: NodeNext
```

Respect the existing architecture.

### Package Scripts

Inspect all existing scripts in `package.json`.

Determine whether the repository already has or needs:

```text
lint
lint:fix
format:check
format:write
typecheck
build
```

Do not duplicate or unnecessarily rename existing scripts.

### Import Ordering

Inspect the current import style and project architecture.

Determine whether an import-order rule provides meaningful value.

If you recommend one, explain:

- Which ESLint plugin/config would be used
- Why it is appropriate
- Whether it introduces an unnecessary dependency
- Whether it works correctly with TypeScript + ESM + NodeNext

Do not add import-order tooling merely for cosmetic reasons.

---

# Phase 2 — Identify Gaps

After exploration, produce a concise gap analysis.

Use this structure:

```text
Current State
  ↓
What already exists
  ↓
What is missing
  ↓
What is misconfigured
  ↓
What should remain unchanged
```

Clearly distinguish:

- Existing configuration
- Required changes
- Optional improvements
- Items that should NOT be changed

Avoid unnecessary modernization or introducing unrelated tooling.

---

# Phase 3 — Implementation Plan

Create a detailed implementation plan.

The plan should include:

## 1. ESLint

Specify:

- Configuration approach
- Required packages
- TypeScript integration
- Recommended rule categories
- Error vs warning decisions
- Prettier compatibility
- ESM/NodeNext compatibility

## 2. Prettier

Specify:

- Existing configuration to preserve
- Any required refinements
- Ignore files/directories
- Formatting scripts

Do not rewrite the existing Prettier setup without justification.

## 3. TypeScript

Specify:

- Current strictness configuration
- Whether changes are required
- Any potentially breaking strictness changes
- How type checking will be validated

## 4. Package Scripts

Specify the final desired scripts and their responsibilities.

For example:

```text
pnpm lint
pnpm lint:fix
pnpm format:check
pnpm format:write
pnpm typecheck
pnpm build
```

Only include scripts that are actually appropriate after inspecting the repository.

## 5. Import Ordering

State one of:

```text
RECOMMENDED
NOT REQUIRED
DEFERRED
```

and explain why.

## 6. Validation

Define exactly how the implementation will be validated.

At minimum consider:

```text
pnpm lint
pnpm format:check
pnpm typecheck
pnpm build
```

Also identify whether any existing tests need to be executed.

---

# Constraints

Follow these strictly:

- Do not modify unrelated files.
- Do not introduce unnecessary dependencies.
- Do not replace the existing architecture.
- Do not change confirmed architectural decisions without justification.
- Do not modify business logic.
- Do not create Prisma schemas or database models in this task.
- Do not implement authentication.
- Do not implement RBAC.
- Do not create domain modules.
- Do not change API behavior.
- Do not blindly upgrade packages.
- Do not change package versions unless required and justified.
- Do not create an alternative linting/formatting architecture if an existing one can be extended.
- Preserve the project's ESM + NodeNext conventions.
- Follow the repository's existing naming and folder conventions.

---

# Expected Output

Return only the following sections:

## 1. Repository Findings

What you discovered from the existing repository.

## 2. Current Configuration

Summarize the existing ESLint, Prettier, TypeScript, and package-script configuration.

## 3. Gaps

List only the actual gaps that need to be addressed.

## 4. Proposed Changes

Explain exactly what should change and why.

## 5. Files to Create

List files that would need to be created.

## 6. Files to Modify

List files that would need to be modified.

## 7. Dependencies

List:

- Existing dependencies that can be reused
- New dependencies, if genuinely required
- Reason for every new dependency

## 8. Validation Plan

Explain how the completed setup will be verified.

## 9. Implementation Plan

Give the implementation steps in the exact order they should be performed.

## 10. Approval Required

End with:

> Implementation plan prepared. Waiting for approval before making any changes.

**Do not implement anything until explicit approval is provided.**
