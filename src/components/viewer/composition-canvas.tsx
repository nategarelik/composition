'use client'

import dynamic from 'next/dynamic'

interface CompositionCanvasProps {
  className?: string
  debug?: boolean
}

// Dynamically import Canvas with SSR disabled
const DynamicCanvas = dynamic(
  () => import('@react-three/fiber').then((mod) => {
    const Canvas = mod.Canvas
    // Return a wrapper component
    return function CanvasWrapper({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) {
      return <Canvas {...props}>{children}</Canvas>
    }
  }),
  { ssr: false }
)

// Dynamically import the scene
const DynamicScene = dynamic(
  () => import('./composition-scene').then((mod) => mod.CompositionScene),
  { ssr: false }
)

export function CompositionCanvas({ className = '', debug = false }: CompositionCanvasProps) {
  return (
    <div className={`w-full h-full canvas-container ${className}`}>
      <DynamicCanvas
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        camera={{ position: [0, 0, 8], fov: 50 }}
      >
        <DynamicScene debug={debug} />
      </DynamicCanvas>
    </div>
  )
}
