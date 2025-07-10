"use client"

import { useState, useEffect } from "react"
import { PublicLayout } from "@/components/layouts/public-layout"
import { WorkingARViewer } from "@/components/working-ar-viewer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, Smartphone, Monitor } from "lucide-react"

export default function ARDebugPage() {
  const [isAROpen, setIsAROpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(1)
  const [deviceInfo, setDeviceInfo] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  const testProducts = [
    { id: 1, name: "Astronaut (Test Model)", description: "Working GLB/USDZ model" },
    { id: 2, name: "Chair (Test Model)", description: "Furniture test model" },
    { id: 3, name: "Shishkebab (Test Model)", description: "Complex geometry test" },
  ]

  useEffect(() => {
    setMounted(true)

    // Only run device detection on client side
    if (typeof window !== "undefined") {
      const userAgent = navigator.userAgent.toLowerCase()
      const isIOS = /iphone|ipad|ipod/.test(userAgent)
      const isAndroid = /android/.test(userAgent)
      const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent)
      const isChrome = /chrome/.test(userAgent)
      const isMobile = isIOS || isAndroid

      setDeviceInfo({
        isIOS,
        isAndroid,
        isSafari,
        isChrome,
        isMobile,
        arSupported: (isIOS && isSafari) || (isAndroid && isChrome),
      })
    }
  }, [])

  // Don't render device-specific content until mounted
  if (!mounted) {
    return (
      <PublicLayout shopName="FurniCraft">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AR Debug & Testing</h1>
            <p className="text-gray-600">Loading device information...</p>
          </div>
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg mb-6"></div>
            <div className="h-48 bg-gray-200 rounded-lg mb-6"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout shopName="FurniCraft">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AR Debug & Testing</h1>
          <p className="text-gray-600">Test AR functionality with working models</p>
        </div>

        {/* Device Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {deviceInfo?.isMobile ? <Smartphone className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
              Device Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-600">Platform</div>
                <Badge variant="outline">
                  {deviceInfo?.isIOS ? "iOS" : deviceInfo?.isAndroid ? "Android" : "Desktop"}
                </Badge>
              </div>
              <div>
                <div className="text-sm text-gray-600">Browser</div>
                <Badge variant="outline">
                  {deviceInfo?.isSafari ? "Safari" : deviceInfo?.isChrome ? "Chrome" : "Other"}
                </Badge>
              </div>
              <div>
                <div className="text-sm text-gray-600">AR Support</div>
                <Badge variant={deviceInfo?.arSupported ? "default" : "secondary"}>
                  {deviceInfo?.arSupported ? "✅ Supported" : "❌ Not Supported"}
                </Badge>
              </div>
              <div>
                <div className="text-sm text-gray-600">Touch</div>
                <Badge variant="outline">
                  {typeof window !== "undefined" && "ontouchstart" in window ? "✅ Yes" : "❌ No"}
                </Badge>
              </div>
            </div>

            {!deviceInfo?.arSupported && deviceInfo?.isMobile && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>AR Not Available:</strong>{" "}
                  {deviceInfo?.isIOS
                    ? "Please use Safari browser for AR support on iOS"
                    : deviceInfo?.isAndroid
                      ? "Please use Chrome browser for AR support on Android"
                      : "AR requires Safari (iOS) or Chrome (Android)"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test Products */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test AR Models</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 mb-6">
              {testProducts.map((product) => (
                <div
                  key={product.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedProduct === product.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedProduct(product.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.description}</p>
                    </div>
                    <Badge variant={selectedProduct === product.id ? "default" : "outline"}>
                      {selectedProduct === product.id ? "Selected" : "Select"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={() => setIsAROpen(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              size="lg"
            >
              <Camera className="h-5 w-5 mr-2" />
              Test AR Experience
            </Button>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">📱 Mobile Testing (Recommended):</h4>
                <ol className="list-decimal list-inside text-sm space-y-1 text-gray-700">
                  <li>Use Safari on iOS or Chrome on Android</li>
                  <li>Select a test model above</li>
                  <li>Click "Test AR Experience"</li>
                  <li>Look for the "View in AR" button in the 3D viewer</li>
                  <li>Tap it to launch AR mode</li>
                  <li>Allow camera access when prompted</li>
                  <li>Point camera at floor and tap to place</li>
                </ol>
              </div>

              <div>
                <h4 className="font-medium mb-2">💻 Desktop Testing:</h4>
                <ol className="list-decimal list-inside text-sm space-y-1 text-gray-700">
                  <li>View 3D model with mouse controls</li>
                  <li>Share page URL to mobile device</li>
                  <li>Open shared link on mobile for AR</li>
                </ol>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Debug Tip:</strong> Open browser developer tools (F12) and check the console for detailed AR
                  status messages.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AR Viewer */}
        {mounted && (
          <WorkingARViewer
            isOpen={isAROpen}
            onClose={() => setIsAROpen(false)}
            productName={testProducts.find((p) => p.id === selectedProduct)?.name || "Test Product"}
            productId={selectedProduct}
          />
        )}
      </div>
    </PublicLayout>
  )
}
