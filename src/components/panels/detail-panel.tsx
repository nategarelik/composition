'use client';

import { useState } from 'react';
import { useCompositionStore } from '@/stores';
import type { ConfidenceLevel } from '@/types/composition';

type TabId = 'identity' | 'composition' | 'properties' | 'sources';

const TABS: { id: TabId; label: string }[] = [
  { id: 'identity', label: 'Identity' },
  { id: 'composition', label: 'Composition' },
  { id: 'properties', label: 'Properties' },
  { id: 'sources', label: 'Sources' },
];

function ConfidenceBadge({ level }: { level: ConfidenceLevel }) {
  const config = {
    verified: {
      label: 'Verified',
      color: 'var(--confidence-verified)',
      icon: '✓',
    },
    estimated: {
      label: 'Estimated',
      color: 'var(--confidence-estimated)',
      icon: '≈',
    },
    speculative: {
      label: 'Speculative',
      color: 'var(--confidence-speculative)',
      icon: '?',
    },
  };

  const { label, color, icon } = config[level];

  return (
    <div
      className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-mono"
      style={{
        color,
        backgroundColor: `${color}20`,
        border: `1px solid ${color}40`,
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function DetailRow({
  label,
  value,
  mono,
  small,
}: {
  label: string;
  value: string | number;
  mono?: boolean;
  small?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span
        className="text-xs uppercase tracking-wide font-mono"
        style={{ color: 'var(--text-tertiary)' }}
      >
        {label}
      </span>
      <span
        className={`${mono ? 'font-mono' : ''} ${small ? 'text-xs' : 'text-sm'}`}
        style={{ color: 'var(--text-primary)' }}
      >
        {value}
      </span>
    </div>
  );
}

export function DetailPanel() {
  const [activeTab, setActiveTab] = useState<TabId>('identity');
  const selectedNode = useCompositionStore((s) => s.selectedNode);
  const composition = useCompositionStore((s) => s.composition);

  if (!selectedNode) {
    return (
      <div
        className="h-full flex items-center justify-center text-sm"
        style={{ color: 'var(--text-tertiary)' }}
      >
        Select a node to view details
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[var(--bg-panel)]">
      {/* Tabs */}
      <div
        className="flex border-b"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-4 py-2 text-sm font-mono transition-colors"
            style={{
              color:
                activeTab === tab.id
                  ? 'var(--accent-primary)'
                  : 'var(--text-secondary)',
              borderBottom:
                activeTab === tab.id
                  ? '2px solid var(--accent-primary)'
                  : '2px solid transparent',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'identity' && (
          <div className="space-y-4">
            <DetailRow label="Name" value={selectedNode.name} />
            <DetailRow
              label="Type"
              value={selectedNode.type.charAt(0).toUpperCase() + selectedNode.type.slice(1)}
            />
            <DetailRow label="ID" value={selectedNode.id} mono small />
            {selectedNode.description && (
              <DetailRow label="Description" value={selectedNode.description} />
            )}
            {selectedNode.symbol && (
              <DetailRow label="Symbol" value={selectedNode.symbol} mono />
            )}
            {selectedNode.atomicNumber !== undefined && (
              <DetailRow label="Atomic #" value={selectedNode.atomicNumber} mono />
            )}
            {selectedNode.casNumber && (
              <DetailRow label="CAS Number" value={selectedNode.casNumber} mono small />
            )}
          </div>
        )}

        {activeTab === 'composition' && (
          <div className="space-y-4">
            <DetailRow
              label="Percentage"
              value={`${selectedNode.percentage.toFixed(2)}%`}
              mono
            />
            <div>
              <span
                className="text-xs uppercase tracking-wide font-mono"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Confidence
              </span>
              <div className="mt-1">
                <ConfidenceBadge level={selectedNode.confidence} />
              </div>
            </div>
            <DetailRow
              label="Children"
              value={`${selectedNode.children?.length || 0}`}
            />
            {selectedNode.children && selectedNode.children.length > 0 && (
              <div className="mt-4 space-y-2">
                <span
                  className="text-xs uppercase tracking-wide font-mono"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  Component List
                </span>
                <div
                  className="rounded p-2 text-xs"
                  style={{ backgroundColor: 'var(--bg-tertiary)' }}
                >
                  {selectedNode.children.map((child, i) => (
                    <div key={i} className="flex justify-between py-1">
                      <span style={{ color: 'var(--text-primary)' }}>
                        {child.name}
                      </span>
                      <span
                        className="font-mono"
                        style={{ color: 'var(--text-mono)' }}
                      >
                        {child.percentage.toFixed(2)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'properties' && (
          <div className="space-y-4">
            {selectedNode.metadata && Object.keys(selectedNode.metadata).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(selectedNode.metadata).map(([key, value]) => (
                  <DetailRow
                    key={key}
                    label={key}
                    value={String(value)}
                  />
                ))}
              </div>
            ) : (
              <div style={{ color: 'var(--text-tertiary)' }}>
                No additional properties
              </div>
            )}
          </div>
        )}

        {activeTab === 'sources' && (
          <div className="space-y-2">
            {composition && composition.sources && composition.sources.length > 0 ? (
              composition.sources.map((source, i) => (
                <div
                  key={i}
                  className="p-2 rounded text-xs"
                  style={{ backgroundColor: 'var(--bg-tertiary)' }}
                >
                  <div style={{ color: 'var(--text-primary)' }} className="font-mono">
                    {source.name}
                  </div>
                  {source.url && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs hover:underline mt-1 block"
                      style={{ color: 'var(--accent-primary)' }}
                    >
                      {source.url}
                    </a>
                  )}
                  {source.notes && (
                    <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                      {source.notes}
                    </div>
                  )}
                  <div className="text-xs mt-1">
                    <ConfidenceBadge level={source.confidence} />
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--text-tertiary)' }}>
                No sources available
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
