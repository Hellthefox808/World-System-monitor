# RAVI MONITOR — Maximum Context Loop Engineering Workflow

This guide establishes the mandatory engineering protocol for executing audits, enhancements, and validation cycles on **RAVI MONITOR**.

---

## The Required Sequence

Every task, feature, or refactoring phase must follow the 11-step loop without skipping phases:

```text
1. Discover
   └── Inspect directory structure, entrypoints, contracts, licenses, and dependencies.
2. Map
   └── Trace dependency graph (types → config → services → components → app → App.ts).
3. Establish Ownership Boundaries
   └── Maintain strict separation between downstream branding tokens and upstream source code.
4. Design
   └── Draft implementation plan with user-facing verification steps and risk mitigations.
5. Implement
   └── Apply surgical edits adhering to architectural constraints and safe HTML sink rules.
6. Validate
   └── Execute automated validation commands (typecheck, lint:boundaries, sync:locales:check, etc.).
7. Debug
   └── Trace exact failure roots without fabricating test results or bypassing checks.
8. Harden
   └── Validate security boundaries, secret exposure guards, and unicode safety.
9. Synchronize
   └── Sync all 25 locale files, metadata variants, and test fixtures.
10. Package
    └── Verify build outputs, bundle integrity, and desktop packaging contracts.
11. Report
    └── Deliver structured summary with exact verified results and reproducible metrics.
```

---

## Non-Negotiable Governance Rules

1. **Source of Truth**: The active repository is the sole authority. Never fabricate APIs, credentials, or validation outcomes.
2. **License Compliance**: AGPL-3.0-only terms and upstream author attribution (`Elie Habib`) must remain intact across all derivative distributions.
3. **Brand Isolation**: All downstream brand tokens must reside in `src/config/branding.ts` to allow seamless upstream rebasing.
4. **Zero Boundary Violations**: Strictly adhere to `types → config → services → components → app → App.ts` unidirectional architecture.
