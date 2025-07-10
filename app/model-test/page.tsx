"use client"

import { useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import {
  OrbitControls,
  PresentationControls,
  Environment,
  useGLTF,
} from "@react-three/drei"
import { Button } from "@/components/ui/button"
import {
  parseDimensions,
  calculateModelScale,
  getModelPosition,
} from "@/lib/model-scaling"

function DiningTableModel({ onLoad }: { onLoad: () => void }) {
  const { scene } = useGLTF("/models/free_wooden_round_dining_table.glb", true)

  // Notify parent after load
  useEffect(() => {
    if (scene) onLoad?.()
  }, [scene, onLoad])

  const dimensions = parseDimensions("180 × 90 × 75 cm")
  const scale = calculateModelScale(dimensions, 2.0)
  const position = getModelPosition(dimensions, scale)

  return <primitive object={scene} scale={scale} position={position} />
}

export default function ModelTestPage() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">
        3D Model Test: Wooden Round Dining Table
      </h1>

      <div className="bg-gray-50 rounded-lg border overflow-hidden">
        <div className="h-[500px] relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-80 z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-700">Loading 3D Model...</p>
              </div>
            </div>
          )}

          <Canvas>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <PresentationControls
              global
              rotation={[0, -Math.PI / 4, 0]}
              polar={[-Math.PI / 4, Math.PI / 4]}
              azimuth={[-Math.PI / 4, Math.PI / 4]}
            >
              <DiningTableModel onLoad={() => setIsLoading(false)} />
            </PresentationControls>
            <OrbitControls />
            <Environment preset="apartment" />
          </Canvas>
        </div>

        <div className="p-4 border-t bg-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-semibold">Wooden Round Dining Table</h2>
              <p className="text-sm text-gray-500">3D Model Preview</p>
            </div>
            <Button asChild>
              <a href="/products/2">View Product</a>
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="font-semibold text-blue-800 mb-2">About This Model</h3>
        <p className="text-blue-700">
          This is a 3D model of a wooden round dining table. You can interact
          with it by:
        </p>
        <ul className="mt-2 space-y-1 text-blue-700 text-sm">
          <li>• Click and drag to rotate the model</li>
          <li>• Scroll to zoom in and out</li>
          <li>• Right-click and drag to pan</li>
        </ul>
      </div>
    </div>
  )
}
