# Viewer V1 - Archived Components

This directory contains the original viewer implementation from the MVP phase.

## Files
- **camera-controls.tsx** - Three.js camera control utilities
- **composition-canvas.tsx** - Main 3D canvas wrapper with WebGL error handling
- **composition-scene.tsx** - Scene setup and hierarchy export
- **composition-tree.tsx** - Tree-to-3D object mapping
- **hybrid-node.tsx** - Adaptive rendering (molecular or procedural)
- **instanced-molecular-node.tsx** - Performance-optimized molecular structure
- **keyboard-shortcuts-overlay.tsx** - Keyboard interaction display
- **molecular-node.tsx** - Molecular visualization with spheres
- **node-tooltip.tsx** - Hover tooltips for nodes
- **procedural-node.tsx** - Procedurally generated geometric shapes
- **stars-background.tsx** - Background starfield
- **viewer-controls.tsx** - UI controls for viewer modes
- **index.ts** - Barrel exports

## Why Archived

This implementation was replaced with the new **Clinical Lab Terminal** architecture, which features:
- Mission control-inspired dashboard
- 3D design software-like controls (Blender/Figma style)
- Research terminal aesthetic
- Unified workstation layout

## Reference

These components can be referenced for:
- Three.js patterns and utilities
- React Three Fiber integration examples
- Camera control implementations
- Performance optimization techniques (instanced rendering)
