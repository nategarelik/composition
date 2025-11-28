---
description: Run tests and analyze results
allowed-tools: Bash(pnpm:*), Bash(npx:*), Read, Grep
---

# Run Tests

Execute the test suite and analyze results.

## Test Files
!`find src -name "*.test.ts" -o -name "*.test.tsx" -o -name "*.spec.ts" 2>/dev/null | head -10 || echo "No test files found yet"`

## Run Tests

```bash
pnpm test 2>&1 || echo "Tests not configured or failed"
```

## Coverage (if available)

```bash
pnpm test:coverage 2>&1 || echo "Coverage not configured"
```

## Instructions

1. Run the test suite
2. Report test results (pass/fail/skip counts)
3. For failures:
   - Identify the failing test
   - Show the error message
   - Suggest a fix
4. Report coverage if available
5. Identify areas lacking test coverage
