"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CompositionNode, Composition } from "@/types";

// ============================================
// Chat Types
// ============================================

export type MessageRole = "user" | "assistant" | "system";

export interface NodeReference {
  nodeId: string;
  nodeName: string;
  nodeType: CompositionNode["type"];
  percentage?: number;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  nodeReferences?: NodeReference[];
  isStreaming?: boolean;
}

export interface Conversation {
  id: string;
  compositionId: string;
  compositionName: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface SuggestedQuestion {
  id: string;
  question: string;
  nodeId?: string;
}

// ============================================
// Chat Store State
// ============================================

interface ChatState {
  // Current conversation
  conversation: Conversation | null;
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;

  // Conversation history (persisted)
  conversations: Record<string, Conversation>;

  // Suggested questions
  suggestions: SuggestedQuestion[];

  // Actions
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;

  // Conversation management
  initConversation: (composition: Composition) => void;
  loadConversation: (compositionId: string) => void;
  clearConversation: () => void;
  deleteConversation: (compositionId: string) => void;

  // Message management
  addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
  updateLastMessage: (content: string, isStreaming?: boolean) => void;
  appendToLastMessage: (chunk: string) => void;
  setLastMessageComplete: () => void;

  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Suggestions
  setSuggestions: (suggestions: SuggestedQuestion[]) => void;
  generateSuggestions: (
    composition: Composition,
    selectedNode?: CompositionNode | null,
  ) => void;
}

// Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// Generate contextual suggestions based on composition and selected node
function generateContextualSuggestions(
  composition: Composition,
  selectedNode?: CompositionNode | null,
): SuggestedQuestion[] {
  const suggestions: SuggestedQuestion[] = [];

  if (selectedNode) {
    // Node-specific questions
    suggestions.push({
      id: generateId(),
      question: `What is ${selectedNode.name} made of?`,
      nodeId: selectedNode.id,
    });

    if (selectedNode.type === "chemical") {
      suggestions.push({
        id: generateId(),
        question: `Is ${selectedNode.name} safe for human consumption?`,
        nodeId: selectedNode.id,
      });
      suggestions.push({
        id: generateId(),
        question: `What are the properties of ${selectedNode.name}?`,
        nodeId: selectedNode.id,
      });
    }

    if (selectedNode.type === "element") {
      suggestions.push({
        id: generateId(),
        question: `Why is ${selectedNode.name} used in this product?`,
        nodeId: selectedNode.id,
      });
    }

    if (selectedNode.type === "component") {
      suggestions.push({
        id: generateId(),
        question: `How is the ${selectedNode.name} manufactured?`,
        nodeId: selectedNode.id,
      });
    }
  } else {
    // General composition questions
    suggestions.push({
      id: generateId(),
      question: `What are the main components of ${composition.name}?`,
    });
    suggestions.push({
      id: generateId(),
      question: `Which materials in ${composition.name} are the most valuable?`,
    });
    suggestions.push({
      id: generateId(),
      question: `Are there any harmful substances in ${composition.name}?`,
    });
    suggestions.push({
      id: generateId(),
      question: `How recyclable is ${composition.name}?`,
    });
  }

  return suggestions.slice(0, 4);
}

// ============================================
// Chat Store
// ============================================

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      // Initial state
      conversation: null,
      isOpen: false,
      isLoading: false,
      error: null,
      conversations: {},
      suggestions: [],

      // Chat visibility
      openChat: () => set({ isOpen: true }),
      closeChat: () => set({ isOpen: false }),
      toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),

      // Initialize conversation for a composition
      initConversation: (composition: Composition) => {
        const { conversations } = get();
        const existingConversation = conversations[composition.id];

        if (existingConversation) {
          // Load existing conversation
          set({
            conversation: existingConversation,
            suggestions: generateContextualSuggestions(composition),
          });
        } else {
          // Create new conversation
          const newConversation: Conversation = {
            id: generateId(),
            compositionId: composition.id,
            compositionName: composition.name,
            messages: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set({
            conversation: newConversation,
            conversations: {
              ...conversations,
              [composition.id]: newConversation,
            },
            suggestions: generateContextualSuggestions(composition),
          });
        }
      },

      // Load conversation by composition ID
      loadConversation: (compositionId: string) => {
        const { conversations } = get();
        const conversation = conversations[compositionId] || null;
        set({ conversation });
      },

      // Clear current conversation
      clearConversation: () => {
        const { conversation, conversations } = get();
        if (conversation) {
          const clearedConversation: Conversation = {
            ...conversation,
            messages: [],
            updatedAt: new Date().toISOString(),
          };

          set({
            conversation: clearedConversation,
            conversations: {
              ...conversations,
              [conversation.compositionId]: clearedConversation,
            },
          });
        }
      },

      // Delete conversation entirely
      deleteConversation: (compositionId: string) => {
        const { conversations, conversation } = get();
        const newConversations = { ...conversations };
        delete newConversations[compositionId];

        set({
          conversations: newConversations,
          conversation:
            conversation?.compositionId === compositionId ? null : conversation,
        });
      },

      // Add a new message
      addMessage: (message) => {
        const { conversation, conversations } = get();
        if (!conversation) return;

        const newMessage: ChatMessage = {
          id: generateId(),
          timestamp: new Date().toISOString(),
          ...message,
        };

        const updatedConversation: Conversation = {
          ...conversation,
          messages: [...conversation.messages, newMessage],
          updatedAt: new Date().toISOString(),
        };

        set({
          conversation: updatedConversation,
          conversations: {
            ...conversations,
            [conversation.compositionId]: updatedConversation,
          },
        });
      },

      // Update the last message content (for streaming)
      updateLastMessage: (content: string, isStreaming?: boolean) => {
        const { conversation, conversations } = get();
        if (!conversation || conversation.messages.length === 0) return;

        const messages = [...conversation.messages];
        const lastIndex = messages.length - 1;
        const lastMessage = messages[lastIndex];

        if (lastMessage) {
          messages[lastIndex] = {
            ...lastMessage,
            content,
            isStreaming: isStreaming ?? lastMessage.isStreaming,
          };
        }

        const updatedConversation: Conversation = {
          ...conversation,
          messages,
          updatedAt: new Date().toISOString(),
        };

        set({
          conversation: updatedConversation,
          conversations: {
            ...conversations,
            [conversation.compositionId]: updatedConversation,
          },
        });
      },

      // Append chunk to last message (for streaming)
      appendToLastMessage: (chunk: string) => {
        const { conversation, conversations } = get();
        if (!conversation || conversation.messages.length === 0) return;

        const messages = [...conversation.messages];
        const lastIndex = messages.length - 1;
        const lastMessage = messages[lastIndex];

        if (lastMessage) {
          messages[lastIndex] = {
            ...lastMessage,
            content: lastMessage.content + chunk,
          };
        }

        const updatedConversation: Conversation = {
          ...conversation,
          messages,
          updatedAt: new Date().toISOString(),
        };

        set({
          conversation: updatedConversation,
          conversations: {
            ...conversations,
            [conversation.compositionId]: updatedConversation,
          },
        });
      },

      // Mark last message as complete
      setLastMessageComplete: () => {
        const { conversation, conversations } = get();
        if (!conversation || conversation.messages.length === 0) return;

        const messages = [...conversation.messages];
        const lastIndex = messages.length - 1;
        const lastMessage = messages[lastIndex];

        if (lastMessage) {
          messages[lastIndex] = {
            ...lastMessage,
            isStreaming: false,
          };
        }

        const updatedConversation: Conversation = {
          ...conversation,
          messages,
          updatedAt: new Date().toISOString(),
        };

        set({
          conversation: updatedConversation,
          conversations: {
            ...conversations,
            [conversation.compositionId]: updatedConversation,
          },
        });
      },

      // State management
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      // Suggestions
      setSuggestions: (suggestions) => set({ suggestions }),
      generateSuggestions: (composition, selectedNode) => {
        const suggestions = generateContextualSuggestions(
          composition,
          selectedNode,
        );
        set({ suggestions });
      },
    }),
    {
      name: "composition-chat",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        conversations: state.conversations,
      }),
    },
  ),
);
