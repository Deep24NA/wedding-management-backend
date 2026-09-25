# ADR 0001: Code Formatting with Prettier

## Status
Accepted

## Context
To maintain code consistency and reduce friction in code reviews, a deterministic code formatter is required. The repository lacked an enforced standard for spacing, quotes, and commas, which can lead to divergent styles as different AI agents and developers contribute.

## Decision
We established Prettier as the repository-wide code formatter. The configuration strictly enforces:
- Single quotes
- Trailing commas
- Semicolons
- 2-space indentation
- `lf` end of line

## Consequences
- All code additions must be formatted using Prettier.
- The `pnpm format:write` script handles the formatting.
- `generated/` files (like Prisma types) and build artifacts (`dist/`) are strictly ignored to prevent overriding tool-managed outputs.
