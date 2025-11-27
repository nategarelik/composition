'use client'

import { useCompositionStore } from '@/stores'

export function ViewerControls() {
  const {
    depthLevel,
    setDepthLevel,
    maxDepth,
    isExploded,
    toggleExploded,
    selectedNode,
    selectNode,
    composition,
  } = useCompositionStore()

  if (!composition) return null

  return (
    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
      {/* Left controls */}
      <div className="flex gap-2 pointer-events-auto">
        <button
          onClick={toggleExploded}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            isExploded
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          {isExploded ? 'Collapse' : 'Explode'}
        </button>
      </div>

      {/* Center - Depth slider */}
      <div className="flex items-center gap-3 bg-gray-800/90 backdrop-blur-sm rounded-lg px-4 py-2 pointer-events-auto">
        <span className="text-gray-400 text-sm">Depth</span>
        <input
          type="range"
          min={1}
          max={maxDepth}
          value={depthLevel}
          onChange={(e) => setDepthLevel(parseInt(e.target.value, 10))}
          className="w-32 accent-blue-500"
        />
        <span className="text-white text-sm font-mono w-4">{depthLevel}</span>
      </div>

      {/* Right - placeholder for future controls */}
      <div className="w-24" />

      {/* Selected node info */}
      {selectedNode && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-gray-800/90 backdrop-blur-sm rounded-lg px-4 py-2 pointer-events-auto flex items-center gap-3">
          <div>
            <span className="text-white font-medium">{selectedNode.name}</span>
            <span className="text-gray-400 text-sm ml-2">
              {selectedNode.percentage.toFixed(1)}%
            </span>
          </div>
          <button
            onClick={() => selectNode(null)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
