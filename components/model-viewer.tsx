"use client"

import { Suspense, useRef, useState } from "react"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { OrbitControls, Environment, Html } from "@react-three/drei"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import type * as THREE from "three"
import { parseDimensions, calculateModelScale, getModelPosition, categoryScaling } from "@/lib/model-scaling"

interface ModelProps {
  url: string
  dimensions?: string
  category?: string
  scale?: number
}

function Model({ url, dimensions, category, scale }: ModelProps) {
  const meshRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  // Load the GLTF model
  const gltf = useLoader(GLTFLoader, url)

  // Calculate proper scaling based on dimensions
  const productDimensions = dimensions ? parseDimensions(dimensions) : { length: 100, width: 50, height: 75 }
  const categoryConfig = categoryScaling[category as keyof typeof categoryScaling] || categoryScaling["Living Room"]
  const calculatedScale = scale || calculateModelScale(productDimensions, categoryConfig.targetSize)
  const position = getModelPosition(productDimensions, calculatedScale)

  // Rotate the model slowly
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <group
      ref={meshRef}
      scale={calculatedScale}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <primitive object={gltf.scene} />
    </group>
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

function ErrorFallback() {
  return (
    <Html center>
      <div className="text-center">
        <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
          <span className="text-red-600 text-sm">!</span>
        </div>
        <div className="text-sm text-red-600">Failed to load 3D model</div>
      </div>
    </Html>
  )
}

interface ModelViewerProps {
  modelUrl: string
  dimensions?: string
  category?: string
  className?: string
}

export function ModelViewer({ modelUrl, dimensions, category, className = "" }: ModelViewerProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} style={{ background: "transparent" }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />

        <Suspense fallback={<LoadingSpinner />}>
          <Model url={modelUrl} dimensions={dimensions} category={category} />
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} minDistance={2} maxDistance={10} />
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  )
}
