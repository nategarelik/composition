---
description: Automatically fix lint and formatting issues across the codebase
allowed-tools: Bash(pnpm:*), Bash(npx:*), Read
---

# Fix Code Issues

Automatically fix lint and formatting issues.

## Current Issues
!`pnpm lint 2>&1 | grep -E "(error|warning)" | head -20 || echo "No lint issues"`

## Steps

1. **Fix ESLint Issues**
```bash
pnpm lint --fix
```

2. **Format with Prettier**
```bash
npx prettier --write "src/**/*.{ts,tsx,js,jsx,json,css,md}"
```

3. **Verify Fixes**
```bash
pnpm lint
pnpm type-check
```

## Instructions

1. Run the fix commands above
2. Report what was automatically fixed
3. List any remaining issues that need manual intervention
4. Suggest fixes for manual issues with file:line references
