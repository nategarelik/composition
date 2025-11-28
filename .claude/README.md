# Claude Code Configuration for Composition

This folder contains the comprehensive Claude Code configuration for the Composition project, providing specialized agents, skills, commands, and hooks optimized for this project's development workflow.

## Directory Structure

```
.claude/
├── settings.json         # Project permissions, env vars, hooks
├── settings.local.json   # Local settings (MCP servers, extended thinking)
├── agents/               # Specialized subagents
│   ├── ai-researcher.md  # Composition research expert (opus)
│   ├── 3d-specialist.md  # Three.js/R3F expert (sonnet)
│   ├── fullstack-dev.md  # Next.js development expert (sonnet)
│   ├── code-reviewer.md  # Code quality reviewer (sonnet)
│   └── ui-designer.md    # Clinical Lab Terminal UI expert (sonnet)
├── skills/               # Domain knowledge (model-invoked)
│   ├── ai-research/      # How to research compositions
│   ├── 3d-visualization/ # Three.js patterns
│   ├── composition-data/ # Data modeling patterns
│   └── terminal-ui/      # Clinical Lab Terminal design system
├── commands/             # Custom slash commands (user-invoked)
│   ├── research.md       # /research - Research compositions
│   ├── verify.md         # /verify - Run verification suite
│   ├── phase.md          # /phase - Execute transformation phases
│   ├── build-component.md # /build-component - Create UI components
│   ├── design-review.md  # /design-review - Check design compliance
│   ├── status.md         # /status - Project health check
│   ├── fix.md            # /fix - Auto-fix lint/format issues
│   ├── test.md           # /test - Run test suite
│   └── deploy.md         # /deploy - Deploy to Vercel
├── plans/                # Implementation plans
│   └── transformation-plan.md
└── README.md             # This file
```

## Subagents

Specialized AI assistants that can be delegated to for specific tasks:

| Agent | Purpose | Model | When to Use |
|-------|---------|-------|-------------|
| `ai-researcher` | Research product compositions using AI and web sources | Opus | Composition research, finding ingredients/materials |
| `3d-specialist` | Build 3D visualizations with Three.js/R3F | Sonnet | 3D components, rendering, performance |
| `fullstack-dev` | Implement Next.js features, APIs, database | Sonnet | Feature implementation, API routes |
| `code-reviewer` | Review code for quality, security, performance | Sonnet | After significant code changes |
| `ui-designer` | Design Clinical Lab Terminal aesthetic | Sonnet | UI components, styling, layout |

### Using Agents

Agents are invoked automatically based on task context, or explicitly:

```
> Use the ai-researcher agent to find what Frosted Flakes are made of
> Have the 3d-specialist help me implement the exploded view
> Ask the code-reviewer to check my recent changes
```

## Skills

Skills are model-invoked capabilities that Claude uses automatically based on context:

| Skill | Description |
|-------|-------------|
| `ai-research` | Research methodology and output formats for composition data |
| `3d-visualization` | Three.js/R3F patterns, performance tips, interaction patterns |
| `composition-data` | TypeScript types, Prisma schema, API formats, caching |
| `terminal-ui` | Clinical Lab Terminal design system (colors, typography, components) |

## Slash Commands

User-invoked commands for common workflows:

| Command | Description |
|---------|-------------|
| `/research [query]` | Research what something is made of |
| `/verify` | Run full verification suite (type-check, lint, build) |
| `/phase [1-5]` | Execute a transformation phase |
| `/build-component [path] [type]` | Create a new component following design system |
| `/design-review` | Review UI against Clinical Lab Terminal design |
| `/status` | Show project health (git, deps, build) |
| `/fix` | Auto-fix lint and formatting issues |
| `/test` | Run test suite and analyze results |
| `/deploy` | Deploy to Vercel with checks |

## Hooks

Automated actions that run at specific events:

| Hook | Trigger | Action |
|------|---------|--------|
| PreToolUse (Write/Edit) | Before modifying files | Block edits to .env and secret files |
| PostToolUse (Write/Edit) | After modifying files | Auto-format with Prettier |
| SessionStart | New session | Show project info (branch, last commit, versions) |
| Notification | Idle/permission prompts | Log to session.log |

## Permissions

### Allowed
- Package managers: npm, pnpm, npx, node
- Git operations (except force push/hard reset)
- Vercel CLI
- Prisma CLI
- TypeScript, ESLint, Prettier
- All file read/write/edit operations
- Web search and fetch

### Denied (Security)
- Reading .env files or secrets
- Reading private keys (*.pem, *.key)
- Destructive operations (rm -rf, git push --force, git reset --hard)

## MCP Servers

Configured in `settings.local.json`:

- **Vercel** - Deployment management
- **GitHub** - Code reviews and PRs
- **Sentry** - Error monitoring

Authenticate with `/mcp` command.

## Environment Variables

Project-specific environment variables set in settings:

| Variable | Value | Purpose |
|----------|-------|---------|
| `COMPOSITION_PROJECT` | true | Project identifier |
| `NODE_ENV` | development | Runtime environment |
| `NEXT_TELEMETRY_DISABLED` | 1 | Disable Next.js telemetry |
| `MAX_THINKING_TOKENS` | 32000 | Extended thinking budget |
| `CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR` | true | Stay in project directory |

## Best Practices

### Session Management
- Use `/clear` every 8-12 tasks to manage context
- Use "ultrathink" or "think harder" for complex decisions
- Commit frequently to checkpoint progress

### Agent Usage
- Prefer `sonnet` subagents for faster iteration
- Reserve `opus` (ai-researcher) for complex research tasks
- Run `code-reviewer` after significant changes

### Workflow
1. Start with `/status` to understand current state
2. Make changes with appropriate agent assistance
3. Run `/verify` before committing
4. Use `/fix` to auto-repair lint/format issues
5. Commit with descriptive messages

## Updating Configuration

To modify agents, skills, or commands:
1. Edit the corresponding markdown files
2. Changes take effect on next Claude Code session
3. For hooks/permissions, changes apply after reviewing in `/hooks`

## Superpowers Integration

This project uses the superpowers plugin for enhanced workflows:

- `/superpowers:brainstorm` - Interactive design refinement
- `/superpowers:execute-plan` - Execute plans with checkpoints
- `/superpowers:write-plan` - Create detailed implementation plans
- `superpowers:test-driven-development` - TDD workflow skill
- `superpowers:verification-before-completion` - Final checks skill
