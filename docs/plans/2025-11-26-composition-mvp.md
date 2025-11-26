# Composition MVP - Parallel Execution Orchestration

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:dispatching-parallel-agents to execute tracks concurrently.

**Goal:** Build Composition MVP using parallel development tracks that merge via GitHub PR workflow with automated review.

**Architecture:** 4 parallel tracks developed on feature branches, merged to `develop` after CI passes, then to `main` for release.

**Execution Model:** Subagent-per-track with GitHub-based coordination.

---

## Branch Strategy

```
main (production)
  └── develop (integration)
        ├── track/foundation    → Tasks 1-6 (MUST complete first)
        ├── track/frontend      → Tasks 7-9, 16, 19-20 (depends on foundation)
        ├── track/backend       → Tasks 10-12, 17 (depends on foundation)
        └── track/visualization → Tasks 13-15, 18 (depends on foundation + types)
```

## Track Files

Each track is a self-contained plan in `docs/plans/tracks/`:

| Track | File | Agent | Dependencies |
|-------|------|-------|--------------|
| Foundation | `01-foundation.md` | fullstack-dev | None |
| Backend | `02-backend.md` | fullstack-dev | Foundation |
| Frontend | `03-frontend.md` | fullstack-dev | Foundation |
| Visualization | `04-visualization.md` | 3d-specialist | Foundation, Types |
| Integration | `05-integration.md` | code-reviewer | All tracks merged |

## Execution Workflow

### Phase 1: Foundation (Sequential)

```bash
# Single agent executes foundation track
gh repo set-default
gh issue create --title "Track: Foundation Setup" --body "Tasks 1-6"
# Execute track/01-foundation.md
# Creates PR to develop
```

### Phase 2: Parallel Development (3 agents concurrent)

```bash
# Launch 3 agents in parallel after foundation merges
Agent 1: track/02-backend.md    → branch: track/backend
Agent 2: track/03-frontend.md   → branch: track/frontend
Agent 3: track/04-visualization.md → branch: track/visualization
```

### Phase 3: Integration & Review

```bash
# After all PRs created, code-reviewer agent:
# 1. Reviews each PR
# 2. Runs integration tests
# 3. Merges to develop
# 4. Creates release PR to main
```

## GitHub CLI Patterns

All git operations use `gh` CLI:

### Branch Creation
```bash
gh repo sync  # Ensure up to date
git checkout -b track/feature-name develop
```

### Commits
```bash
git add -A
git commit -m "feat(scope): description

Details here.

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Pull Request Creation
```bash
gh pr create \
  --base develop \
  --title "feat: Track Name - Description" \
  --body "$(cat <<'EOF'
## Summary
- Bullet points of changes

## Tasks Completed
- [x] Task 1
- [x] Task 2

## Test Plan
- [ ] Verify X works
- [ ] Check Y renders

🤖 Generated with Claude Code
EOF
)"
```

### PR Review & Merge
```bash
# Check PR status
gh pr checks <pr-number>

# Review
gh pr review <pr-number> --approve --body "LGTM"

# Merge after checks pass
gh pr merge <pr-number> --squash --delete-branch
```

### Issue Tracking
```bash
# Create tracking issue
gh issue create --title "Track: Name" --label "track" --body "..."

# Link PR to issue
gh pr create --body "Closes #<issue-number>"

# Close when done
gh issue close <issue-number>
```

## Automated Review Gates

Each PR must pass before merge:

1. **TypeScript Check**: `pnpm tsc --noEmit`
2. **ESLint**: `pnpm lint`
3. **Build**: `pnpm build`
4. **Code Review**: code-reviewer agent analyzes diff

## Agent Dispatch Commands

### Start Foundation
```
Use fullstack-dev agent to execute docs/plans/tracks/01-foundation.md
```

### Start Parallel Tracks (after foundation merges)
```
Launch 3 agents in parallel:
1. fullstack-dev agent: docs/plans/tracks/02-backend.md
2. fullstack-dev agent: docs/plans/tracks/03-frontend.md
3. 3d-specialist agent: docs/plans/tracks/04-visualization.md
```

### Integration Review
```
Use code-reviewer agent to execute docs/plans/tracks/05-integration.md
```

## Success Criteria

- [ ] All 4 track PRs merged to develop
- [ ] `pnpm build` succeeds on develop
- [ ] Release PR merged to main
- [ ] Vercel deployment successful

---

## Quick Start

1. Read this file for context
2. Execute Foundation track first (blocking)
3. Dispatch parallel agents for tracks 2-4
4. Run integration track after all PRs ready
5. Merge release to main

**Track files are in `docs/plans/tracks/` - each is self-contained with ~2000 tokens.**
