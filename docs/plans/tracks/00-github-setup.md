# Track 0: GitHub Repository Setup

> **Agent:** fullstack-dev | **Branch:** `main` | **Mode:** Initial setup

**Goal:** Initialize GitHub repository with CI workflow and branch protection.

**Run this BEFORE any other track.**

---

## Step 1: Initialize Git Repository

```bash
# Ensure git is initialized
git init

# Set default branch
git branch -M main

# Initial commit with existing config
git add .
git commit -m "chore: initial project configuration

- Claude Code agents and skills
- Project documentation (CLAUDE.md)
- MCP server configuration

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Step 2: Create GitHub Repository

```bash
# Create repo (adjust visibility as needed)
gh repo create composition --public --source=. --remote=origin --push

# Or for private:
# gh repo create composition --private --source=. --remote=origin --push
```

---

## Step 3: Create CI Workflow

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  check:
    name: Type Check & Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: 8

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Type check
        run: pnpm tsc --noEmit

      - name: Lint
        run: pnpm lint

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: check
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: 8

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm build
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
          REDIS_URL: redis://localhost:6379
          ANTHROPIC_API_KEY: sk-test-key
```

```bash
mkdir -p .github/workflows
# Write ci.yml
git add .github/
git commit -m "ci: add GitHub Actions workflow for type check, lint, and build"
git push origin main
```

---

## Step 4: Create Develop Branch

```bash
# Create develop branch
git checkout -b develop main
git push -u origin develop
```

---

## Step 5: Configure Branch Protection (Optional)

```bash
# Require PR reviews for main
gh api repos/:owner/:repo/branches/main/protection -X PUT -f required_status_checks='{"strict":true,"contexts":["check","build"]}' -f enforce_admins=false -f required_pull_request_reviews='{"required_approving_review_count":0}'

# Or configure via GitHub UI:
# Settings → Branches → Add rule → main
# - Require status checks: check, build
# - Require PR before merging
```

---

## Step 6: Create Labels

```bash
gh label create track --color 0E8A16 --description "Development track"
gh label create foundation --color 1D76DB --description "Foundation track"
gh label create backend --color D93F0B --description "Backend track"
gh label create frontend --color FBCA04 --description "Frontend track"
gh label create visualization --color 5319E7 --description "3D visualization track"
gh label create ready-for-review --color 0E8A16 --description "PR ready for code review"
```

---

## Step 7: Create Project Board (Optional)

```bash
# Create project
gh project create --owner @me --title "Composition MVP"

# Or use GitHub UI:
# Projects → New project → Board
# Columns: Backlog, In Progress, Review, Done
```

---

## Verification

```bash
# Check repo status
gh repo view

# Check workflow runs
gh run list

# Check branches
git branch -a

# Check labels
gh label list
```

---

## Next Steps

After this track completes:
1. Execute Track 1: Foundation (`01-foundation.md`)
2. Then parallel tracks 2-4
3. Finally Track 5: Integration

---

## Troubleshooting

### gh auth issues
```bash
gh auth login
gh auth status
```

### Push rejected
```bash
git pull --rebase origin main
git push origin main
```

### Workflow not triggering
- Check `.github/workflows/ci.yml` syntax
- Verify branch names match
