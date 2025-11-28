'use client'

import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useCompositionStore } from '@/stores'

interface ControlsState {
  spherical: THREE.Spherical
  target: THREE.Vector3
  targetTarget: THREE.Vector3
  isDragging: boolean
  isPanning: boolean
  lastMouseX: number
  lastMouseY: number
  isFocusing: boolean
}

// Simple orbit controls implementation with focus animation support
export function CameraControls() {
  const { camera, gl, scene } = useThree()
  const focusedNodeId = useCompositionStore((s) => s.focusedNodeId)
  const setFocusedNode = useCompositionStore((s) => s.setFocusedNode)

  const controlsRef = useRef<ControlsState>({
    spherical: new THREE.Spherical(8, Math.PI / 2, 0),
    target: new THREE.Vector3(0, 0, 0),
    targetTarget: new THREE.Vector3(0, 0, 0),
    isDragging: false,
    isPanning: false,
    lastMouseX: 0,
    lastMouseY: 0,
    isFocusing: false,
  })

  // Update camera position from spherical coordinates
  const updateCameraPosition = (controls: ControlsState) => {
    const position = new THREE.Vector3()
    position.setFromSpherical(controls.spherical)
    position.add(controls.target)
    camera.position.copy(position)
    camera.lookAt(controls.target)
  }

  // Find node position in scene by traversing the scene graph
  const findNodePosition = (nodeId: string): THREE.Vector3 | null => {
    let foundPosition: THREE.Vector3 | null = null

    scene.traverse((object) => {
      // Check if this object has userData with matching nodeId
      if (object.userData?.nodeId === nodeId && object instanceof THREE.Mesh) {
        foundPosition = new THREE.Vector3()
        object.getWorldPosition(foundPosition)
      }
    })

    return foundPosition
  }

  // Handle focus changes - when a node is focused, animate camera to it
  useEffect(() => {
    if (focusedNodeId) {
      const position = findNodePosition(focusedNodeId)
      if (position) {
        const controls = controlsRef.current
        controls.targetTarget.copy(position)
        controls.isFocusing = true
        // Zoom in a bit when focusing
        controls.spherical.radius = Math.min(controls.spherical.radius, 5)
      }
      // Clear the focused node after a short delay to allow re-focusing same node
      const timer = setTimeout(() => setFocusedNode(null), 100)
      return () => clearTimeout(timer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedNodeId, setFocusedNode])

  // Smooth camera animation every frame
  useFrame(() => {
    const controls = controlsRef.current
    if (controls.isFocusing) {
      // Smooth interpolation towards target
      controls.target.lerp(controls.targetTarget, 0.08)

      // Check if we're close enough to stop focusing
      if (controls.target.distanceTo(controls.targetTarget) < 0.01) {
        controls.target.copy(controls.targetTarget)
        controls.isFocusing = false
      }

      updateCameraPosition(controls)
    }
  })

  // Set up mouse event handlers for orbit controls
  useEffect(() => {
    const domElement = gl.domElement
    const controls = controlsRef.current

    updateCameraPosition(controls)

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        controls.isDragging = true
      } else if (e.button === 2) {
        controls.isPanning = true
      }
      controls.lastMouseX = e.clientX
      controls.lastMouseY = e.clientY
    }

    const handleMouseUp = () => {
      controls.isDragging = false
      controls.isPanning = false
    }

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - controls.lastMouseX
      const deltaY = e.clientY - controls.lastMouseY
      controls.lastMouseX = e.clientX
      controls.lastMouseY = e.clientY

      if (controls.isDragging) {
        // Rotate
        controls.spherical.theta -= deltaX * 0.01
        controls.spherical.phi += deltaY * 0.01
        // Clamp phi to prevent flipping
        controls.spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, controls.spherical.phi))
        updateCameraPosition(controls)
      } else if (controls.isPanning) {
        // Pan - also update targetTarget to keep them in sync
        const panSpeed = 0.01
        const right = new THREE.Vector3()
        const up = new THREE.Vector3()
        camera.matrix.extractBasis(right, up, new THREE.Vector3())
        controls.target.addScaledVector(right, -deltaX * panSpeed)
        controls.target.addScaledVector(up, deltaY * panSpeed)
        controls.targetTarget.copy(controls.target)
        updateCameraPosition(controls)
      }
    }

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const zoomSpeed = 0.001
      controls.spherical.radius *= 1 + e.deltaY * zoomSpeed
      // Clamp distance
      controls.spherical.radius = Math.max(2, Math.min(20, controls.spherical.radius))
      updateCameraPosition(controls)
    }

    const handleContextMenu = (e: Event) => {
      e.preventDefault()
    }

    domElement.addEventListener('mousedown', handleMouseDown)
    domElement.addEventListener('mouseup', handleMouseUp)
    domElement.addEventListener('mousemove', handleMouseMove)
    domElement.addEventListener('wheel', handleWheel, { passive: false })
    domElement.addEventListener('contextmenu', handleContextMenu)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      domElement.removeEventListener('mousedown', handleMouseDown)
      domElement.removeEventListener('mouseup', handleMouseUp)
      domElement.removeEventListener('mousemove', handleMouseMove)
      domElement.removeEventListener('wheel', handleWheel)
      domElement.removeEventListener('contextmenu', handleContextMenu)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera, gl])

  return null
}
