"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface SpecimenInputProps {
  className?: string;
  onAnalyze?: (query: string) => void;
}

export function SpecimenInput({
  className = "",
  onAnalyze,
}: SpecimenInputProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Call the API to start analysis
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        // Navigate to the composition view
        router.push(`/composition/${data.id}`);
        if (onAnalyze) {
          onAnalyze(query.trim());
        }
      } else {
        // Handle error
        console.error("Analysis failed");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error submitting analysis:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-sm ${className}`}
    >
      {/* Panel Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--border-subtle)]">
        <span className="font-mono text-xs text-[var(--text-secondary)] uppercase tracking-wider">
          Enter Specimen for Analysis
        </span>
      </div>

      {/* Panel Content */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Terminal Input */}
          <div className="flex items-center gap-2 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded px-3 py-3 focus-within:border-[var(--accent-primary)] transition-colors">
            <span className="text-[var(--accent-secondary)] font-mono text-lg">
              &gt;
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter anything to analyze..."
              disabled={isSubmitting}
              className="flex-1 bg-transparent text-[var(--text-primary)] font-mono text-base outline-none placeholder:text-[var(--text-secondary)] disabled:opacity-50"
              autoFocus
            />
          </div>

          {/* Analyze Button */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={!query.trim() || isSubmitting}
              className="px-6 py-2.5 bg-[var(--accent-primary)] text-white font-medium text-sm rounded hover:bg-[#2b8aef] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? "ANALYZING..." : "ANALYZE"}
            </button>
            <span className="font-mono text-xs text-[var(--text-secondary)]">
              or drag file to analyze
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
