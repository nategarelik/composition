'use client'

import { useSearchStore } from '@/stores'

const stageLabels: Record<string, string> = {
  identifying: 'Identifying',
  researching: 'Researching',
  analyzing: 'Analyzing',
  synthesizing: 'Synthesizing',
  complete: 'Complete',
  error: 'Error',
}

export function SearchProgress() {
  const { isSearching, progress, error } = useSearchStore()

  if (!isSearching && !error) return null

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
        {error ? (
          <div className="text-red-400">
            <p className="font-medium">Research failed</p>
            <p className="text-sm text-gray-400 mt-1">{error}</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-300">
                {stageLabels[progress.stage] ?? progress.stage}
              </span>
              <span className="text-sm text-gray-500">{progress.percentage}%</span>
            </div>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-500"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
            {progress.message && (
              <p className="text-sm text-gray-400 mt-3">{progress.message}</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
