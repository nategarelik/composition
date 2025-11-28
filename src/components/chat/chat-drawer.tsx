'use client'

/**
 * Chat Drawer Component - Bottom drawer using Vaul
 * Contains chat interface for composition Q&A
 */

import { useCallback, useEffect, useMemo } from 'react'
import { Drawer } from 'vaul'
import { cn } from '@/lib/utils'
import { useChatStore, useCompositionStore } from '@/stores'
import { ChatMessages } from './chat-messages'
import { ChatInput } from './chat-input'
import { ChatSuggestions } from './chat-suggestions'
import type { Composition, CompositionNode } from '@/types'

interface ChatDrawerProps {
  composition: Composition | null
  className?: string
}

// Helper to generate a summary of the composition tree
function generateCompositionSummary(node: CompositionNode, depth = 0, maxDepth = 2): string {
  if (depth > maxDepth) return ''

  const indent = '  '.repeat(depth)
  let summary = `${indent}- ${node.name} (${node.type}, ${node.percentage}%)\n`

  if (node.children && depth < maxDepth) {
    for (const child of node.children) {
      summary += generateCompositionSummary(child, depth + 1, maxDepth)
    }
  }

  return summary
}

export function ChatDrawer({ composition, className }: ChatDrawerProps) {
  const {
    conversation,
    isOpen,
    isLoading,
    suggestions,
    openChat,
    closeChat,
    initConversation,
    addMessage,
    appendToLastMessage,
    setLastMessageComplete,
    setLoading,
    setError,
    generateSuggestions,
  } = useChatStore()

  const { selectedNode, selectNode, expandToNode, setFocusedNode } = useCompositionStore()

  // Initialize conversation when composition changes
  useEffect(() => {
    if (composition) {
      initConversation(composition)
    }
  }, [composition, initConversation])

  // Regenerate suggestions when selected node changes
  useEffect(() => {
    if (composition) {
      generateSuggestions(composition, selectedNode)
    }
  }, [composition, selectedNode, generateSuggestions])

  // Generate composition summary for context
  const compositionSummary = useMemo(() => {
    if (!composition) return ''
    return generateCompositionSummary(composition.root)
  }, [composition])

  // Handle sending a message
  const handleSendMessage = useCallback(
    async (message: string) => {
      if (!composition || !conversation) return

      // Add user message
      addMessage({ role: 'user', content: message })

      // Add empty assistant message for streaming
      addMessage({ role: 'assistant', content: '', isStreaming: true })

      setLoading(true)
      setError(null)

      try {
        // Build history from conversation
        const history = conversation.messages.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }))

        // Call chat API
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message,
            composition: {
              id: composition.id,
              name: composition.name,
              category: composition.category,
              description: composition.description,
            },
            selectedNode: selectedNode
              ? {
                  id: selectedNode.id,
                  name: selectedNode.name,
                  type: selectedNode.type,
                  percentage: selectedNode.percentage,
                  description: selectedNode.description,
                }
              : null,
            history,
            compositionSummary,
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error?.message ?? 'Failed to send message')
        }

        // Read streaming response
        const reader = response.body?.getReader()
        if (!reader) {
          throw new Error('No response body')
        }

        const decoder = new TextDecoder()

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n').filter((line) => line.trim())

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') {
                setLastMessageComplete()
                break
              }

              try {
                const parsed = JSON.parse(data)
                if (parsed.text) {
                  appendToLastMessage(parsed.text)
                } else if (parsed.error) {
                  throw new Error(parsed.error)
                }
              } catch {
                // Ignore parse errors for incomplete chunks
              }
            }
          }
        }
      } catch (error) {
        console.error('Chat error:', error)
        setError(
          error instanceof Error ? error.message : 'Failed to send message'
        )
        // Update last message with error
        setLastMessageComplete()
      } finally {
        setLoading(false)
      }
    },
    [
      composition,
      conversation,
      selectedNode,
      compositionSummary,
      addMessage,
      appendToLastMessage,
      setLastMessageComplete,
      setLoading,
      setError,
    ]
  )

  // Handle clicking a node reference in chat
  const handleNodeClick = useCallback(
    (nodeName: string) => {
      if (!composition) return

      // Find node by name in tree
      const findNode = (
        node: CompositionNode,
        name: string
      ): CompositionNode | null => {
        if (node.name.toLowerCase() === name.toLowerCase()) return node
        if (node.children) {
          for (const child of node.children) {
            const found = findNode(child, name)
            if (found) return found
          }
        }
        return null
      }

      const node = findNode(composition.root, nodeName)
      if (node) {
        selectNode(node)
        expandToNode(node.id)
        setFocusedNode(node.id)
      }
    },
    [composition, selectNode, expandToNode, setFocusedNode]
  )

  // Handle selecting a suggested question
  const handleSuggestionSelect = useCallback(
    (question: string) => {
      handleSendMessage(question)
    },
    [handleSendMessage]
  )

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(open) => (open ? openChat() : closeChat())}
      snapPoints={[0.4, 0.75, 1]}
      activeSnapPoint={0.4}
      modal={false}
    >
      {/* Trigger Button */}
      <Drawer.Trigger asChild>
        <button
          className={cn(
            'fixed bottom-4 right-4 z-40',
            'flex items-center gap-2 px-4 py-2.5 rounded-lg',
            'bg-[var(--accent-primary)] text-white',
            'shadow-lg hover:shadow-xl',
            'hover:bg-[var(--accent-primary)]/90',
            'focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)]',
            'transition-all duration-200',
            isOpen && 'opacity-0 pointer-events-none',
            className
          )}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <span className="font-medium text-sm">Chat</span>
          {conversation && conversation.messages.length > 0 && (
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          )}
        </button>
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Drawer.Content
          className={cn(
            'fixed bottom-0 left-0 right-0 z-50',
            'bg-[var(--bg-secondary)] border-t border-[var(--border-subtle)]',
            'rounded-t-xl shadow-2xl',
            'flex flex-col',
            'max-h-[96vh] h-[75vh]'
          )}
        >
          {/* Drawer handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 bg-[var(--border-default)] rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-4 pb-3 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-[var(--accent-primary)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <div>
                <Drawer.Title className="text-sm font-medium text-[var(--text-primary)]">
                  Analysis Chat
                </Drawer.Title>
                <Drawer.Description className="text-xs text-[var(--text-tertiary)]">
                  {composition
                    ? `Discussing: ${composition.name}`
                    : 'No composition loaded'}
                </Drawer.Description>
              </div>
            </div>

            <button
              onClick={closeChat}
              className="p-2 rounded-md text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <ChatMessages
            messages={conversation?.messages ?? []}
            isLoading={isLoading}
            onNodeClick={handleNodeClick}
            className="flex-1"
          />

          {/* Suggestions */}
          {conversation?.messages.length === 0 && (
            <ChatSuggestions
              suggestions={suggestions}
              onSelect={handleSuggestionSelect}
              className="border-t border-[var(--border-subtle)]"
            />
          )}

          {/* Input */}
          <ChatInput
            onSubmit={handleSendMessage}
            disabled={isLoading || !composition}
            placeholder={
              selectedNode
                ? `Ask about ${selectedNode.name}...`
                : 'Ask about this composition...'
            }
          />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
