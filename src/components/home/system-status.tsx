'use client'

import { useEffect, useState } from 'react'

interface SystemStatusProps {
  className?: string
}

interface StatusData {
  apiConnected: boolean
  model: string
  cacheItems: number
}

export function SystemStatus({ className = '' }: SystemStatusProps) {
  const [status, setStatus] = useState<StatusData>({
    apiConnected: false,
    model: 'Claude Sonnet 4.5',
    cacheItems: 0,
  })

  useEffect(() => {
    // Check API status on mount
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/health')
        const connected = response.ok
        setStatus((prev) => ({ ...prev, apiConnected: connected }))
      } catch {
        setStatus((prev) => ({ ...prev, apiConnected: false }))
      }
    }

    checkStatus()
    // Check every 30 seconds
    const interval = setInterval(checkStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Fetch cache stats
    const fetchCacheStats = async () => {
      try {
        const response = await fetch('/api/stats')
        if (response.ok) {
          const data = await response.json()
          setStatus((prev) => ({ ...prev, cacheItems: data.cacheItems || 0 }))
        }
      } catch {
        // Silently fail
      }
    }

    fetchCacheStats()
  }, [])

  return (
    <div className={`bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-sm ${className}`}>
      {/* Panel Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--border-subtle)]">
        <span className="font-mono text-xs text-[var(--text-secondary)] uppercase tracking-wider">
          System Status
        </span>
      </div>

      {/* Panel Content */}
      <div className="p-3 space-y-3">
        {/* API Status */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-[var(--text-secondary)]">API:</span>
          <div className="flex items-center gap-2">
            {/* Status Indicator with Pulse */}
            <span className="relative flex h-2 w-2">
              {status.apiConnected && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent-secondary)] opacity-75" />
              )}
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  status.apiConnected ? 'bg-[var(--accent-secondary)]' : 'bg-[var(--accent-danger)]'
                }`}
              />
            </span>
            <span className="font-mono text-xs text-[var(--text-mono)]">
              {status.apiConnected ? 'CONNECTED' : 'OFFLINE'}
            </span>
          </div>
        </div>

        {/* Model */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-[var(--text-secondary)]">MODEL:</span>
          <span className="font-mono text-xs text-[var(--text-primary)]">{status.model}</span>
        </div>

        {/* Cache */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-[var(--text-secondary)]">CACHE:</span>
          <span className="font-mono text-xs text-[var(--text-mono)] tabular-nums">
            {status.cacheItems.toLocaleString()} items
          </span>
        </div>
      </div>
    </div>
  )
}
