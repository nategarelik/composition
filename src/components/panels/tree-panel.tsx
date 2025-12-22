'use client';
import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useCompositionStore } from '@/stores';
import { TreeNodeRow } from './tree-node-row';
import type { CompositionNode } from '@/types/composition';

export function TreePanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const composition = useCompositionStore((s) => s.composition);
  const selectedNode = useCompositionStore((s) => s.selectedNode);
  const selectNode = useCompositionStore((s) => s.selectNode);
  const treeExpandedNodes = useCompositionStore((s) => s.treeExpandedNodes);
  const toggleTreeNode = useCompositionStore((s) => s.toggleTreeNode);
  const expandToNode = useCompositionStore((s) => s.expandToNode);

  const rootNode = composition?.root;

  // Flatten tree into navigable list (visible nodes only)
  const flattenedNodes = useMemo(() => {
    if (!rootNode) return [];

    const result: CompositionNode[] = [];
    const traverse = (node: CompositionNode) => {
      result.push(node);
      if (treeExpandedNodes.has(node.id) && node.children) {
        node.children.forEach(traverse);
      }
    };
    traverse(rootNode);
    return result;
  }, [rootNode, treeExpandedNodes]);

  // Filter nodes based on search (simple name matching)
  const filteredRoot = useMemo(() => {
    if (!rootNode || !searchQuery.trim()) return rootNode;
    // For MVP, just highlight matches - full filtering can come later
    return rootNode;
  }, [rootNode, searchQuery]);

  // Helper to find parent node
  const findParent = useCallback((root: CompositionNode | undefined, targetId: string): CompositionNode | null => {
    if (!root) return null;

    const search = (node: CompositionNode): CompositionNode | null => {
      if (node.children) {
        for (const child of node.children) {
          if (child.id === targetId) return node;
          const found = search(child);
          if (found) return found;
        }
      }
      return null;
    };

    return search(root);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle keyboard when tree panel is in focus
      if (!containerRef.current?.contains(document.activeElement)) {
        return;
      }

      if (!selectedNode || flattenedNodes.length === 0) return;

      const currentIndex = flattenedNodes.findIndex((n) => n.id === selectedNode.id);
      if (currentIndex === -1) return;

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          const nextIndex = Math.min(currentIndex + 1, flattenedNodes.length - 1);
          const nextNode = flattenedNodes[nextIndex];
          if (nextNode) {
            selectNode(nextNode);
            expandToNode(nextNode.id);
          }
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          const prevIndex = Math.max(currentIndex - 1, 0);
          const prevNode = flattenedNodes[prevIndex];
          if (prevNode) {
            selectNode(prevNode);
            expandToNode(prevNode.id);
          }
          break;
        }
        case 'ArrowRight': {
          e.preventDefault();
          if (selectedNode.children && selectedNode.children.length > 0) {
            if (!treeExpandedNodes.has(selectedNode.id)) {
              toggleTreeNode(selectedNode.id);
            } else {
              // Already expanded, move to first child
              const firstChild = selectedNode.children[0];
              if (firstChild) {
                selectNode(firstChild);
              }
            }
          }
          break;
        }
        case 'ArrowLeft': {
          e.preventDefault();
          if (treeExpandedNodes.has(selectedNode.id)) {
            // Collapse if expanded
            toggleTreeNode(selectedNode.id);
          } else {
            // Move to parent
            const parentNode = findParent(rootNode, selectedNode.id);
            if (parentNode) {
              selectNode(parentNode);
            }
          }
          break;
        }
        case 'Enter': {
          e.preventDefault();
          // Toggle expansion (for future camera focus feature)
          if (selectedNode.children && selectedNode.children.length > 0) {
            toggleTreeNode(selectedNode.id);
          }
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNode, flattenedNodes, treeExpandedNodes, selectNode, toggleTreeNode, expandToNode, rootNode, findParent]);

  return (
    <div ref={containerRef} className="h-full flex flex-col" tabIndex={0}>
      {/* Search Header */}
      <div
        className="p-3 border-b"
        style={{ borderColor: 'var(--theme-border)' }}
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 pl-8 pr-3 rounded text-sm font-mono focus:outline-none focus:ring-1"
            style={{
              backgroundColor: 'var(--theme-bg-tertiary)',
              color: 'var(--theme-text-primary)',
              borderColor: 'var(--theme-border)',
              border: '1px solid var(--theme-border)',
            }}
          />
          <span
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm"
            style={{ color: 'var(--theme-text-secondary)' }}
          >
            🔍
          </span>
        </div>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto py-1">
        {filteredRoot ? (
          <TreeNodeRow
            node={filteredRoot}
            depth={0}
            searchQuery={searchQuery}
          />
        ) : (
          <div
            className="p-4 text-center text-sm"
            style={{ color: 'var(--theme-text-secondary)' }}
          >
            No composition loaded.
            <br />
            <span style={{ color: 'var(--theme-text-mono)' }}>
              Search for something to analyze.
            </span>
          </div>
        )}
      </div>

      {/* Legend */}
      <div
        className="p-3 border-t text-xs font-mono"
        style={{
          borderColor: 'var(--theme-border)',
          color: 'var(--theme-text-secondary)',
        }}
      >
        <div className="flex flex-wrap gap-3">
          <span className="flex items-center gap-1">
            <span style={{ color: 'var(--theme-confidence-verified)' }}>●</span> Verified
          </span>
          <span className="flex items-center gap-1">
            <span style={{ color: 'var(--theme-confidence-estimated)' }}>●</span> Estimated
          </span>
          <span className="flex items-center gap-1">
            <span style={{ color: 'var(--theme-confidence-speculative)' }}>●</span> Speculative
          </span>
        </div>
      </div>
    </div>
  );
}
