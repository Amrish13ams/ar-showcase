"use client"

import { PublicLayout } from "@/components/layouts/public-layout"
import { ARPlatformTester } from "@/components/ar-platform-tester"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ARViewer } from "@/components/ar-experience"
import { useState } from "react"
import { Camera, Smartphone } from "lucide-react"

export default function ARTestPage() {
  const [isAROpen, setIsAROpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(1)

  const testProducts = [
    { id: 1, name: "Modern Sectional Sofa" },
    { id: 2, name: "Dining Table Set" },
    { id: 3, name: "Ergonomic Office Chair" },
    { id: 4, name: "Glass Coffee Table" },
    { id: 5, name: "Platform Bed Frame" },
  ]

  return (
    <PublicLayout shopName="FurniCraft">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AR Platform Testing</h1>
          <p className="text-gray-600">Test AR functionality across different devices and platforms</p>
        </div>

        {/* Platform Detection */}
        <div className="mb-8">
          <ARPlatformTester />
        </div>

        {/* AR Test Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Test AR with Sample Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {testProducts.map((product) => (
                <Button
                  key={product.id}
                  variant={selectedProduct === product.id ? "default" : "outline"}
                  onClick={() => setSelectedProduct(product.id)}
                  className="h-auto p-4 text-left justify-start"
                >
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-500">Product ID: {product.id}</div>
                  </div>
                </Button>
              ))}
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => setIsAROpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Test AR Experience
              </Button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Testing Instructions:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Select a product above</li>
                <li>• Click "Test AR Experience"</li>
                <li>• On mobile: Look for the AR button in the viewer</li>
                <li>• On desktop: Share the link to test on mobile</li>
                <li>• Check console for detailed platform detection logs</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* AR Viewer */}
        <ARViewer
          isOpen={isAROpen}
          onClose={() => setIsAROpen(false)}
          productName={testProducts.find((p) => p.id === selectedProduct)?.name || "Test Product"}
          productId={selectedProduct}
        />
      </div>
    </PublicLayout>
  )
}
