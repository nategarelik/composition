---
description: Research what something is made of and return structured composition data
---

# Research Composition

Research the composition of the item specified in the arguments. Use the ai-researcher subagent to perform thorough multi-source research.

## Process

1. **Identify** the exact product/substance from the query
2. **Research** using multiple authoritative sources
3. **Structure** the data hierarchically (product → components → materials → chemicals → elements)
4. **Cite** all sources with confidence levels
5. **Return** structured JSON ready for the Composition app

## Output Format

Return results as JSON matching our CompositionNode schema with full source attribution.

## Arguments

The user's query describing what they want researched (e.g., "iPhone 15 Pro", "Coca-Cola", "human blood").
