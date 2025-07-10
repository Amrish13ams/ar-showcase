"use client"

import { useState, useEffect } from "react"
import { ModelViewerAR } from "@/components/model-viewer-ar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Smartphone, Monitor, Loader2 } from "lucide-react"

export default function ModelViewerTestPage() {
  const [isAROpen, setIsAROpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(1)
  const [mounted, setMounted] = useState(false)
  const [deviceInfo, setDeviceInfo] = useState<any>(null)

  const testProducts = [
    { id: 1, name: "Astronaut", description: "Space suit model (working GLB/USDZ)" },
    { id: 2, name: "Chair", description: "Furniture model (working GLB/USDZ)" },
    { id: 3, name: "Shishkebab", description: "Food model (working GLB/USDZ)" },
    { id: 4, name: "Sphere", description: "Reflective sphere (working GLB/USDZ)" },
  ]

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true)

    // Device detection - only run on client
    if (typeof window !== "undefined") {
      const userAgent = navigator.userAgent
      const isIOS = /iPad|iPhone|iPod/.test(userAgent)
      const isAndroid = /Android/.test(userAgent)
      const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent)
      const isChrome = /Chrome/.test(userAgent)
      const isMobile = isIOS || isAndroid
      const hasTouch = "ontouchstart" in window
      const arSupported = (isIOS && isSafari) || (isAndroid && isChrome)

      setDeviceInfo({
        isIOS,
        isAndroid,
        isSafari,
        isChrome,
        isMobile,
        hasTouch,
        arSupported,
        userAgent: userAgent.substring(0, 100),
      })
    }
  }, [])

  // Show loading state during SSR and initial hydration
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse" />
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading Device Information...
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i}>
                    <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse" />
                    <div className="h-6 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Model-Viewer AR Test</h1>
          <p className="text-gray-600">Testing AR with Google's model-viewer component</p>
        </div>

        {/* Device Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {deviceInfo?.isMobile ? <Smartphone className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
              Device Compatibility
            </CardTitle>
          </CardHeader>
          <CardContent>
            {deviceInfo ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-600">Platform</div>
                    <Badge variant="outline">
                      {deviceInfo.isIOS ? "iOS" : deviceInfo.isAndroid ? "Android" : "Desktop"}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Browser</div>
                    <Badge variant="outline">
                      {deviceInfo.isSafari ? "Safari" : deviceInfo.isChrome ? "Chrome" : "Other"}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">AR Support</div>
                    <Badge variant={deviceInfo.arSupported ? "default" : "secondary"}>
                      {deviceInfo.arSupported ? "✅ Supported" : "❌ Not Supported"}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Touch</div>
                    <Badge variant="outline">{deviceInfo.hasTouch ? "✅ Yes" : "❌ No"}</Badge>
                  </div>
                </div>

                {!deviceInfo.arSupported && deviceInfo.isMobile && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>⚠️ AR Not Available:</strong>{" "}
                      {deviceInfo.isIOS
                        ? "Please use Safari browser for AR support on iOS"
                        : deviceInfo.isAndroid
                          ? "Please use Chrome browser for AR support on Android"
                          : "AR requires Safari (iOS) or Chrome (Android)"}
                    </p>
                  </div>
                )}

                {deviceInfo.arSupported && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>✅ AR Ready!</strong> Your device supports AR experiences.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p className="text-gray-600">Detecting device capabilities...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test Models */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Test Model</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 mb-6">
              {testProducts.map((product) => (
                <div
                  key={product.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedProduct === product.id
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
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
              disabled={!deviceInfo}
            >
              <Camera className="h-5 w-5 mr-2" />
              {deviceInfo ? "Open Model-Viewer AR" : "Loading..."}
            </Button>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Test AR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">📱 Mobile Testing (Required for AR):</h4>
                <ol className="list-decimal list-inside text-sm space-y-1 text-gray-700">
                  <li>Ensure you're using Safari (iOS) or Chrome (Android)</li>
                  <li>Select a test model above</li>
                  <li>Click "Open Model-Viewer AR"</li>
                  <li>Wait for the 3D model to load</li>
                  <li>Look for the blue "📱 View in AR" button</li>
                  <li>Tap the AR button to launch AR mode</li>
                  <li>Allow camera access when prompted</li>
                  <li>Point camera at a flat surface (floor/table)</li>
                  <li>Tap to place the 3D model</li>
                </ol>
              </div>

              <div>
                <h4 className="font-medium mb-2">💻 Desktop Testing:</h4>
                <ol className="list-decimal list-inside text-sm space-y-1 text-gray-700">
                  <li>View and interact with 3D model using mouse</li>
                  <li>Share page URL to mobile device for AR testing</li>
                  <li>AR button will not appear on desktop</li>
                </ol>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>💡 Debug Tip:</strong> Open browser developer tools (F12) and check the console for detailed
                  model-viewer status messages and AR debugging information.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Model Viewer AR Component */}
        {deviceInfo && (
          <ModelViewerAR
            isOpen={isAROpen}
            onClose={() => setIsAROpen(false)}
            productName={testProducts.find((p) => p.id === selectedProduct)?.name || "Test Model"}
            productId={selectedProduct}
          />
        )}
      </div>
    </div>
  )
}
