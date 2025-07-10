"use client"
export const dynamic = "force-dynamic" // Disable static generation

import dynamic from "next/dynamic"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { sampleProducts } from "@/lib/sample-data"

// Dynamically load ARViewer to avoid SSR issues
const ARViewer = dynamic(() => import("@/components/ar-viewer"), { ssr: false })

export default function TestProductPage() {
  const [isAROpen, setIsAROpen] = useState(false)

  const diningTable = sampleProducts?.find((p) => p.id === 2) || sampleProducts?.[0]

  if (!diningTable) {
    return (
      <div className="p-8 text-red-600 font-semibold">
        Product not found.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Product Page</h1>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">{diningTable.name}</h2>
          <p className="text-gray-600 mb-4">{diningTable.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div><strong>Dimensions:</strong> {diningTable.dimensions}</div>
            <div><strong>Category:</strong> {diningTable.category}</div>
            <div><strong>Material:</strong> {diningTable.material}</div>
            <div><strong>AR Model:</strong> {diningTable.arModel}</div>
          </div>

          <Button onClick={() => setIsAROpen(true)} className="bg-blue-600 hover:bg-blue-700">
            Test AR Viewer
          </Button>
        </div>

        <ARViewer
          isOpen={isAROpen}
          onClose={() => setIsAROpen(false)}
          productName={diningTable.name}
          modelUrl={diningTable.arModel}
          productId={diningTable.id}
          dimensions={diningTable.dimensions}
          category={diningTable.category}
        />
      </div>
    </div>
  )
}
