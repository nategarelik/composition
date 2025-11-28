---
description: Execute a phase from the transformation plan with detailed progress tracking
allowed-tools: Read, Write, Edit, Grep, Glob, Bash(pnpm:*), Bash(npx:*), Bash(git:*)
argument-hint: [phase-number] (1-5)
---

# Execute Transformation Phase

Execute a phase from the Clinical Lab Terminal transformation plan.

## Current Plan Location
The full plan is at: `.claude/plans/transformation-plan.md`

## Phase Reference

- **Phase 1**: UI Foundation & Design System (design tokens, layout shell, home page)
- **Phase 2**: Tree Navigation (hierarchy panel, tree-3D sync, selection behavior)
- **Phase 3**: Enhanced 3D Visualization (molecular viz, procedural shapes, animations)
- **Phase 4**: Conversational Chat (chat UI, streaming API, context management)
- **Phase 5**: Polish & Performance (animations, mobile, optimization)

## Current State
!`git log --oneline -5`
!`git status --short`

## Instructions

Execute Phase `$1`:

1. Read the full plan from the plan file
2. Create a TodoWrite checklist for all tasks in this phase
3. Execute tasks sequentially, marking progress
4. Run `/verify` after each major component
5. Commit after each logical chunk with descriptive messages
6. Report final status and any blockers

Remember:
- Use `/clear` every 8-12 tasks to manage context
- Use "think harder" for complex architectural decisions
- Use parallel agents for independent tasks when appropriate
