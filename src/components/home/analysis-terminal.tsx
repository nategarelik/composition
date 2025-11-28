'use client'

import { SystemStatus } from './system-status'
import { RecentAnalyses } from './recent-analyses'
import { SpecimenInput } from './specimen-input'
import { QuickSpecimens } from './quick-specimens'
import { SystemLog } from './system-log'

export function AnalysisTerminal() {
  const handleAnalyze = (query: string) => {
    // Add log entry when analysis starts
    if (typeof window !== 'undefined' && window.addSystemLog) {
      window.addSystemLog(`Analysis requested: ${query}`, 'info')
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-1">
              COMPOSITION ANALYSIS TERMINAL
            </h1>
            <p className="font-mono text-xs text-[var(--text-secondary)]">
              Deconstructing anything into its constituent parts
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent-secondary)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent-secondary)]" />
            </span>
            <span className="font-mono text-xs text-[var(--text-mono)]">ONLINE</span>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar - System panels */}
        <div className="lg:col-span-3 space-y-4">
          <SystemStatus />
          <RecentAnalyses />
          <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-sm">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--border-subtle)]">
              <span className="font-mono text-xs text-[var(--text-secondary)] uppercase tracking-wider">
                Analysis Queue
              </span>
            </div>
            <div className="p-3 text-center">
              <span className="font-mono text-xs text-[var(--text-secondary)]">No pending items</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9 space-y-4">
          {/* Specimen Input */}
          <SpecimenInput onAnalyze={handleAnalyze} />

          {/* Quick Specimens */}
          <QuickSpecimens />

          {/* System Log */}
          <SystemLog />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-[var(--border-subtle)]">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs text-[var(--text-tertiary)]">
            Powered by Claude Sonnet 4.5
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/about"
              className="font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
            >
              About
            </a>
            <a
              href="/api"
              className="font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
            >
              API
            </a>
            <a
              href="https://github.com"
              className="font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
