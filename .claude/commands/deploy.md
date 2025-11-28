---
description: Deploy to Vercel with pre-deployment checks
allowed-tools: Bash(vercel:*), Bash(pnpm:*), Bash(git:*), Read
---

# Deploy to Vercel

Deploy the Composition app to Vercel with proper checks.

## Pre-Deployment Checklist

### 1. Git Status
!`git status --short`

### 2. Current Branch
!`git branch --show-current`

### 3. Build Check
```bash
pnpm build
```

## Deployment Steps

Only proceed if pre-deployment checks pass:

1. **Preview Deploy** (recommended first)
```bash
vercel
```

2. **Production Deploy**
```bash
vercel --prod
```

## Instructions

1. Verify all changes are committed
2. Run build check to ensure no errors
3. For preview deployments: run `vercel`
4. For production deployments: run `vercel --prod`
5. Report the deployment URL
6. Check for any deployment errors

**IMPORTANT**: Only deploy to production (`--prod`) if explicitly requested by the user.
