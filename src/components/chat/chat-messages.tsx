"use client";

/**
 * Chat Messages Component - Container for chat message list
 * Handles scrolling, auto-scroll to bottom, and empty state
 */

import { useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ChatMessage } from "./chat-message";
import type { ChatMessage as ChatMessageType } from "@/stores/chat-store";

interface ChatMessagesProps {
  messages: ChatMessageType[];
  isLoading?: boolean;
  onNodeClick?: (nodeName: string) => void;
  className?: string;
}

export function ChatMessages({
  messages,
  isLoading = false,
  onNodeClick,
  className,
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "instant",
    });
  }, []);

  // Scroll on new message
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Empty state
  if (messages.length === 0 && !isLoading) {
    return (
      <div
        className={cn(
          "flex-1 flex flex-col items-center justify-center p-6",
          className,
        )}
      >
        <div className="text-center max-w-xs">
          {/* Terminal icon */}
          <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] flex items-center justify-center">
            <svg
              className="w-8 h-8 text-[var(--text-tertiary)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-sm font-medium text-[var(--text-primary)] mb-1">
            Analysis Assistant
          </h3>
          <p className="text-xs text-[var(--text-tertiary)] leading-relaxed">
            Ask questions about this composition. I can help you understand
            materials, chemicals, safety, and more.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("flex-1 overflow-y-auto p-4 space-y-4", className)}
    >
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          onNodeClick={onNodeClick}
        />
      ))}

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-start animate-fade-in">
          <div className="max-w-[85%] rounded-lg px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)]">
            <div className="text-xs font-mono mb-1.5 text-[var(--text-tertiary)]">
              ANALYST
              <span className="mx-2">|</span>
              {new Date().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <span className="inline-flex gap-1">
                <span className="w-2 h-2 bg-[var(--accent-primary)] rounded-full animate-pulse" />
                <span className="w-2 h-2 bg-[var(--accent-primary)] rounded-full animate-pulse [animation-delay:200ms]" />
                <span className="w-2 h-2 bg-[var(--accent-primary)] rounded-full animate-pulse [animation-delay:400ms]" />
              </span>
              <span>Analyzing...</span>
            </div>
          </div>
        </div>
      )}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
}
