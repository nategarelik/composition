'use client';
import { useState } from 'react';
import { useUIStore } from '@/stores/ui-store';

const THEMES = [
  { id: 'cern', label: 'CERN', color: '#3b9eff' },
  { id: 'intel', label: 'Intel', color: '#6366f1' },
  { id: 'pharma', label: 'Pharma', color: '#0891b2' },
  { id: 'materials', label: 'Materials', color: '#f97316' },
] as const;

export function StatusBar() {
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);

  const currentTheme = THEMES.find((t) => t.id === theme) || THEMES[0];

  return (
    <header
      className="h-8 flex items-center justify-between px-3 text-xs font-mono select-none"
      style={{
        backgroundColor: 'var(--theme-bg-secondary)',
        borderBottom: '1px solid var(--theme-border)',
        color: 'var(--theme-text-secondary)',
      }}
    >
      {/* Left: System Status */}
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: 'var(--theme-confidence-verified)' }}
          />
          SYSTEM ONLINE
        </span>
        <span style={{ color: 'var(--theme-text-mono)' }}>
          v1.0.0
        </span>
      </div>

      {/* Center: Agent Activity */}
      <div className="flex items-center gap-2">
        <span>ANALYSIS ENGINE:</span>
        <span style={{ color: 'var(--theme-accent-primary)' }}>READY</span>
      </div>

      {/* Right: Theme Switcher + Settings */}
      <div className="flex items-center gap-3">
        {/* Theme Dropdown */}
        <div className="relative">
          <button
            onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
            className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/5 transition-colors"
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: currentTheme.color }}
            />
            <span>{currentTheme.label.toUpperCase()}</span>
            <span className="text-[10px]">▼</span>
          </button>

          {themeDropdownOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setThemeDropdownOpen(false)}
              />
              {/* Dropdown */}
              <div
                className="absolute right-0 top-full mt-1 z-50 min-w-[120px] rounded shadow-lg"
                style={{
                  backgroundColor: 'var(--theme-bg-tertiary)',
                  border: '1px solid var(--theme-border)',
                }}
              >
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setThemeDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/5 transition-colors text-left"
                    style={{
                      color: theme === t.id ? 'var(--theme-accent-primary)' : 'var(--theme-text-primary)',
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: t.color }}
                    />
                    <span>{t.label}</span>
                    {theme === t.id && <span className="ml-auto">✓</span>}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Settings button */}
        <button
          className="p-1 rounded hover:bg-white/5 transition-colors"
          title="Settings"
        >
          ⚙
        </button>
      </div>
    </header>
  );
}
