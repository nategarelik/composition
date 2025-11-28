'use client'

import { useEffect, useState, useRef } from 'react'

export type LogLevel = 'info' | 'success' | 'warning' | 'error'

export interface LogEntry {
  id: string
  timestamp: string
  message: string
  level: LogLevel
}

interface SystemLogProps {
  className?: string
  maxEntries?: number
}

export function SystemLog({ className = '', maxEntries = 50 }: SystemLogProps) {
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: new Date().toISOString(),
      message: 'System initialized',
      level: 'success',
    },
  ])
  const logContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new logs are added
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }, [logs])

  // Add a new log entry
  const addLog = (message: string, level: LogLevel = 'info') => {
    setLogs((prevLogs) => {
      const newLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        message,
        level,
      }
      const updatedLogs = [...prevLogs, newLog]
      // Keep only the last maxEntries
      return updatedLogs.slice(-maxEntries)
    })
  }

  // Expose addLog function globally for other components to use
  useEffect(() => {
    window.addSystemLog = addLog
    return () => {
      delete window.addSystemLog
    }
  }, [])

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case 'success':
        return 'text-[var(--accent-secondary)]'
      case 'error':
        return 'text-[var(--accent-danger)]'
      case 'warning':
        return 'text-[var(--accent-warning)]'
      default:
        return 'text-[var(--text-secondary)]'
    }
  }

  return (
    <div className={`bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-sm ${className}`}>
      {/* Panel Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border-subtle)]">
        <span className="font-mono text-xs text-[var(--text-secondary)] uppercase tracking-wider">
          System Log
        </span>
        <button
          onClick={() => setLogs([])}
          className="font-mono text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
        >
          CLEAR
        </button>
      </div>

      {/* Panel Content */}
      <div
        ref={logContainerRef}
        className="p-3 h-40 overflow-y-auto font-mono text-xs space-y-1"
      >
        {logs.length === 0 ? (
          <div className="text-center py-8 text-[var(--text-tertiary)]">No log entries</div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex gap-2">
              <span className="text-[var(--text-tertiary)] shrink-0">{formatTime(log.timestamp)}</span>
              <span className={getLevelColor(log.level)}>{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// Global type for window object
declare global {
  interface Window {
    addSystemLog?: (message: string, level: LogLevel) => void
  }
}
