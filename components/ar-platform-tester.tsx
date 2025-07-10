"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Monitor, Camera, CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface PlatformInfo {
  platform: string
  browser: string
  arSupport: boolean
  arPlatform: string
  capabilities: string[]
  recommendations: string[]
}

export function ARPlatformTester() {
  const [platformInfo, setPlatformInfo] = useState<PlatformInfo | null>(null)
  const [isTestingAR, setIsTestingAR] = useState(false)

  useEffect(() => {
    const detectPlatform = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isIOS = /iphone|ipad|ipod/.test(userAgent)
      const isAndroid = /android/.test(userAgent)
      const isChrome = /chrome/.test(userAgent)
      const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent)
      const isFirefox = /firefox/.test(userAgent)
      const isEdge = /edge/.test(userAgent)

      let platform = "Desktop"
      let browser = "Unknown"
      let arSupport = false
      let arPlatform = "None"
      let capabilities: string[] = []
      const recommendations: string[] = []

      // Detect platform
      if (isIOS) {
        platform = "iOS"
        arSupport = isSafari
        arPlatform = "ARKit + Quick Look"
        capabilities = ["ARKit", "Quick Look", "USDZ Models", "Object Placement"]
        if (isSafari) {
          recommendations.push("✅ Perfect! Safari supports full AR experience")
        } else {
          recommendations.push("⚠️ Use Safari for best AR experience on iOS")
        }
      } else if (isAndroid) {
        platform = "Android"
        arSupport = isChrome
        arPlatform = "ARCore + Scene Viewer"
        capabilities = ["ARCore", "Scene Viewer", "GLB Models", "Surface Detection"]
        if (isChrome) {
          recommendations.push("✅ Perfect! Chrome supports full AR experience")
        } else {
          recommendations.push("⚠️ Use Chrome for best AR experience on Android")
        }
      } else {
        platform = "Desktop"
        arSupport = false
        arPlatform = "3D View Only"
        capabilities = ["3D Model Viewing", "Rotation", "Zoom", "Pan"]
        recommendations.push("📱 Open on mobile device for AR experience")
      }

      // Detect browser
      if (isChrome) browser = "Chrome"
      else if (isSafari) browser = "Safari"
      else if (isFirefox) browser = "Firefox"
      else if (isEdge) browser = "Edge"

      // Additional capability checks
      if ("xr" in navigator) {
        capabilities.push("WebXR Support")
      }
      if ("ontouchstart" in window) {
        capabilities.push("Touch Support")
      }
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        capabilities.push("Camera Access")
      }

      setPlatformInfo({
        platform,
        browser,
        arSupport,
        arPlatform,
        capabilities,
        recommendations,
      })
    }

    detectPlatform()
  }, [])

  const testARCapability = async () => {
    setIsTestingAR(true)

    try {
      // Test camera access
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        stream.getTracks().forEach((track) => track.stop())
        console.log("✅ Camera access successful")
      }

      // Test WebXR if available
      if ("xr" in navigator && navigator.xr) {
        const isSupported = await navigator.xr.isSessionSupported("immersive-ar")
        console.log("WebXR AR Support:", isSupported)
      }
    } catch (error) {
      console.error("AR capability test failed:", error)
    } finally {
      setIsTestingAR(false)
    }
  }

  if (!platformInfo) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Detecting platform...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Platform Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {platformInfo.platform === "Desktop" ? <Monitor className="h-5 w-5" /> : <Smartphone className="h-5 w-5" />}
            AR Platform Detection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-600">Platform</div>
              <div className="font-semibold">{platformInfo.platform}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Browser</div>
              <div className="font-semibold">{platformInfo.browser}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">AR Support</div>
              <Badge variant={platformInfo.arSupport ? "default" : "secondary"}>
                {platformInfo.arSupport ? (
                  <CheckCircle className="h-3 w-3 mr-1" />
                ) : (
                  <XCircle className="h-3 w-3 mr-1" />
                )}
                {platformInfo.arSupport ? "Supported" : "Not Supported"}
              </Badge>
            </div>
            <div>
              <div className="text-sm text-gray-600">AR Platform</div>
              <div className="font-semibold text-sm">{platformInfo.arPlatform}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Capabilities */}
      <Card>
        <CardHeader>
          <CardTitle>Device Capabilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {platformInfo.capabilities.map((capability, index) => (
              <Badge key={index} variant="outline" className="justify-start">
                <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                {capability}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {platformInfo.recommendations.map((rec, index) => (
              <div key={index} className="text-sm p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                {rec}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AR Test */}
      <Card>
        <CardHeader>
          <CardTitle>Test AR Capabilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Test your device's AR capabilities including camera access and platform support.
            </p>
            <Button onClick={testARCapability} disabled={isTestingAR} className="w-full">
              <Camera className="h-4 w-4 mr-2" />
              {isTestingAR ? "Testing..." : "Test AR Capabilities"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Platform-Specific Instructions */}
      {platformInfo.platform === "iOS" && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">iOS AR Instructions</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-700">
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Open this page in Safari browser</li>
              <li>Tap the "View in AR" button on any product</li>
              <li>Allow camera access when prompted</li>
              <li>Point camera at a flat surface</li>
              <li>Tap to place the furniture model</li>
              <li>Use gestures to resize and rotate</li>
            </ol>
          </CardContent>
        </Card>
      )}

      {platformInfo.platform === "Android" && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">Android AR Instructions</CardTitle>
          </CardHeader>
          <CardContent className="text-green-700">
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Open this page in Chrome browser</li>
              <li>Tap the "View in AR" button on any product</li>
              <li>Scene Viewer will launch automatically</li>
              <li>Allow camera access if prompted</li>
              <li>Move device to scan the environment</li>
              <li>Tap to place furniture on detected surfaces</li>
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
