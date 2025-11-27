import Anthropic from '@anthropic-ai/sdk'
import { nanoid } from 'nanoid'
import type { CompositionNode, Source, ConfidenceLevel, ResearchResult, ResearchProgress } from '@/types'

// Validate API key at module load time
function createAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error(
      'ANTHROPIC_API_KEY environment variable is required. ' +
        'Please set it in your .env.local file or deployment environment.'
    )
  }
  return new Anthropic({ apiKey })
}

// Create client - will throw early if API key is missing
const anthropic = createAnthropicClient()

const SYSTEM_PROMPT = `You are an expert research agent specializing in discovering what things are made of. Your task is to break down any product, substance, or entity into its constituent parts in a hierarchical structure.

Return ONLY valid JSON matching this schema:
{
  "name": "Display name of the item",
  "category": "Category (food, electronics, chemical, biological, etc.)",
  "description": "Brief description of the item",
  "confidence": "verified" | "estimated" | "speculative",
  "sources": [
    {
      "type": "official" | "scientific" | "database" | "calculated" | "estimated",
      "name": "Source name",
      "url": "Optional URL",
      "confidence": "verified" | "estimated" | "speculative",
      "notes": "Optional notes"
    }
  ],
  "root": {
    "name": "Item name",
    "type": "product",
    "percentage": 100,
    "confidence": "verified" | "estimated" | "speculative",
    "description": "Description",
    "children": [
      {
        "name": "Component name",
        "type": "component" | "material" | "chemical" | "element",
        "percentage": number (0-100),
        "confidence": "verified" | "estimated" | "speculative",
        "symbol": "Element symbol if applicable",
        "atomicNumber": number if element,
        "casNumber": "CAS number if chemical",
        "children": [...]
      }
    ]
  }
}

Types hierarchy:
- product: The main item being analyzed
- component: Major parts or ingredients
- material: Raw materials and substances
- chemical: Chemical compounds
- element: Periodic table elements

Confidence levels:
- verified: From official sources, ingredient labels, scientific papers
- estimated: Calculated from known similar products
- speculative: Best-guess when data is limited

Important:
- All percentages at each level should sum to approximately 100%
- Include element-level breakdown for chemicals when possible
- Use real scientific data when available
- If information is uncertain, mark as "estimated" or "speculative"
- Include proper element symbols and atomic numbers for elements`

function addNodeIds(node: CompositionNode): CompositionNode {
  return {
    ...node,
    id: nanoid(),
    children: node.children?.map(addNodeIds),
  }
}

interface RawResearchResult {
  name: string
  category: string
  description?: string
  confidence: ConfidenceLevel
  sources: Array<{
    type: 'official' | 'scientific' | 'database' | 'calculated' | 'estimated'
    name: string
    url?: string
    confidence: ConfidenceLevel
    notes?: string
  }>
  root: CompositionNode
}

function parseResponse(message: Anthropic.Message): RawResearchResult {
  const textContent = message.content.find((c) => c.type === 'text')
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text content in response')
  }

  // Extract JSON from response (may have markdown code blocks)
  let jsonStr = textContent.text
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (jsonMatch?.[1]) {
    jsonStr = jsonMatch[1]
  }

  try {
    return JSON.parse(jsonStr.trim()) as RawResearchResult
  } catch {
    throw new Error('Failed to parse JSON response')
  }
}

export async function researchComposition(
  query: string,
  onProgress?: (progress: ResearchProgress) => void
): Promise<ResearchResult> {
  onProgress?.({
    stage: 'identifying',
    percentage: 10,
    message: `Identifying "${query}"...`,
  })

  onProgress?.({
    stage: 'researching',
    percentage: 30,
    message: 'Researching composition data...',
  })

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Research the complete composition of: ${query}

Break it down from the product level to component level to materials to chemicals to elements where applicable. Be thorough and include all major components with their approximate percentages.`,
      },
    ],
  })

  onProgress?.({
    stage: 'analyzing',
    percentage: 60,
    message: 'Analyzing research results...',
  })

  const result = parseResponse(message)

  onProgress?.({
    stage: 'synthesizing',
    percentage: 80,
    message: 'Building composition tree...',
  })

  // Add unique IDs to all nodes
  result.root = addNodeIds(result.root)

  // Transform sources to include accessedAt and id
  const sources: Source[] = result.sources.map((s) => ({
    id: nanoid(),
    type: s.type,
    name: s.name,
    url: s.url,
    accessedAt: new Date().toISOString(),
    confidence: s.confidence,
    notes: s.notes,
  }))

  onProgress?.({
    stage: 'complete',
    percentage: 100,
    message: 'Research complete!',
  })

  return {
    name: result.name,
    category: result.category,
    description: result.description,
    root: result.root,
    sources,
    confidence: result.confidence,
  }
}

export { SYSTEM_PROMPT }
