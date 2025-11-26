# Claude Code Configuration for Composition

This folder contains the Claude Code configuration for the Composition project, providing specialized agents, skills, and settings optimized for this project.

## Structure

```
.claude/
├── settings.json         # Project permissions and environment
├── agents/               # Specialized subagents
│   ├── ai-researcher.md  # Composition research expert
│   ├── 3d-specialist.md  # Three.js/R3F expert
│   ├── fullstack-dev.md  # Next.js development expert
│   └── code-reviewer.md  # Code quality reviewer
├── skills/               # Domain knowledge
│   ├── ai-research/      # How to research compositions
│   ├── 3d-visualization/ # Three.js patterns
│   └── composition-data/ # Data modeling patterns
├── commands/             # Custom slash commands
│   └── research.md       # /research command
└── README.md             # This file
```

## Subagents

| Agent | Purpose | Model |
|-------|---------|-------|
| `ai-researcher` | Research product compositions using AI and web sources | Opus |
| `3d-specialist` | Build 3D visualizations with Three.js/R3F | Sonnet |
| `fullstack-dev` | Implement Next.js features, APIs, database | Sonnet |
| `code-reviewer` | Review code for quality, security, performance | Sonnet |

### Using Agents

Agents are invoked automatically based on task context, or explicitly:

```
> Use the ai-researcher agent to find what Frosted Flakes are made of
> Have the 3d-specialist help me implement the exploded view
> Ask the code-reviewer to check my recent changes
```

## Skills

Skills provide domain knowledge that Claude uses automatically:

- **Composition AI Research**: Research methodology and output formats
- **3D Composition Visualization**: Three.js patterns and performance tips
- **Composition Data Modeling**: TypeScript types, Prisma schema, API formats

## Commands

- `/research [query]` - Research what something is made of

## MCP Servers

The project is configured to use these MCP servers (in `.mcp.json`):

- **Vercel** - Deployment management
- **GitHub** - Code reviews and PRs
- **Sentry** - Error monitoring

Authenticate with `/mcp` command in Claude Code.

## Environment

The settings.json grants permissions for:
- npm/pnpm/node commands
- git operations
- Vercel CLI
- Prisma CLI
- TypeScript/ESLint/Prettier

And denies access to:
- .env files (security)
- secrets directories
- private keys

## Getting Started

1. Open the Composition project in Claude Code
2. Run `/mcp` to authenticate with MCP servers
3. Ask Claude to help with any task - agents and skills activate automatically

## Updating

To modify agents or skills, edit the corresponding markdown files. Changes take effect on next Claude Code session.
