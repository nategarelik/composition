"use client";

import { Component, type ReactNode } from "react";
import dynamic from "next/dynamic";

interface CompositionCanvasProps {
  className?: string;
  debug?: boolean;
}

// Error boundary for WebGL/Three.js errors
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class WebGLErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-900">
          <div className="text-center p-8 max-w-md">
            <div className="text-red-400 text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-white mb-2">
              3D Viewer Error
            </h2>
            <p className="text-gray-400 mb-4">
              {this.state.error?.message?.includes("WebGL")
                ? "Your browser or device does not support WebGL, which is required for the 3D viewer."
                : "An error occurred while loading the 3D viewer."}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Check for WebGL support
function checkWebGLSupport(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

// Dynamically import Canvas with SSR disabled
const DynamicCanvas = dynamic(
  () =>
    import("@react-three/fiber").then((mod) => {
      const Canvas = mod.Canvas;
      // Return a wrapper component
      return function CanvasWrapper({
        children,
        ...props
      }: { children?: React.ReactNode } & Record<string, unknown>) {
        return <Canvas {...props}>{children}</Canvas>;
      };
    }),
  { ssr: false },
);

// Dynamically import the scene
const DynamicScene = dynamic(
  () => import("./composition-scene").then((mod) => mod.CompositionScene),
  { ssr: false },
);

export function CompositionCanvas({
  className = "",
  debug = false,
}: CompositionCanvasProps) {
  // Check for WebGL support on client
  if (typeof window !== "undefined" && !checkWebGLSupport()) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center bg-gray-900 ${className}`}
      >
        <div className="text-center p-8 max-w-md">
          <div className="text-yellow-400 text-4xl mb-4">🖥️</div>
          <h2 className="text-xl font-semibold text-white mb-2">
            WebGL Not Supported
          </h2>
          <p className="text-gray-400">
            Your browser or device does not support WebGL, which is required for
            the interactive 3D visualization. Please try a different browser or
            device.
          </p>
        </div>
      </div>
    );
  }

  return (
    <WebGLErrorBoundary>
      <div className={`w-full h-full canvas-container ${className}`}>
        <DynamicCanvas
          shadows
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
          }}
          camera={{ position: [0, 0, 8], fov: 50 }}
        >
          <DynamicScene debug={debug} />
        </DynamicCanvas>
      </div>
    </WebGLErrorBoundary>
  );
}
