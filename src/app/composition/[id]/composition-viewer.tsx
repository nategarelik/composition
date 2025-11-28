'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useCompositionStore } from '@/stores'
import { ViewerControls, NodeTooltip } from '@/components/viewer'
import { ChatDrawer } from '@/components/chat'
import type { Composition } from '@/types'

// Dynamically import Canvas to avoid SSR issues with drei
const CompositionCanvas = dynamic(
  () => import('@/components/viewer/composition-canvas').then((mod) => mod.CompositionCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading 3D viewer...</p>
        </div>
      </div>
    ),
  }
)

interface CompositionViewerClientProps {
  composition: Composition
}

export function CompositionViewerClient({ composition }: CompositionViewerClientProps) {
  const setComposition = useCompositionStore((s) => s.setComposition)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [isSharing, setIsSharing] = useState(false)

  useEffect(() => {
    setComposition(composition)
  }, [composition, setComposition])

  const handleShare = async () => {
    setIsSharing(true)
    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ compositionId: composition.id }),
      })
      const data = await response.json()
      if (data.success) {
        setShareUrl(data.data.url)
        await navigator.clipboard.writeText(data.data.url)
      }
    } catch (error) {
      console.error('Share error:', error)
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-black">
      {/* Header */}
      <header className="p-4 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">{composition.name}</h1>
            <p className="text-sm text-gray-400">{composition.category}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              composition.confidence === 'verified'
                ? 'bg-green-900 text-green-300'
                : composition.confidence === 'estimated'
                ? 'bg-yellow-900 text-yellow-300'
                : 'bg-red-900 text-red-300'
            }`}
          >
            {composition.confidence}
          </span>
          <button
            onClick={handleShare}
            disabled={isSharing}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            {isSharing ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            )}
            {shareUrl ? 'Copied!' : 'Share'}
          </button>
        </div>
      </header>

      {/* 3D Viewer */}
      <div className="flex-1 relative">
        <CompositionCanvas />
        <ViewerControls />
        <NodeTooltip />
      </div>

      {/* Info Panel */}
      <div className="p-4 border-t border-gray-800 bg-gray-900/50">
        <div className="max-w-4xl mx-auto">
          {composition.description && (
            <p className="text-gray-400 mb-4">{composition.description}</p>
          )}
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span>{composition.viewCount} views</span>
            <span>{composition.shareCount} shares</span>
            <span>
              Researched {new Date(composition.researchedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Chat Drawer */}
      <ChatDrawer composition={composition} />
    </main>
  )
}
