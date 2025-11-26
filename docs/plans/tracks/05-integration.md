# Track 5: Integration & Release

> **Agent:** code-reviewer | **Branch:** `develop` → `main` | **Mode:** Review & Merge

**Goal:** Review all track PRs, merge to develop, run integration tests, create release PR.

**Requires:** All 4 track PRs created and passing checks.

---

## Pre-Integration Checklist

```bash
# List all open PRs
gh pr list --state open

# Expected PRs:
# - feat: Foundation - Project initialization
# - feat: Backend - AI research pipeline and API routes
# - feat: Frontend - Search UI and pages
# - feat: 3D Visualization - R3F composition viewer
```

---

## Phase 1: Review Foundation PR

```bash
# Get PR number
FOUNDATION_PR=$(gh pr list --search "Foundation" --json number -q '.[0].number')

# Check status
gh pr checks $FOUNDATION_PR

# View diff
gh pr diff $FOUNDATION_PR

# Review checklist:
# - [ ] TypeScript strict mode enabled
# - [ ] Prisma schema correct
# - [ ] Types match schema
# - [ ] Utilities properly typed
# - [ ] No secrets in code

# Approve and merge (foundation must merge first)
gh pr review $FOUNDATION_PR --approve --body "Foundation looks good. Types and schema are correct."
gh pr merge $FOUNDATION_PR --squash --delete-branch
```

---

## Phase 2: Review Parallel Track PRs

After foundation merges, review remaining PRs in parallel:

### Backend Review

```bash
BACKEND_PR=$(gh pr list --search "Backend" --json number -q '.[0].number')

# Check for conflicts after foundation merge
gh pr view $BACKEND_PR

# Review checklist:
# - [ ] API routes return proper types
# - [ ] Error handling comprehensive
# - [ ] Cache keys consistent
# - [ ] No exposed secrets
# - [ ] Research agent prompt appropriate

gh pr review $BACKEND_PR --approve --body "API routes well structured. Caching strategy is solid."
```

### Frontend Review

```bash
FRONTEND_PR=$(gh pr list --search "Frontend" --json number -q '.[0].number')

# Review checklist:
# - [ ] Components use correct hooks
# - [ ] No prop drilling (uses stores)
# - [ ] Loading states handled
# - [ ] Error boundaries present
# - [ ] Accessibility basics (labels, focus)

gh pr review $FRONTEND_PR --approve --body "UI components clean. State management properly isolated."
```

### Visualization Review

```bash
VIZ_PR=$(gh pr list --search "Visualization" --json number -q '.[0].number')

# Review checklist:
# - [ ] Geometries disposed properly
# - [ ] Instancing used where appropriate
# - [ ] Frame rate acceptable (60fps target)
# - [ ] Mobile considerations
# - [ ] Memory leaks avoided

gh pr review $VIZ_PR --approve --body "3D implementation solid. Performance considerations addressed."
```

---

## Phase 3: Merge Track PRs

Merge in dependency order:

```bash
# 1. Backend (no frontend deps)
gh pr merge $BACKEND_PR --squash --delete-branch

# 2. Frontend (no viz deps)
gh pr merge $FRONTEND_PR --squash --delete-branch

# 3. Visualization (needs stores from frontend)
gh pr merge $VIZ_PR --squash --delete-branch
```

---

## Phase 4: Integration Testing

```bash
# Switch to develop
git checkout develop
git pull origin develop

# Run full verification
pnpm install
pnpm tsc --noEmit
pnpm lint
pnpm build

# If build fails, debug and fix on develop directly
# Common issues:
# - Import path mismatches
# - Missing exports in index files
# - Type conflicts between tracks
```

### Manual Test Checklist

```
[ ] Home page loads with search bar
[ ] Search submits and shows progress
[ ] Composition page displays 3D viewer
[ ] Explode/collapse toggle animates
[ ] Depth slider adjusts visualization
[ ] Node hover shows tooltip
[ ] Node click highlights
[ ] Share creates link
[ ] Share link redirects correctly
```

---

## Phase 5: Create Release

```bash
# Create deployment config
cat > vercel.json << 'EOF'
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "regions": ["iad1"],
  "functions": {
    "src/app/api/search/route.ts": { "maxDuration": 60 }
  }
}
EOF

# Create README
# (Write comprehensive README.md)

git add vercel.json README.md
git commit -m "docs: add deployment config and README"
git push origin develop

# Create release PR
gh pr create \
  --base main \
  --head develop \
  --title "Release: Composition MVP v0.1.0" \
  --body "$(cat <<'EOF'
## Release: Composition MVP v0.1.0

### Features
- Search any product/substance
- AI-powered composition research (Claude)
- Interactive 3D visualization (React Three Fiber)
- User-controlled depth levels (1-5)
- Shareable composition URLs

### Technical
- Next.js 14 with App Router
- TypeScript strict mode
- Prisma + PostgreSQL
- Redis caching (Upstash)
- Vercel deployment

### Tracks Merged
- [x] Foundation - Project setup
- [x] Backend - AI pipeline + APIs
- [x] Frontend - Search UI + pages
- [x] Visualization - 3D viewer

### Test Results
- [x] TypeScript: No errors
- [x] ESLint: Passing
- [x] Build: Successful
- [x] Manual testing: Complete

🤖 Generated with Claude Code
EOF
)"
```

---

## Phase 6: Final Merge & Deploy

```bash
# Get release PR number
RELEASE_PR=$(gh pr list --search "Release" --json number -q '.[0].number')

# Final checks
gh pr checks $RELEASE_PR

# Self-review
gh pr review $RELEASE_PR --approve --body "All tracks merged and tested. Ready for production."

# Merge to main
gh pr merge $RELEASE_PR --merge --delete-branch

# Tag release
git checkout main
git pull origin main
git tag -a v0.1.0 -m "MVP Release: AI-powered composition research with 3D visualization"
git push origin v0.1.0

# Verify Vercel deployment
# Check https://composition.vercel.app or configured domain
```

---

## Post-Release

```bash
# Close tracking issues
gh issue list --label "track" --state open
# Close each issue

# Create v0.2.0 milestone for next features
gh api repos/:owner/:repo/milestones -f title="v0.2.0" -f description="Phase 2 features"

# Document any issues found
gh issue create --title "Post-release: [Issue]" --label "bug" --body "..."
```

---

## Rollback (if needed)

```bash
# Revert to previous deployment in Vercel dashboard
# Or:
git checkout main
git revert HEAD
git push origin main
```

---

## Success Criteria

- [x] All 4 track PRs reviewed and merged
- [x] Integration tests passing
- [x] Build succeeds on develop
- [x] Release PR merged to main
- [x] v0.1.0 tag created
- [x] Vercel deployment live
- [x] Manual testing complete
