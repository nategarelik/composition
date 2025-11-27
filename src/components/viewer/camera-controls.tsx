'use client'

import { useRef, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Simple orbit controls implementation without drei
export function CameraControls() {
  const { camera, gl } = useThree()
  const controlsRef = useRef<{
    spherical: THREE.Spherical
    target: THREE.Vector3
    isDragging: boolean
    isPanning: boolean
    lastMouseX: number
    lastMouseY: number
  }>({
    spherical: new THREE.Spherical(8, Math.PI / 2, 0),
    target: new THREE.Vector3(0, 0, 0),
    isDragging: false,
    isPanning: false,
    lastMouseX: 0,
    lastMouseY: 0,
  })

  useEffect(() => {
    const domElement = gl.domElement
    const controls = controlsRef.current

    // Initialize camera position from spherical coordinates
    const updateCameraPosition = () => {
      const position = new THREE.Vector3()
      position.setFromSpherical(controls.spherical)
      position.add(controls.target)
      camera.position.copy(position)
      camera.lookAt(controls.target)
    }

    updateCameraPosition()

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
        updateCameraPosition()
      } else if (controls.isPanning) {
        // Pan
        const panSpeed = 0.01
        const right = new THREE.Vector3()
        const up = new THREE.Vector3()
        camera.matrix.extractBasis(right, up, new THREE.Vector3())
        controls.target.addScaledVector(right, -deltaX * panSpeed)
        controls.target.addScaledVector(up, deltaY * panSpeed)
        updateCameraPosition()
      }
    }

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const zoomSpeed = 0.001
      controls.spherical.radius *= 1 + e.deltaY * zoomSpeed
      // Clamp distance
      controls.spherical.radius = Math.max(2, Math.min(20, controls.spherical.radius))
      updateCameraPosition()
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
  }, [camera, gl])

  return null
}
