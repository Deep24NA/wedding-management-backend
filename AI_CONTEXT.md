# PROJECT CONTEXT: Wedding Management Backend

This document serves as the single persistent source of truth for the project state, technical constraints, completed milestones, and open decisions for the **Wedding Management Backend** repository.

---

## 1. Project Overview & Repository Structure

- **Project Name**: Wedding Management Backend (`wedding_management_backend`)
- **Repository Architecture**: Standalone Backend API Service
- **Repository Isolation**: Strictly separate repository from frontend. Monorepo setups, pnpm workspaces, and combined frontend/backend repositories are **prohibited**.
- **Current Stage**: Initial Scaffold / Boilerplate Stage.

---

## 2. Technical Stack Specification

| Component                 | Technology | Version / Configuration                         |
| :------------------------ | :--------- | :---------------------------------------------- |
| **Runtime Environment**   | Node.js    | Target `ES2022`                                 |
| **Language**              | TypeScript | `^7.0.2`, `moduleResolution: NodeNext`          |
| **Package Manager**       | pnpm       | `10.34.5` (via `package.json` `packageManager`) |
| **Web Framework**         | Express    | `^5.2.1`                                        |
| **Data Validation**       | Zod        | `^4.5.4`                                        |
| **ORM / Data Access**     | Prisma     | `@prisma/client: ^7.10.0`                       |
| **Development Execution** | tsx        | `tsx watch src/server.ts`                       |

---

## 3. Project Status & Decisions Matrix

### Confirmed Architectural Decisions

- Modular layered structure (`src/routes/`, `src/middlewares/`, `src/services/`, `src/libs/prisma/`, `src/modules/`).
- Centralized error handling via `asyncHandler` (`src/utils/async-handler.ts`).
- Standardized API response payloads via `api-response.ts`.
- Explicit ESM file extension (`.js`) required on relative imports under `NodeNext`.
- Production security foundation configured (Helmet secure HTTP headers, CORS with environment-driven origins, body payload size limiting, HPP parameter pollution protection, global baseline rate limiting, Node HTTP server timeouts, and centralized error handling hiding sensitive details in production).
- Express server explicitly started via Node's `http.createServer` to enforce production timeout configurations, avoiding raw `app.listen`.
- Prettier established as the repository-wide formatting authority (enforced via `pnpm format:check` / `pnpm format:write`).

### Open & Undecided Items

- **Database Provider Target**: `Not yet decided` / `Unknown` (MySQL candidate, awaiting developer finalization).
- **Entity Schema Design**: `Not yet decided` (Entities such as Users, Events, Guests, Vendors, Invitations, and Budgets are planned but schemas are uninitialized).
- **Authentication Provider & Token Expiration**: `Not yet decided`.
- **Deployment & Production Infrastructure**: `Not yet decided`.

---

## 4. Architectural Decision Records (ADRs) Directory

- **Decision Log Directory**: [`docs/decisions/`](file:///d:/coding/projects/wedding_management_backend/docs/decisions)
- Formal technical and architectural decisions (ADRs) confirmed by the developer are recorded as Markdown files under `docs/decisions/` and referenced below:
  - [ADR 0001: Code Formatting with Prettier](file:///D:/coding/projects/wedding_management_backend/docs/decisions/0001-code-formatting.md)
  - [ADR 0002: Express Server Initialization and Timeouts](file:///D:/coding/projects/wedding_management_backend/docs/decisions/0002-express-server-initialization.md)

---

## 5. Governance & AI Guidelines Summary

All AI assistants and agents operating within this repository must read `AI_CONTEXT.md` before initiating tasks and comply strictly with governance rules defined in `.ai/AGENTS.md` and `.ai/rules/`.
