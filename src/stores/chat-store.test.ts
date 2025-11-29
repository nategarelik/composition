import { describe, it, expect, beforeEach } from "vitest";
import { useChatStore } from "./chat-store";
import type { Composition } from "@/types";

describe("Chat Store", () => {
  beforeEach(() => {
    // Reset store state
    useChatStore.setState({
      conversation: null,
      isOpen: false,
      isLoading: false,
      error: null,
      conversations: {},
      suggestions: [],
    });
  });

  const mockComposition: Composition = {
    id: "comp-1",
    query: "test",
    name: "Test Composition",
    category: "test",
    root: {
      id: "root",
      name: "Root",
      type: "product",
      percentage: 100,
      confidence: "verified",
    },
    sources: [],
    confidence: "verified",
    researchedAt: "2024-01-01T00:00:00Z",
    viewCount: 0,
    shareCount: 0,
  };

  describe("Chat visibility", () => {
    it("opens chat", () => {
      const store = useChatStore.getState();
      store.openChat();

      expect(useChatStore.getState().isOpen).toBe(true);
    });

    it("closes chat", () => {
      useChatStore.setState({ isOpen: true });
      const store = useChatStore.getState();
      store.closeChat();

      expect(useChatStore.getState().isOpen).toBe(false);
    });

    it("toggles chat", () => {
      const store = useChatStore.getState();
      store.toggleChat();
      expect(useChatStore.getState().isOpen).toBe(true);

      store.toggleChat();
      expect(useChatStore.getState().isOpen).toBe(false);
    });
  });

  describe("initConversation", () => {
    it("creates new conversation for composition", () => {
      const store = useChatStore.getState();
      store.initConversation(mockComposition);

      const conversation = useChatStore.getState().conversation;
      expect(conversation).not.toBeNull();
      expect(conversation?.compositionId).toBe(mockComposition.id);
      expect(conversation?.compositionName).toBe(mockComposition.name);
    });

    it("loads existing conversation if present", () => {
      // Set up existing conversation
      const existingConversation = {
        id: "existing",
        compositionId: mockComposition.id,
        compositionName: mockComposition.name,
        messages: [{ id: "msg-1", role: "user" as const, content: "Hello", timestamp: "2024-01-01" }],
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      };
      useChatStore.setState({
        conversations: { [mockComposition.id]: existingConversation },
      });

      const store = useChatStore.getState();
      store.initConversation(mockComposition);

      const conversation = useChatStore.getState().conversation;
      expect(conversation?.id).toBe("existing");
      expect(conversation?.messages).toHaveLength(1);
    });

    it("generates suggestions", () => {
      const store = useChatStore.getState();
      store.initConversation(mockComposition);

      const suggestions = useChatStore.getState().suggestions;
      expect(suggestions.length).toBeGreaterThan(0);
    });
  });

  describe("addMessage", () => {
    beforeEach(() => {
      const store = useChatStore.getState();
      store.initConversation(mockComposition);
    });

    it("adds user message", () => {
      const store = useChatStore.getState();
      store.addMessage({ role: "user", content: "Hello" });

      const messages = useChatStore.getState().conversation?.messages ?? [];
      expect(messages).toHaveLength(1);
      expect(messages[0]?.role).toBe("user");
      expect(messages[0]?.content).toBe("Hello");
    });

    it("adds assistant message", () => {
      const store = useChatStore.getState();
      store.addMessage({ role: "assistant", content: "Hi there!" });

      const messages = useChatStore.getState().conversation?.messages ?? [];
      expect(messages[0]?.role).toBe("assistant");
    });

    it("generates unique IDs", () => {
      const store = useChatStore.getState();
      store.addMessage({ role: "user", content: "First" });
      store.addMessage({ role: "user", content: "Second" });

      const messages = useChatStore.getState().conversation?.messages ?? [];
      expect(messages[0]?.id).not.toBe(messages[1]?.id);
    });

    it("sets timestamp", () => {
      const store = useChatStore.getState();
      store.addMessage({ role: "user", content: "Test" });

      const message = useChatStore.getState().conversation?.messages[0];
      expect(message?.timestamp).toBeDefined();
    });
  });

  describe("updateLastMessage", () => {
    beforeEach(() => {
      const store = useChatStore.getState();
      store.initConversation(mockComposition);
      store.addMessage({ role: "assistant", content: "Initial" });
    });

    it("updates last message content", () => {
      const store = useChatStore.getState();
      store.updateLastMessage("Updated content");

      const messages = useChatStore.getState().conversation?.messages ?? [];
      expect(messages[0]?.content).toBe("Updated content");
    });

    it("can set streaming flag", () => {
      const store = useChatStore.getState();
      store.updateLastMessage("Streaming...", true);

      const messages = useChatStore.getState().conversation?.messages ?? [];
      expect(messages[0]?.isStreaming).toBe(true);
    });
  });

  describe("appendToLastMessage", () => {
    beforeEach(() => {
      const store = useChatStore.getState();
      store.initConversation(mockComposition);
      store.addMessage({ role: "assistant", content: "Hello" });
    });

    it("appends to last message content", () => {
      const store = useChatStore.getState();
      store.appendToLastMessage(" world");

      const messages = useChatStore.getState().conversation?.messages ?? [];
      expect(messages[0]?.content).toBe("Hello world");
    });
  });

  describe("clearConversation", () => {
    it("clears messages but keeps conversation", () => {
      const store = useChatStore.getState();
      store.initConversation(mockComposition);
      store.addMessage({ role: "user", content: "Test" });
      store.clearConversation();

      const conversation = useChatStore.getState().conversation;
      expect(conversation).not.toBeNull();
      expect(conversation?.messages).toHaveLength(0);
    });
  });

  describe("deleteConversation", () => {
    it("removes conversation from storage", () => {
      const store = useChatStore.getState();
      store.initConversation(mockComposition);
      store.deleteConversation(mockComposition.id);

      const conversations = useChatStore.getState().conversations;
      expect(conversations[mockComposition.id]).toBeUndefined();
    });

    it("clears current conversation if it matches", () => {
      const store = useChatStore.getState();
      store.initConversation(mockComposition);
      store.deleteConversation(mockComposition.id);

      expect(useChatStore.getState().conversation).toBeNull();
    });
  });

  describe("State management", () => {
    it("sets loading state", () => {
      const store = useChatStore.getState();
      store.setLoading(true);

      expect(useChatStore.getState().isLoading).toBe(true);
    });

    it("sets error state", () => {
      const store = useChatStore.getState();
      store.setError("Something went wrong");

      expect(useChatStore.getState().error).toBe("Something went wrong");
    });

    it("clears error state", () => {
      useChatStore.setState({ error: "Error" });
      const store = useChatStore.getState();
      store.setError(null);

      expect(useChatStore.getState().error).toBeNull();
    });
  });

  describe("setLastMessageComplete", () => {
    beforeEach(() => {
      const store = useChatStore.getState();
      store.initConversation(mockComposition);
    });

    it("marks streaming message as complete", () => {
      const store = useChatStore.getState();
      store.addMessage({ role: "assistant", content: "Test", isStreaming: true });
      store.setLastMessageComplete();

      const messages = useChatStore.getState().conversation?.messages ?? [];
      expect(messages[0]?.isStreaming).toBe(false);
    });

    it("does nothing when no conversation exists", () => {
      useChatStore.setState({ conversation: null });
      const store = useChatStore.getState();

      // Should not throw
      expect(() => store.setLastMessageComplete()).not.toThrow();
    });

    it("does nothing when no messages exist", () => {
      const store = useChatStore.getState();
      // No messages added yet

      // Should not throw
      expect(() => store.setLastMessageComplete()).not.toThrow();
    });

    it("updates conversation in storage", () => {
      const store = useChatStore.getState();
      store.addMessage({ role: "assistant", content: "Test", isStreaming: true });
      store.setLastMessageComplete();

      const conversations = useChatStore.getState().conversations;
      const storedConversation = conversations[mockComposition.id];
      expect(storedConversation?.messages[0]?.isStreaming).toBe(false);
    });
  });

  describe("generateSuggestions", () => {
    it("generates general suggestions without selected node", () => {
      const store = useChatStore.getState();
      store.generateSuggestions(mockComposition);

      const suggestions = useChatStore.getState().suggestions;
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.some(s => s.question.includes(mockComposition.name))).toBe(true);
    });

    it("generates node-specific suggestions for chemical nodes", () => {
      const chemicalNode = {
        id: "chem-1",
        name: "Sodium Chloride",
        type: "chemical" as const,
        percentage: 50,
        confidence: "verified" as const,
      };
      const store = useChatStore.getState();
      store.generateSuggestions(mockComposition, chemicalNode);

      const suggestions = useChatStore.getState().suggestions;
      expect(suggestions.some(s => s.question.includes("safe for human consumption"))).toBe(true);
      expect(suggestions.some(s => s.question.includes("properties"))).toBe(true);
    });

    it("generates node-specific suggestions for element nodes", () => {
      const elementNode = {
        id: "elem-1",
        name: "Carbon",
        type: "element" as const,
        percentage: 25,
        confidence: "verified" as const,
        symbol: "C",
        atomicNumber: 6,
      };
      const store = useChatStore.getState();
      store.generateSuggestions(mockComposition, elementNode);

      const suggestions = useChatStore.getState().suggestions;
      expect(suggestions.some(s => s.question.includes("Why is Carbon used"))).toBe(true);
    });

    it("generates node-specific suggestions for component nodes", () => {
      const componentNode = {
        id: "comp-1",
        name: "Battery",
        type: "component" as const,
        percentage: 30,
        confidence: "estimated" as const,
      };
      const store = useChatStore.getState();
      store.generateSuggestions(mockComposition, componentNode);

      const suggestions = useChatStore.getState().suggestions;
      expect(suggestions.some(s => s.question.includes("manufactured"))).toBe(true);
    });

    it("always asks what selected node is made of", () => {
      const node = {
        id: "node-1",
        name: "Test Node",
        type: "material" as const,
        percentage: 20,
        confidence: "verified" as const,
      };
      const store = useChatStore.getState();
      store.generateSuggestions(mockComposition, node);

      const suggestions = useChatStore.getState().suggestions;
      expect(suggestions.some(s => s.question.includes("made of"))).toBe(true);
    });

    it("limits suggestions to 4", () => {
      const chemicalNode = {
        id: "chem-1",
        name: "Test Chemical",
        type: "chemical" as const,
        percentage: 50,
        confidence: "verified" as const,
      };
      const store = useChatStore.getState();
      store.generateSuggestions(mockComposition, chemicalNode);

      const suggestions = useChatStore.getState().suggestions;
      expect(suggestions.length).toBeLessThanOrEqual(4);
    });

    it("includes nodeId in node-specific suggestions", () => {
      const node = {
        id: "specific-node-id",
        name: "Test",
        type: "component" as const,
        percentage: 10,
        confidence: "verified" as const,
      };
      const store = useChatStore.getState();
      store.generateSuggestions(mockComposition, node);

      const suggestions = useChatStore.getState().suggestions;
      expect(suggestions.some(s => s.nodeId === "specific-node-id")).toBe(true);
    });
  });

  describe("setSuggestions", () => {
    it("sets custom suggestions", () => {
      const customSuggestions = [
        { id: "s1", question: "Custom question 1" },
        { id: "s2", question: "Custom question 2" },
      ];
      const store = useChatStore.getState();
      store.setSuggestions(customSuggestions);

      expect(useChatStore.getState().suggestions).toEqual(customSuggestions);
    });

    it("can clear suggestions", () => {
      useChatStore.setState({ suggestions: [{ id: "s1", question: "Test" }] });
      const store = useChatStore.getState();
      store.setSuggestions([]);

      expect(useChatStore.getState().suggestions).toEqual([]);
    });
  });
});
