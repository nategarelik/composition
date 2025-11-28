'use client'

import { useRouter } from 'next/navigation'

interface QuickSpecimen {
  name: string
  icon: string
  category: string
}

const SPECIMENS: QuickSpecimen[] = [
  { name: 'iPhone 15 Pro', icon: '📱', category: 'product' },
  { name: 'Coca-Cola', icon: '🥤', category: 'product' },
  { name: 'Human Blood', icon: '🩸', category: 'biological' },
  { name: 'Concrete', icon: '🧱', category: 'material' },
  { name: 'Aspirin', icon: '💊', category: 'chemical' },
  { name: 'Solar Panel', icon: '☀️', category: 'product' },
]

interface QuickSpecimensProps {
  className?: string
}

export function QuickSpecimens({ className = '' }: QuickSpecimensProps) {
  const router = useRouter()

  const handleSpecimenClick = async (name: string) => {
    try {
      // Start analysis for the quick specimen
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: name }),
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/composition/${data.id}`)
      }
    } catch (error) {
      console.error('Error analyzing specimen:', error)
    }
  }

  return (
    <div className={`bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-sm ${className}`}>
      {/* Panel Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--border-subtle)]">
        <span className="font-mono text-xs text-[var(--text-secondary)] uppercase tracking-wider">
          Quick Specimens
        </span>
      </div>

      {/* Panel Content */}
      <div className="p-3">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {SPECIMENS.map((specimen) => (
            <button
              key={specimen.name}
              onClick={() => handleSpecimenClick(specimen.name)}
              className="flex items-center gap-2 px-3 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded hover:border-[var(--accent-primary)] hover:bg-[var(--bg-elevated)] transition-all group"
            >
              <span className="text-lg">{specimen.icon}</span>
              <span className="font-mono text-xs text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                {specimen.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
