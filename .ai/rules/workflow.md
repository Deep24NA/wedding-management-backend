# WORKFLOW, SAFETY & AUDITABILITY RULES

This document defines the standard operating lifecycle, pre-execution planning protocol, developer approval boundaries, empirical verification standards, self-check protocol, circuit breaker mechanism, human-in-the-loop triggers, scope control, ambiguity management, and auditability rules for all AI agents.

---

## 1. Standard Operating Lifecycle

Every task executed by an AI agent MUST follow this 10-step sequential workflow:

```
1. Inspect ➔ 2. Read Context ➔ 3. Plan ➔ 4. Seek Approval ➔ 5. Execute ➔
6. Verify ➔ 7. Diff Review ➔ 8. Self-Check ➔ 9. Update Context ➔ 10. Audit Report
```

### Step Breakdown:

1. **Inspect**: Read target files, repository structure, and relevant module implementations.
2. **Read Context**: Inspect `AI_CONTEXT.md` and load applicable `.ai/rules/` files.
3. **Plan**: Formulate a clear, written execution plan before performing any write operations.
4. **Seek Approval**: Obtain developer authorization if the plan involves SENSITIVE WRITE, HIGH-RISK/DESTRUCTIVE, database/Prisma, dependency, or Git operations.
5. **Execute**: Implement the minimum safe change scoped strictly to the approved task.
6. **Verify**: Run empirical build/type-check (`pnpm type-check` or `pnpm build`) and unit/integration tests.
7. **Diff Review**: Inspect modified lines (`git diff`) to ensure zero unintended changes occurred.
8. **Self-Check**: Run the mandatory 10-point self-check protocol.
9. **Update Context**: Update `AI_CONTEXT.md` if milestone state or confirmed architectural decisions changed.
10. **Audit Report**: Provide a concise action rationale and status summary to the developer.

---

## 2. Pre-Execution Planning Protocol

Before performing write operations, the agent MUST present a plan detailing:

- **Objective**: Clear statement of the goal.
- **Target Files**: Specific files to modify, create, or delete.
- **Proposed Changes**: Concise breakdown of code edits.
- **Tools & Commands**: Commands to be executed.
- **Dependencies**: Any required libraries (and justification).
- **Risks & Impact**: Potential side effects on architecture or API contracts.
- **Verification Method**: Specific test or compilation commands for verification.

---

## 3. Strict Approval & Confirmation Protocols

1. **Sensitive Operations**: Require developer approval prior to plan execution.
2. **Database Operations**: Require explicit approval for EVERY SINGLE command execution (approval for command A does NOT grant approval for command B).
3. **Destructive Operations**: Require single-action confirmation immediately prior to execution after explaining command, changes, and risks.

---

## 4. Scope Control & Ambiguity Management

1. **Scope Control**:
   - Modify ONLY files relevant to the approved task.
   - Do NOT silently fix unrelated issues.
   - If an unrelated bug or formatting issue is discovered: **Report it to the developer** without modifying it.
2. **Ambiguity Resolution Protocol**:
   - Do NOT guess when ambiguity affects: database structure, architecture, API contracts, security, authentication, business logic, data integrity, or UI/UX interaction flows.
   - When high-impact ambiguity occurs:
     1. Identify the ambiguity clearly.
     2. Explain the possible technical interpretations.
     3. Explain the consequences of each option.
     4. Ask the developer to decide.
   - For low-impact implementation details, adopt the least surprising existing codebase convention and explicitly state the assumption.

---

## 5. Circuit Breaker Mechanism

To prevent infinite loops and repeated failed retries:

1. **Retry Limit**: If the exact same strategy, code edit, or command fails **3 consecutive times**:
   - **STOP execution immediately**.
   - Do NOT attempt a 4th automated attempt.
2. **Escalation Report**: Report what was attempted, the exact error encountered, previous attempts, likely root cause, and the specific developer input or decision required to unblock progress.

---

## 6. Human-in-the-Loop Triggers

Agents MUST require developer involvement when:

- Agent confidence is insufficient.
- Requirements are ambiguous or incomplete.
- Action is irreversible or high-risk.
- Data integrity or security is affected.
- Architecture, API contracts, or UI/UX flows are changing.
- Git history or remotes are affected.
- Database state or schema is changing.
- Dependencies are being added, removed, or updated.

---

## 7. Empirical Verification & Status Reporting

1. **Verification Requirement**: Never declare a task "Completed" or code "Working" without empirical runtime verification (`pnpm type-check`, `pnpm build`, tests).
2. **Standardized Task States**:
   - **Verified**: Implemented and empirically verified via compiler/tests.
   - **Partially Verified**: Implemented; partial checks succeeded, remaining require developer environment.
   - **Implemented**: Code written, but automated build/test verification could not be run.
   - **Not Verified**: Code written, verification pending.
   - **Blocked**: Execution halted due to circuit breaker, missing permission, or ambiguity.

---

## 8. Mandatory 10-Point Self-Check Protocol

Before declaring any task complete, the AI agent MUST verify:

1. Did I follow the approved task scope?
2. Did I modify only necessary files?
3. Did I preserve existing architecture and folder structure?
4. Did I preserve existing codebase behavior?
5. Did I preserve UI/UX and API interaction flows?
6. Did I avoid introducing unapproved dependencies?
7. Did I avoid executing restricted commands without explicit approval?
8. Did I keep secrets, keys, and credentials completely safe?
9. Did I empirically verify the implementation (`pnpm type-check` / tests)?
10. Does `AI_CONTEXT.md` need an update based on completed state?

---

## 9. Action Rationale & Auditability

Agents must provide concise, auditable summaries without exposing private chain-of-thought:

- **Format**:
  `Action: <Brief title of operation>`
  `Reason: <Clear justification grounded in task objective>`

- **Example (Sensitive Action Request)**:
  `Action: Request permission to execute pnpm prisma generate`
  `Reason: Generate updated Prisma client types required for approved user service implementation.`
