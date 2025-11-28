"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface RecentAnalysisItem {
  id: string;
  name: string;
  nodeCount: number;
  timestamp: string;
}

interface RecentAnalysesProps {
  className?: string;
}

export function RecentAnalyses({ className = "" }: RecentAnalysesProps) {
  const router = useRouter();
  const [analyses, setAnalyses] = useState<RecentAnalysisItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch recent analyses from API
    const fetchRecent = async () => {
      try {
        const response = await fetch("/api/recent");
        if (response.ok) {
          const data = await response.json();
          setAnalyses(data.compositions || []);
        }
      } catch {
        // Silently fail, show empty state
      } finally {
        setLoading(false);
      }
    };

    fetchRecent();
  }, []);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleClick = (id: string) => {
    router.push(`/composition/${id}`);
  };

  return (
    <div
      className={`bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-sm ${className}`}
    >
      {/* Panel Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--border-subtle)]">
        <span className="font-mono text-xs text-[var(--text-secondary)] uppercase tracking-wider">
          Recent Analyses
        </span>
      </div>

      {/* Panel Content */}
      <div className="p-3">
        {loading ? (
          <div className="text-center py-4">
            <span className="font-mono text-xs text-[var(--text-secondary)]">
              Loading...
            </span>
          </div>
        ) : analyses.length === 0 ? (
          <div className="text-center py-4">
            <span className="font-mono text-xs text-[var(--text-secondary)]">
              No recent analyses
            </span>
          </div>
        ) : (
          <div className="space-y-1">
            {analyses.map((item) => (
              <button
                key={item.id}
                onClick={() => handleClick(item.id)}
                className="w-full text-left px-2 py-2 rounded hover:bg-[var(--bg-tertiary)] transition-colors group"
              >
                <div className="font-mono text-sm text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                  {item.name}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-xs text-[var(--text-secondary)]">
                    {formatTime(item.timestamp)}
                  </span>
                  <span className="text-[var(--text-tertiary)]">·</span>
                  <span className="font-mono text-xs text-[var(--text-secondary)] tabular-nums">
                    {item.nodeCount} nodes
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
