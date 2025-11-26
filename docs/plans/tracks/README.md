# Composition MVP - Parallel Execution Tracks

This directory contains self-contained task files for parallel development.

## Track Overview

| # | Track | File | Agent | Tokens | Dependencies |
|---|-------|------|-------|--------|--------------|
| 0 | GitHub Setup | `00-github-setup.md` | fullstack-dev | ~800 | None |
| 1 | Foundation | `01-foundation.md` | fullstack-dev | ~1200 | Track 0 |
| 2 | Backend | `02-backend.md` | fullstack-dev | ~1400 | Track 1 |
| 3 | Frontend | `03-frontend.md` | fullstack-dev | ~1500 | Track 1 |
| 4 | Visualization | `04-visualization.md` | 3d-specialist | ~1800 | Track 1 |
| 5 | Integration | `05-integration.md` | code-reviewer | ~1200 | Tracks 2-4 |

## Execution Order

```
Track 0 (GitHub Setup)
    ↓
Track 1 (Foundation) ← BLOCKING
    ↓
┌───────────────────────────────────────┐
│  Track 2    Track 3    Track 4       │  ← PARALLEL
│  Backend    Frontend   Visualization │
└───────────────────────────────────────┘
    ↓           ↓           ↓
         Track 5 (Integration)
              ↓
           Release
```

## How to Use

### Option 1: Sequential (Single Agent)

```
1. Read 00-github-setup.md, execute all steps
2. Read 01-foundation.md, execute all steps
3. Read 02-backend.md, execute all steps
4. Read 03-frontend.md, execute all steps
5. Read 04-visualization.md, execute all steps
6. Read 05-integration.md, execute all steps
```

### Option 2: Parallel (Multiple Agents)

```
1. Agent 0: Execute 00-github-setup.md
2. Agent 1: Execute 01-foundation.md (wait for Agent 0)
3. Launch 3 agents in parallel (after Track 1 merges):
   - Agent 2: Execute 02-backend.md
   - Agent 3: Execute 03-frontend.md
   - Agent 4: Execute 04-visualization.md
4. Agent 5: Execute 05-integration.md (after PRs ready)
```

## Track File Structure

Each track file contains:

1. **Header** - Agent type, branch name, base branch
2. **Setup** - Branch creation, issue creation
3. **Tasks** - Numbered steps with code and commands
4. **Finalize** - Push, create PR
5. **Handoff** - What happens next

## Git Workflow

All tracks use GitHub CLI (`gh`) for operations:

- `gh repo create` - Initialize repository
- `gh issue create` - Track work
- `gh pr create` - Submit changes
- `gh pr review` - Approve changes
- `gh pr merge` - Integrate changes

## Branch Naming

```
main           ← Production releases
develop        ← Integration branch
track/foundation   ← Track 1 feature branch
track/backend      ← Track 2 feature branch
track/frontend     ← Track 3 feature branch
track/visualization ← Track 4 feature branch
```

## PR Flow

```
track/feature → develop (via squash merge)
develop → main (via merge commit, tagged)
```

## Quick Reference

### Start a track
```bash
git checkout develop && git pull
git checkout -b track/name develop
gh issue create --title "Track: Name" --label "track"
```

### Finish a track
```bash
pnpm tsc --noEmit && pnpm lint
git push -u origin track/name
gh pr create --base develop --title "feat: Track Name"
```

### Review and merge
```bash
gh pr checks <number>
gh pr review <number> --approve
gh pr merge <number> --squash --delete-branch
```
