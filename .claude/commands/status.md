---
description: Show comprehensive project status including git, dependencies, and build health
allowed-tools: Bash(git:*), Bash(pnpm:*), Bash(node:*), Read
---

# Project Status Check

Comprehensive status check for the Composition project.

## Git Status
!`git status --short`
!`git log --oneline -5`

## Branch Info
!`git branch -vv`

## Dependencies
!`pnpm outdated 2>/dev/null | head -20 || echo "Dependencies up to date"`

## Build Health
Check if the project builds successfully:

```bash
pnpm type-check 2>&1 | tail -5
```

## Environment
!`echo "Node: $(node -v) | pnpm: $(pnpm -v)"`

## Recent Activity
!`git log --oneline --since="1 week ago" | wc -l` commits in the last week

## Instructions

Provide a summary of:
1. Current branch and uncommitted changes
2. Recent commits and their purpose
3. Any outdated dependencies that need attention
4. Build/type check status
5. Recommendations for next actions
