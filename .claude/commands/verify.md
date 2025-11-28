---
description: Run full verification suite (type-check, lint, build) before committing
allowed-tools: Bash(pnpm:*), Bash(npx:*), Read
---

# Verification Suite

Run the full verification suite to ensure code quality before committing.

## Current Status
!`git status --short`

## Steps

1. **TypeScript Type Check**
```bash
pnpm type-check
```

2. **ESLint**
```bash
pnpm lint
```

3. **Build Check**
```bash
pnpm build
```

## Instructions

Run each verification step. If any step fails:
1. Report the specific errors
2. Suggest fixes for each issue
3. DO NOT proceed with commits until all checks pass

After all checks pass, report:
- Total TypeScript errors fixed (if any)
- Total lint issues resolved (if any)
- Build status and bundle size
