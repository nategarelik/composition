import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'
import type { CompositionNode, Composition } from '@/types'

// ============================================
// Types
// ============================================

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

// ============================================
// Validation
// ============================================

const chatRequestSchema = z.object({
  message: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(2000, 'Message must be less than 2000 characters')
    .transform((m) => m.trim().replace(/[<>]/g, '')), // Sanitize dangerous chars
  composition: z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    description: z.string().optional(),
  }),
  selectedNode: z
    .object({
      id: z.string(),
      name: z.string(),
      type: z.enum(['product', 'component', 'material', 'chemical', 'element']),
      percentage: z.number().optional(),
      description: z.string().optional(),
    })
    .optional()
    .nullable(),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      })
    )
    .max(20)
    .default([]),
  compositionSummary: z.string().optional(),
})

// ============================================
// System Prompt
// ============================================

interface SelectedNodeContext {
  id: string
  name: string
  type: CompositionNode['type']
  percentage?: number
  description?: string
}

function buildSystemPrompt(
  composition: Pick<Composition, 'id' | 'name' | 'category' | 'description'>,
  selectedNode?: SelectedNodeContext | null,
  compositionSummary?: string
): string {
  let prompt = `You are an expert materials scientist and composition analyst assistant in the Composition Analysis Terminal. You help users understand what products, substances, and materials are made of.

Current Analysis Subject: ${composition.name}
Category: ${composition.category}
${composition.description ? `Description: ${composition.description}` : ''}

${compositionSummary ? `Composition Overview:\n${compositionSummary}\n` : ''}

Your role:
- Answer questions about the composition, its components, materials, chemicals, and elements
- Explain scientific concepts in accessible language
- Provide context about why certain materials are used
- Discuss safety, sustainability, and environmental aspects when relevant
- Reference specific nodes in the composition tree when helpful

When referencing a specific component, material, chemical, or element from the composition, format it like this: [[NodeName]] to make it clickable in the interface.

Guidelines:
- Be concise but informative (aim for 2-4 paragraphs max)
- Use scientific terminology but explain complex terms
- If you don't know something, say so rather than making it up
- Focus on the composition data available, don't invent details`

  if (selectedNode) {
    prompt += `

Currently Selected Node: ${selectedNode.name}
Type: ${selectedNode.type}
${selectedNode.percentage ? `Percentage: ${selectedNode.percentage}%` : ''}
${selectedNode.description ? `Description: ${selectedNode.description}` : ''}

The user may be asking about this specific ${selectedNode.type}. Focus your answers on this context when relevant.`
  }

  return prompt
}

// ============================================
// Create Anthropic Client
// ============================================

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

// ============================================
// API Route Handler
// ============================================

export async function POST(request: NextRequest): Promise<Response> {
  try {
    // Parse and validate request body
    const body = await request.json()
    const parseResult = chatRequestSchema.safeParse(body)

    if (!parseResult.success) {
      return new Response(
        JSON.stringify({
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: parseResult.error.issues[0]?.message ?? 'Invalid request',
          },
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const { message, composition, selectedNode, history, compositionSummary } =
      parseResult.data

    // Build system prompt with context
    const systemPrompt = buildSystemPrompt(
      composition,
      selectedNode,
      compositionSummary
    )

    // Build messages array for Claude
    const messages: ChatMessage[] = [
      ...history.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user', content: message },
    ]

    // Create Anthropic client
    const anthropic = createAnthropicClient()

    // Create streaming response
    const stream = await anthropic.messages.stream({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    })

    // Create a ReadableStream from the Anthropic stream
    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              const chunk = event.delta.text
              // Send as SSE format
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`)
              )
            }
          }

          // Send done signal
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          console.error('Stream error:', error)
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: 'Stream error occurred' })}\n\n`
            )
          )
          controller.close()
        }
      },
    })

    // Return streaming response
    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)

    // Handle specific Anthropic errors
    if (error instanceof Anthropic.APIError) {
      const statusMessages: Record<number, string> = {
        401: 'Invalid API key',
        429: 'Rate limit exceeded. Please try again later.',
        500: 'Anthropic API server error',
      }

      return new Response(
        JSON.stringify({
          success: false,
          error: {
            code: 'API_ERROR',
            message:
              statusMessages[error.status] ?? `API error: ${error.message}`,
          },
        }),
        {
          status: error.status >= 500 ? 502 : error.status,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message:
            error instanceof Error ? error.message : 'An error occurred',
        },
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
