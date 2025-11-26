# Composition MVP - Orchestration Playbook

> **For Orchestrating Agent:** Execute this playbook to coordinate subagent-driven development.

---

## Pre-Flight Checklist

```
[ ] gh CLI installed and authenticated (gh auth status)
[ ] Node.js 18+ installed (node --version)
[ ] pnpm installed (pnpm --version)
[ ] Git configured (git config user.name && git config user.email)
[ ] Working directory: C:\Users\Nate2\Composition
```

---

## Execution Timeline

| Phase | Track | Agent | Duration | Blocking |
|-------|-------|-------|----------|----------|
| 0 | GitHub Setup | fullstack-dev | 5 min | Yes |
| 1 | Foundation | fullstack-dev | 15 min | Yes |
| 2a | Backend | fullstack-dev | 10 min | No |
| 2b | Frontend | fullstack-dev | 12 min | No |
| 2c | Visualization | 3d-specialist | 15 min | No |
| 3 | Integration | code-reviewer | 10 min | Yes |

**Total estimated: ~45 min** (with parallel execution of Phase 2)

---

## Phase 0: GitHub Setup

### Task 0.1: Verify Prerequisites
```bash
gh auth status
node --version
pnpm --version
git config user.name
```
**Expected:** All commands succeed

### Task 0.2: Dispatch GitHub Setup Agent
```
Dispatch: fullstack-dev agent
Prompt: "Execute docs/plans/tracks/00-github-setup.md - Initialize GitHub repository with CI workflow. Report back with repo URL and confirmation that develop branch exists."
```

### Task 0.3: Verify GitHub Setup Complete
```bash
gh repo view --json url,defaultBranchRef
gh run list --limit 1
git branch -a | grep develop
```
**Expected:** Repo exists, CI workflow present, develop branch created

### Task 0.4: Log Completion
```
[PHASE 0 COMPLETE]
- Repo URL: https://github.com/{owner}/composition
- CI Workflow: .github/workflows/ci.yml
- Branches: main, develop
- Labels: track, foundation, backend, frontend, visualization
```

---

## Phase 1: Foundation (BLOCKING)

### Task 1.1: Dispatch Foundation Agent
```
Dispatch: fullstack-dev agent
Prompt: "Execute docs/plans/tracks/01-foundation.md - Initialize Next.js project with all dependencies, Prisma schema, TypeScript types, and utilities. Create PR to develop branch. Report back with PR number and URL."
```

### Task 1.2: Monitor Foundation Progress
```bash
# Check branch exists
git fetch origin
git branch -r | grep track/foundation

# Check PR created
gh pr list --search "Foundation"
```

### Task 1.3: Wait for CI Checks
```bash
FOUNDATION_PR=$(gh pr list --search "Foundation" --json number -q '.[0].number')
gh pr checks $FOUNDATION_PR --watch
```
**Expected:** All checks pass (type-check, lint, build)

### Task 1.4: Merge Foundation PR
```bash
gh pr merge $FOUNDATION_PR --squash --delete-branch
git checkout develop && git pull origin develop
```

### Task 1.5: Log Completion
```
[PHASE 1 COMPLETE]
- PR: #X merged to develop
- Files: package.json, tsconfig.json, prisma/schema.prisma, src/types/*, src/lib/*
- Dependencies: 15 packages installed
- TypeScript: Strict mode enabled
```

---

## Phase 2: Parallel Development

### Task 2.0: Prepare Parallel Dispatch
```
Verify: develop branch has foundation code
Command: git log develop --oneline -5
Expected: Foundation commits visible
```

### Task 2.1: Dispatch Backend Agent
```
Dispatch: fullstack-dev agent
Prompt: "Execute docs/plans/tracks/02-backend.md - Build AI research agent and API routes. Branch from develop. Create PR when complete. Report back with PR number."
```

### Task 2.2: Dispatch Frontend Agent
```
Dispatch: fullstack-dev agent
Prompt: "Execute docs/plans/tracks/03-frontend.md - Build Zustand stores, search components, and pages. Branch from develop. Create PR when complete. Report back with PR number."
```

### Task 2.3: Dispatch Visualization Agent
```
Dispatch: 3d-specialist agent
Prompt: "Execute docs/plans/tracks/04-visualization.md - Build React Three Fiber visualization components. Branch from develop. Create PR when complete. Report back with PR number."
```

### Task 2.4: Monitor Parallel Progress
```bash
# Poll for PR creation (run periodically)
gh pr list --state open --json number,title,headRefName

# Expected PRs:
# - track/backend: "feat: Backend - AI research pipeline"
# - track/frontend: "feat: Frontend - Search UI and pages"
# - track/visualization: "feat: 3D Visualization - R3F viewer"
```

### Task 2.5: Wait for All PRs
```bash
# Get PR numbers
BACKEND_PR=$(gh pr list --search "Backend" --json number -q '.[0].number')
FRONTEND_PR=$(gh pr list --search "Frontend" --json number -q '.[0].number')
VIZ_PR=$(gh pr list --search "Visualization" --json number -q '.[0].number')

# Wait for checks on each
gh pr checks $BACKEND_PR --watch &
gh pr checks $FRONTEND_PR --watch &
gh pr checks $VIZ_PR --watch &
wait
```

### Task 2.6: Log Completion
```
[PHASE 2 COMPLETE]
- Backend PR: #X (checks passing)
- Frontend PR: #Y (checks passing)
- Visualization PR: #Z (checks passing)
- All branches ready for integration
```

---

## Phase 3: Integration & Release

### Task 3.1: Dispatch Integration Agent
```
Dispatch: code-reviewer agent
Prompt: "Execute docs/plans/tracks/05-integration.md - Review all open PRs, merge to develop in order (backend, frontend, visualization), run integration tests, create release PR to main. Report back with release PR number."
```

### Task 3.2: Monitor Integration
```bash
# Watch PR merges
gh pr list --state merged --json number,title --limit 5

# Verify develop builds
git checkout develop && git pull
pnpm install && pnpm build
```

### Task 3.3: Verify Release PR
```bash
RELEASE_PR=$(gh pr list --search "Release" --json number -q '.[0].number')
gh pr view $RELEASE_PR
gh pr checks $RELEASE_PR
```

### Task 3.4: Final Merge
```bash
gh pr merge $RELEASE_PR --merge
git checkout main && git pull
git tag -a v0.1.0 -m "MVP Release"
git push origin v0.1.0
```

### Task 3.5: Log Completion
```
[PHASE 3 COMPLETE]
- Release PR: #W merged to main
- Tag: v0.1.0 created
- All tracks integrated
```

---

## Execution Log Template

```markdown
# Composition MVP Execution Log

## Session Info
- Date: YYYY-MM-DD
- Orchestrator: [agent-id]
- Start Time: HH:MM

## Phase 0: GitHub Setup
- [ ] Started: HH:MM
- [ ] Agent dispatched: [agent-id]
- [ ] Repo created: [url]
- [ ] Completed: HH:MM

## Phase 1: Foundation
- [ ] Started: HH:MM
- [ ] Agent dispatched: [agent-id]
- [ ] PR created: #N
- [ ] CI passed: HH:MM
- [ ] Merged: HH:MM

## Phase 2: Parallel Development
- [ ] Started: HH:MM
- Backend Agent: [agent-id]
  - [ ] PR created: #N
  - [ ] CI passed: HH:MM
- Frontend Agent: [agent-id]
  - [ ] PR created: #N
  - [ ] CI passed: HH:MM
- Visualization Agent: [agent-id]
  - [ ] PR created: #N
  - [ ] CI passed: HH:MM

## Phase 3: Integration
- [ ] Started: HH:MM
- [ ] Agent dispatched: [agent-id]
- [ ] Backend merged: HH:MM
- [ ] Frontend merged: HH:MM
- [ ] Visualization merged: HH:MM
- [ ] Release PR: #N
- [ ] Released: HH:MM
- [ ] Tag: v0.1.0

## Final Status
- Total Duration: X minutes
- PRs Merged: N
- Commits: N
- Build Status: PASSING
```

---

## Error Recovery

### CI Failure
```bash
# Get failure details
gh pr checks $PR_NUMBER
gh run view --log-failed

# Ask agent to fix
Prompt: "CI failed on PR #N. Error: [paste error]. Fix and push."
```

### Merge Conflict
```bash
# Identify conflict
gh pr view $PR_NUMBER

# Ask agent to resolve
Prompt: "PR #N has merge conflict with develop. Rebase and resolve conflicts."
```

### Agent Timeout
```bash
# Check branch progress
git fetch origin
git log origin/track/[name] --oneline -5

# Resume with new agent
Prompt: "Continue work on track/[name] branch. Previous agent timed out. Complete remaining tasks from docs/plans/tracks/[XX-name.md]."
```

---

## Quick Commands Reference

```bash
# Status check
gh pr list --state open
gh run list --limit 5

# Dispatch pattern
"Execute docs/plans/tracks/[XX-name.md] - [brief goal]. Report PR number when done."

# Merge pattern
gh pr merge $PR --squash --delete-branch

# Release pattern
git tag -a v0.1.0 -m "MVP Release" && git push origin v0.1.0
```

---

## Success Criteria

```
[x] GitHub repo initialized with CI
[x] Foundation track merged (Next.js, deps, types)
[x] Backend track merged (AI agent, APIs)
[x] Frontend track merged (UI, stores, pages)
[x] Visualization track merged (3D viewer)
[x] All integration tests passing
[x] Release v0.1.0 tagged
[x] Vercel deployment live
```
