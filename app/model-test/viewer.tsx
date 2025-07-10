"use client"

import { useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, PresentationControls, Environment, useGLTF } from "@react-three/drei"
import { parseDimensions, calculateModelScale, getModelPosition } from "@/lib/model-scaling"
import { Button } from "@/components/ui/button"

function DiningTableModel({ onLoad }: { onLoad: () => void }) {
  const { scene } = useGLTF("/models/free_wooden_round_dining_table.glb")

  const dimensions = parseDimensions("180 × 90 × 75 cm")
  const scale = calculateModelScale(dimensions, 2.0)
  const position = getModelPosition(dimensions, scale)

  useState(() => {
    if (scene) onLoad()
  })

  return <primitive object={scene} scale={scale} position={position} />
}

export default function ModelViewer() {
  const [isLoading, setIsLoading] = useState(true)

  return (
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
  )
}
