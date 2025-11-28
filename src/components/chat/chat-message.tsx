"use client";

/**
 * Chat Message Component - Individual message bubble in chat
 * Supports user and assistant messages with markdown rendering
 */

import { memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { NodeReference } from "./node-reference";
import type { ChatMessage as ChatMessageType } from "@/stores/chat-store";

interface ChatMessageProps {
  message: ChatMessageType;
  onNodeClick?: (nodeId: string) => void;
}

// Parse node references from message content: [[NodeName]]
interface ParsedPart {
  text: string;
  isNode: boolean;
  nodeName: string | null;
}

function parseNodeReferences(content: string): ParsedPart[] {
  const parts: ParsedPart[] = [];
  const regex = /\[\[(.*?)\]\]/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push({
        text: content.slice(lastIndex, match.index),
        isNode: false,
        nodeName: null,
      });
    }
    // Add the node reference
    const nodeName = match[1] ?? "";
    parts.push({ text: nodeName, isNode: true, nodeName });
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    parts.push({
      text: content.slice(lastIndex),
      isNode: false,
      nodeName: null,
    });
  }

  return parts.length > 0
    ? parts
    : [{ text: content, isNode: false, nodeName: null }];
}

export const ChatMessage = memo(function ChatMessage({
  message,
  onNodeClick,
}: ChatMessageProps) {
  const isUser = message.role === "user";
  const isStreaming = message.isStreaming;

  // Parse content for node references
  const parsedContent = useMemo(
    () => parseNodeReferences(message.content),
    [message.content],
  );

  // Check if content has node references
  const hasNodeRefs = parsedContent.some((p) => p.isNode);

  return (
    <div
      className={cn(
        "flex w-full animate-fade-in",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-lg px-4 py-3",
          isUser
            ? "bg-[var(--accent-primary)] text-white"
            : "bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-[var(--text-primary)]",
        )}
      >
        {/* Message header */}
        <div
          className={cn(
            "text-xs font-mono mb-1.5",
            isUser ? "text-white/70" : "text-[var(--text-tertiary)]",
          )}
        >
          {isUser ? "USER" : "ANALYST"}
          <span className="mx-2">|</span>
          {new Date(message.timestamp).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>

        {/* Message content */}
        <div className="text-sm leading-relaxed">
          {hasNodeRefs ? (
            // Render with node references
            <span>
              {parsedContent.map((part, i) =>
                part.isNode && part.nodeName ? (
                  <NodeReference
                    key={i}
                    nodeName={part.nodeName}
                    onClick={() => onNodeClick?.(part.nodeName!)}
                  />
                ) : (
                  <span key={i}>{part.text}</span>
                ),
              )}
            </span>
          ) : (
            // Render as markdown
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <p className="mb-2 last:mb-0">{children}</p>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-[var(--text-primary)]">
                    {children}
                  </strong>
                ),
                em: ({ children }) => <em className="italic">{children}</em>,
                code: ({ children }) => (
                  <code className="px-1.5 py-0.5 bg-[var(--bg-primary)] rounded text-[var(--text-mono)] font-mono text-xs">
                    {children}
                  </code>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside mb-2 space-y-1">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside mb-2 space-y-1">
                    {children}
                  </ol>
                ),
                li: ({ children }) => <li className="ml-2">{children}</li>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}

          {/* Streaming indicator */}
          {isStreaming && (
            <span className="inline-block w-2 h-4 bg-[var(--accent-primary)] animate-blink ml-0.5" />
          )}
        </div>

        {/* Node references if provided */}
        {message.nodeReferences && message.nodeReferences.length > 0 && (
          <div className="mt-2 pt-2 border-t border-[var(--border-subtle)]">
            <div className="text-xs text-[var(--text-tertiary)] mb-1">
              Referenced nodes:
            </div>
            <div className="flex flex-wrap gap-1">
              {message.nodeReferences.map((ref) => (
                <NodeReference
                  key={ref.nodeId}
                  nodeName={ref.nodeName}
                  nodeType={ref.nodeType}
                  onClick={() => onNodeClick?.(ref.nodeId)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
