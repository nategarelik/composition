# Claude Code Configuration for Composition

Project-specific Claude Code configuration optimized for the Composition app development.

## Directory Structure

```
.claude/
├── settings.json         # Permissions, env vars, hooks
├── plans/
│   └── transformation-plan.md  # UI transformation roadmap
├── skills/
│   ├── terminal-ui/      # CERN Detector design system
│   ├── 3d-visualization/ # Three.js/R3F patterns
│   ├── ai-research/      # Composition research methodology
│   └── composition-data/ # Data modeling patterns
├── commands/             # Slash commands
│   ├── verify.md         # /verify - Full verification suite
│   ├── fix.md            # /fix - Auto-fix lint/format
│   ├── status.md         # /status - Project health
│   ├── research.md       # /research - Composition research
│   ├── build-component.md # /build-component - Create UI
│   ├── design-review.md  # /design-review - Check design
│   ├── deploy.md         # /deploy - Deploy to Vercel
│   ├── test.md           # /test - Run tests
│   └── phase.md          # /phase - Execute plan phase
└── archive/              # Archived session logs
```

## Skills (Auto-Invoked)

Claude uses these automatically based on context:

| Skill | When Used |
|-------|-----------|
| `terminal-ui` | Building UI, styling components |
| `3d-visualization` | Three.js/R3F, 3D performance |
| `ai-research` | Researching composition data |
| `composition-data` | Data models, API formats |

## Slash Commands

| Command | Description |
|---------|-------------|
| `/verify` | Run type-check + lint + build |
| `/fix` | Auto-fix lint and formatting |
| `/status` | Show git, deps, build health |
| `/research [query]` | Research what something is made of |
| `/build-component [path]` | Create component from design system |
| `/design-review` | Check UI against CERN aesthetic |
| `/deploy` | Deploy to Vercel with checks |
| `/test` | Run test suite |
| `/phase [1-6]` | Execute transformation phase |

## Current Design: CERN Particle Detector

The UI uses a unique aesthetic inspired by CERN control rooms and particle physics instrumentation. See `.claude/skills/terminal-ui/SKILL.md` for the complete design system.

**Key principles:**
- Circular/radial elements (not rectangular cards)
- Wire chamber aesthetic (fine grids, track lines)
- Particle color language (gold=verified, cyan=active, etc.)
- Scientific typography (DM Sans + Space Mono)

## Transformation Plan

See `.claude/plans/transformation-plan.md` for the complete roadmap:

| Phase | Status |
|-------|--------|
| 1. Design System & Home | ✅ Complete |
| 2. Viewer Page | Next |
| 3. Tree Styling | Pending |
| 4. 3D Enhancement | Pending |
| 5. Chat Integration | Pending |
| 6. Polish & Performance | Pending |

## Permissions

### Allowed
- npm, pnpm, npx, node
- Git (except force push)
- Vercel, Prisma CLI
- TypeScript, ESLint, Prettier
- All file operations
- Web search/fetch

### Denied
- Reading .env, secrets, keys
- rm -rf, git push --force, git reset --hard

## Best Practices

1. Run `/verify` before committing
2. Use "ultrathink" for complex decisions
3. Use `/clear` every 8-12 tasks
4. Commit frequently
5. Check `/status` at session start
