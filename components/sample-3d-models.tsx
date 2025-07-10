"use client"

import { Suspense, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Html, Box, Cylinder } from "@react-three/drei"
import type * as THREE from "three"

interface ModelProps {
  modelType: "sofa" | "chair" | "table"
  dimensions?: string
  category?: string
  scale?: number
}

// Simple geometric models as fallbacks
function GeometricModel({ modelType, scale = 1 }: { modelType: "sofa" | "chair" | "table"; scale?: number }) {
  const meshRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  const getColor = (type: string) => {
    switch (type) {
      case "sofa":
        return "#8B4513" // Brown
      case "chair":
        return "#4A5568" // Gray
      case "table":
        return "#D69E2E" // Golden
      default:
        return "#4A5568"
    }
  }

  return (
    <group ref={meshRef} scale={scale}>
      {modelType === "sofa" && (
        <group>
          {/* Sofa base */}
          <Box args={[2, 0.3, 1]} position={[0, -0.5, 0]}>
            <meshStandardMaterial color={getColor("sofa")} />
          </Box>
          {/* Sofa back */}
          <Box args={[2, 1, 0.2]} position={[0, 0, -0.4]}>
            <meshStandardMaterial color={getColor("sofa")} />
          </Box>
          {/* Sofa arms */}
          <Box args={[0.2, 1, 1]} position={[-0.9, 0, 0]}>
            <meshStandardMaterial color={getColor("sofa")} />
          </Box>
          <Box args={[0.2, 1, 1]} position={[0.9, 0, 0]}>
            <meshStandardMaterial color={getColor("sofa")} />
          </Box>
        </group>
      )}

      {modelType === "chair" && (
        <group>
          {/* Chair seat */}
          <Box args={[0.8, 0.1, 0.8]} position={[0, -0.2, 0]}>
            <meshStandardMaterial color={getColor("chair")} />
          </Box>
          {/* Chair back */}
          <Box args={[0.8, 1.2, 0.1]} position={[0, 0.4, -0.35]}>
            <meshStandardMaterial color={getColor("chair")} />
          </Box>
          {/* Chair legs */}
          {[-0.3, 0.3].map((x) =>
            [-0.3, 0.3].map((z) => (
              <Cylinder key={`${x}-${z}`} args={[0.02, 0.02, 0.6]} position={[x, -0.5, z]}>
                <meshStandardMaterial color="#2D3748" />
              </Cylinder>
            )),
          )}
        </group>
      )}

      {modelType === "table" && (
        <group>
          {/* Table top */}
          <Cylinder args={[1, 1, 0.1]} position={[0, 0.3, 0]}>
            <meshStandardMaterial color={getColor("table")} />
          </Cylinder>
          {/* Table leg */}
          <Cylinder args={[0.05, 0.05, 0.6]} position={[0, -0.1, 0]}>
            <meshStandardMaterial color="#2D3748" />
          </Cylinder>
          {/* Table base */}
          <Cylinder args={[0.3, 0.3, 0.05]} position={[0, -0.4, 0]}>
            <meshStandardMaterial color="#2D3748" />
          </Cylinder>
        </group>
      )}
    </group>
  )
}

// Enhanced 3D viewer that only uses geometric models
function EnhancedGeometricViewer({ modelType, dimensions, category }: Sample3DViewerProps) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }} style={{ background: "transparent" }}>
      <ambientLight intensity={0.6} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} />

      <Suspense fallback={<LoadingSpinner />}>
        <GeometricModel modelType={modelType} scale={1} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} minDistance={2} maxDistance={10} />
        <Environment preset="studio" />
      </Suspense>
    </Canvas>
  )
}

function LoadingSpinner() {
  return (
    <Html center>
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
        <div className="text-sm text-gray-600">Loading 3D model...</div>
      </div>
    </Html>
  )
}

interface Sample3DViewerProps {
  modelType: "sofa" | "chair" | "table"
  modelUrl?: string
  dimensions?: string
  category?: string
  className?: string
}

export function Sample3DViewer({ modelType, modelUrl, dimensions, category, className = "" }: Sample3DViewerProps) {
  // Always use geometric models for reliability
  return (
    <div className={`w-full h-full ${className}`}>
      <EnhancedGeometricViewer modelType={modelType} dimensions={dimensions} category={category} />

      {/* Info overlay */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-sm">
        <div className="font-medium text-gray-800">3D Preview</div>
        <div className="text-gray-600">{modelType.charAt(0).toUpperCase() + modelType.slice(1)} visualization</div>
      </div>
    </div>
  )
}
