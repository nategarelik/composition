"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// SVG Component for the detector rings
function DetectorRings({ isActive }: { isActive: boolean }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer rings - wire chamber aesthetic */}
      {[160, 140, 120, 100, 80].map((r, i) => (
        <circle
          key={`ring-${i}`}
          cx="200"
          cy="200"
          r={r}
          stroke="var(--wire-dim)"
          strokeWidth="1"
          fill="none"
          opacity={0.5 - i * 0.08}
        />
      ))}

      {/* Sector lines - like detector segments */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x1 = 200 + 60 * Math.cos(angle);
        const y1 = 200 + 60 * Math.sin(angle);
        const x2 = 200 + 165 * Math.cos(angle);
        const y2 = 200 + 165 * Math.sin(angle);
        return (
          <line
            key={`sector-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="var(--wire-dim)"
            strokeWidth="1"
            opacity="0.3"
          />
        );
      })}

      {/* Active scanning indicator */}
      {isActive && (
        <g className="animate-detector-scan" style={{ transformOrigin: '200px 200px' }}>
          <line
            x1="200"
            y1="200"
            x2="200"
            y2="40"
            stroke="var(--particle-cyan)"
            strokeWidth="2"
            opacity="0.6"
          />
          <circle
            cx="200"
            cy="60"
            r="4"
            fill="var(--particle-cyan)"
            className="animate-glow-pulse"
          />
        </g>
      )}

      {/* Center collision point */}
      <circle
        cx="200"
        cy="200"
        r="8"
        fill={isActive ? "var(--particle-cyan)" : "var(--wire-bright)"}
        className={isActive ? "animate-glow-pulse" : ""}
      />
      <circle
        cx="200"
        cy="200"
        r="16"
        stroke={isActive ? "var(--particle-cyan)" : "var(--wire-dim)"}
        strokeWidth="1"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
}

// Particle trace animation component
function ParticleTraces({ isActive }: { isActive: boolean }) {
  if (!isActive) return null;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 400 400"
      fill="none"
    >
      {/* Simulated particle tracks radiating from center */}
      {[
        { angle: 30, color: "var(--particle-gold)", length: 120 },
        { angle: 75, color: "var(--particle-cyan)", length: 100 },
        { angle: 150, color: "var(--particle-magenta)", length: 90 },
        { angle: 210, color: "var(--particle-green)", length: 110 },
        { angle: 280, color: "var(--particle-cyan)", length: 85 },
        { angle: 330, color: "var(--particle-orange)", length: 95 },
      ].map((track, i) => {
        const rad = (track.angle * Math.PI) / 180;
        const x2 = 200 + track.length * Math.cos(rad);
        const y2 = 200 + track.length * Math.sin(rad);
        return (
          <line
            key={`track-${i}`}
            x1="200"
            y1="200"
            x2={x2}
            y2={y2}
            stroke={track.color}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.7"
            style={{
              animation: `particle-trace 1.5s ease-out ${i * 0.1}s infinite`,
              strokeDasharray: "100",
              strokeDashoffset: "100",
            }}
          />
        );
      })}
    </svg>
  );
}

// Readout display component
function ReadoutDisplay({
  label,
  value,
  unit,
  color = "cyan"
}: {
  label: string;
  value: string | number;
  unit?: string;
  color?: "cyan" | "gold" | "green" | "orange";
}) {
  const colorClass = {
    cyan: "particle-cyan",
    gold: "particle-gold",
    green: "particle-green",
    orange: "particle-orange",
  }[color];

  return (
    <div className="flex flex-col gap-1">
      <span className="label-detector">{label}</span>
      <div className="font-data text-lg tabular-nums">
        <span className={colorClass}>{value}</span>
        {unit && <span className="text-[var(--text-tertiary)] text-sm ml-1">{unit}</span>}
      </div>
    </div>
  );
}

// Recent analysis item
function RecentItem({
  name,
  timestamp,
  nodeCount,
  onClick
}: {
  name: string;
  timestamp: string;
  nodeCount: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-md
                 bg-[var(--void-tertiary)] border border-[var(--border-wire)]
                 hover:border-[var(--particle-cyan)] hover:bg-[var(--void-elevated)]
                 transition-all duration-150 group text-left"
    >
      <div className="w-2 h-2 rounded-full bg-[var(--particle-cyan)]
                      group-hover:shadow-[0_0_8px_var(--particle-cyan)]" />
      <div className="flex-1 min-w-0">
        <div className="font-mono text-sm text-[var(--text-bright)] truncate">
          {name}
        </div>
        <div className="font-data text-xs text-[var(--text-tertiary)]">
          {nodeCount} nodes · {timestamp}
        </div>
      </div>
      <svg
        className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--particle-cyan)]
                   transform group-hover:translate-x-1 transition-all"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}

// Quick specimen button
function QuickSpecimen({ name, onClick }: { name: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="specimen-tag"
    >
      {name}
    </button>
  );
}

export function AnalysisTerminal() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    connected: false,
    model: "Claude Sonnet 4.5",
    cached: 0,
    uptime: "00:00:00",
  });

  // Check API status
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch("/api/health");
        setSystemStatus(prev => ({ ...prev, connected: response.ok }));
      } catch {
        setSystemStatus(prev => ({ ...prev, connected: false }));
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Uptime counter
  useEffect(() => {
    const start = Date.now();
    const updateUptime = () => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const hours = String(Math.floor(elapsed / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
      const seconds = String(elapsed % 60).padStart(2, '0');
      setSystemStatus(prev => ({ ...prev, uptime: `${hours}:${minutes}:${seconds}` }));
    };
    const interval = setInterval(updateUptime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAnalyze = async (searchQuery: string) => {
    if (!searchQuery.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery.trim() }),
      });

      const data = await response.json();
      if (response.ok && data.success && data.data?.composition?.id) {
        router.push(`/composition/${data.data.composition.id}`);
      } else {
        console.error("Analysis failed:", data.error?.message);
        setIsAnalyzing(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setIsAnalyzing(false);
    }
  };

  const quickSpecimens = [
    "iPhone 15 Pro",
    "Coca-Cola",
    "Human Blood",
    "Concrete",
    "Aspirin",
    "Solar Panel",
  ];

  const recentAnalyses = [
    { id: "1", name: "iPhone 15 Pro", timestamp: "2h ago", nodeCount: 142 },
    { id: "2", name: "Lithium Battery", timestamp: "5h ago", nodeCount: 87 },
    { id: "3", name: "Human DNA", timestamp: "1d ago", nodeCount: 234 },
  ];

  return (
    <div className="min-h-screen detector-bg overflow-hidden">
      {/* Header bar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-[var(--border-wire)]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`status-indicator ${systemStatus.connected ? 'status-active' : 'status-error'}`} />
            <span className="font-mono text-xs text-[var(--text-tertiary)] uppercase tracking-wider">
              {systemStatus.connected ? 'Online' : 'Offline'}
            </span>
          </div>
          <div className="h-4 w-px bg-[var(--border-wire)]" />
          <span className="font-data text-xs text-[var(--text-tertiary)]">
            SESSION {systemStatus.uptime}
          </span>
        </div>

        <h1 className="font-display text-lg font-semibold text-[var(--text-bright)] tracking-wide">
          COMPOSITION
        </h1>

        <div className="flex items-center gap-4">
          <span className="font-data text-xs text-[var(--text-tertiary)]">
            v1.0.0
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
        {/* Left panel - Detector visualization */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="relative w-full max-w-[400px] aspect-square">
            {/* Detector rings SVG */}
            <DetectorRings isActive={isAnalyzing} />
            <ParticleTraces isActive={isAnalyzing} />

            {/* Center input area */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[200px] text-center">
                <form
                  onSubmit={(e) => { e.preventDefault(); handleAnalyze(query); }}
                  className="space-y-4"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter specimen..."
                    disabled={isAnalyzing}
                    className="w-full bg-transparent border-b-2 border-[var(--wire-bright)]
                               text-center font-mono text-base text-[var(--text-bright)]
                               placeholder:text-[var(--text-tertiary)]
                               focus:border-[var(--particle-cyan)] focus:outline-none
                               disabled:opacity-50 transition-colors py-2"
                    autoFocus
                  />

                  <button
                    type="submit"
                    disabled={!query.trim() || isAnalyzing}
                    className="btn-detector btn-detector-primary w-full"
                  >
                    {isAnalyzing ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Analyzing
                      </span>
                    ) : (
                      "Analyze"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel - Data readouts */}
        <aside className="w-full lg:w-[360px] border-l border-[var(--border-wire)]
                         bg-[var(--void-secondary)]/80 backdrop-blur-sm p-6 space-y-6">
          {/* System readouts */}
          <section>
            <h2 className="label-detector mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--particle-cyan)]" />
              System Readouts
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <ReadoutDisplay
                label="Model"
                value="Claude"
                color="gold"
              />
              <ReadoutDisplay
                label="Cached"
                value={systemStatus.cached}
                unit="items"
                color="cyan"
              />
              <ReadoutDisplay
                label="Latency"
                value="~2.4"
                unit="s"
                color="green"
              />
              <ReadoutDisplay
                label="Accuracy"
                value="94.2"
                unit="%"
                color="gold"
              />
            </div>
          </section>

          {/* Quick specimens */}
          <section>
            <h2 className="label-detector mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--particle-gold)]" />
              Quick Specimens
            </h2>
            <div className="flex flex-wrap gap-2">
              {quickSpecimens.map((name) => (
                <QuickSpecimen
                  key={name}
                  name={name}
                  onClick={() => {
                    setQuery(name);
                    inputRef.current?.focus();
                  }}
                />
              ))}
            </div>
          </section>

          {/* Recent analyses */}
          <section>
            <h2 className="label-detector mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--particle-green)]" />
              Recent Analyses
            </h2>
            <div className="space-y-2">
              {recentAnalyses.map((item, i) => (
                <div
                  key={item.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}
                >
                  <RecentItem
                    name={item.name}
                    timestamp={item.timestamp}
                    nodeCount={item.nodeCount}
                    onClick={() => router.push(`/composition/${item.id}`)}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Info footer */}
          <div className="pt-4 border-t border-[var(--border-wire)]">
            <p className="font-data text-xs text-[var(--text-tertiary)] leading-relaxed">
              Composition deconstructs anything into its constituent parts:
              products → components → materials → chemicals → elements.
            </p>
          </div>
        </aside>
      </main>

      {/* Decorative corner brackets */}
      <div className="fixed top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[var(--wire-dim)] pointer-events-none" />
      <div className="fixed top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-[var(--wire-dim)] pointer-events-none" />
      <div className="fixed bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-[var(--wire-dim)] pointer-events-none" />
      <div className="fixed bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-[var(--wire-dim)] pointer-events-none" />
    </div>
  );
}
