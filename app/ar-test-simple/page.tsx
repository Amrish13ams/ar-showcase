"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SimpleARModal } from "@/components/simple-ar-modal"

export default function ARTestSimplePage() {
  const [isARModalOpen, setIsARModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState({ id: 1, name: "Astronaut Model" })

  const openARModal = (product: { id: number; name: string }) => {
    setSelectedProduct(product)
    setIsARModalOpen(true)
  }

  const products = [
    { id: 1, name: "Astronaut Model", description: "A 3D model of an astronaut" },
    { id: 2, name: "Chair Model", description: "A 3D model of a chair" },
  ]

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Simple AR Test</h1>
        <p className="text-gray-600 mb-8 text-center">
          This is a simplified AR test page that uses the model-viewer component directly.
          <br />
          Click on any product to view it in AR.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 h-40 rounded-md flex items-center justify-center">
                  <span className="text-gray-500">Product #{product.id}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => openARModal(product)} className="w-full">
                  View in AR
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-10 p-6 bg-blue-50 rounded-lg border border-blue-100">
          <h2 className="text-xl font-semibold mb-4">Troubleshooting AR</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>On iOS, use Safari browser for AR to work properly</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>On Android, use Chrome browser for AR to work properly</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Make sure your device supports AR (ARKit for iOS, ARCore for Android)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Allow camera permissions when prompted</span>
            </li>
          </ul>
        </div>
      </div>

      <SimpleARModal
        isOpen={isARModalOpen}
        onClose={() => setIsARModalOpen(false)}
        productName={selectedProduct.name}
        productId={selectedProduct.id}
      />
    </div>
  )
}
