"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Camera, AlertCircle, Smartphone } from "lucide-react"

interface SimpleARViewerProps {
  isOpen: boolean
  onClose: () => void
  productName: string
  productId?: number
}

export function SimpleARViewer({ isOpen, onClose, productName, productId }: SimpleARViewerProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [deviceInfo, setDeviceInfo] = useState<any>(null)
  const [arStatus, setArStatus] = useState<string>("checking")
  const modelViewerRef = useRef<any>(null)

  // Get working model URLs
  const getModelUrl = (productId?: number): string => {
    // Use a single reliable model that we know works
    return "https://cdn.glitch.global/36cb8393-65c6-408d-a538-055ada20431b/Astronaut.glb?v=1618158447956"
  }

  const modelUrl = getModelUrl(productId)

  useEffect(() => {
    if (!isOpen) return

    // Detect device first
    const detectDevice = () => {
      const ua = navigator.userAgent
      const info = {
        isIOS: /iPad|iPhone|iPod/.test(ua),
        isAndroid: /Android/.test(ua),
        isSafari: /Safari/.test(ua) && !/Chrome/.test(ua),
        isChrome: /Chrome/.test(ua),
        isMobile: /Mobi|Android/i.test(ua),
        userAgent: ua,
      }

      setDeviceInfo(info)

      // Determine AR support
      if (info.isIOS && info.isSafari) {
        setArStatus("ios-ready")
      } else if (info.isAndroid && info.isChrome) {
        setArStatus("android-ready")
      } else if (info.isMobile) {
        setArStatus("wrong-browser")
      } else {
        setArStatus("desktop")
      }

      console.log("Device Info:", info)
    }

    // Load model-viewer script
    const loadScript = () => {
      // Check if already loaded
      if (window.customElements && window.customElements.get("model-viewer")) {
        setIsScriptLoaded(true)
        return
      }

      // Remove any existing scripts
      const existingScripts = document.querySelectorAll('script[src*="model-viewer"]')
      existingScripts.forEach((script) => script.remove())

      // Add new script
      const script = document.createElement("script")
      script.type = "module"
      script.src = "https://unpkg.com/@google/model-viewer@3.4.0/dist/model-viewer.min.js"

      script.onload = () => {
        console.log("✅ Model-viewer script loaded")
        setIsScriptLoaded(true)
      }

      script.onerror = (error) => {
        console.error("❌ Failed to load model-viewer:", error)
        setIsScriptLoaded(false)
      }

      document.head.appendChild(script)
    }

    detectDevice()
    loadScript()

    return () => {
      // Cleanup if needed
    }
  }, [isOpen])

  const handleModelLoad = () => {
    console.log("✅ Model loaded successfully")
  }

  const handleModelError = (event: any) => {
    console.error("❌ Model failed to load:", event)
  }

  const handleARStatus = (event: any) => {
    console.log("🔄 AR Status changed:", event.detail)
  }

  const handleARClick = () => {
    if (modelViewerRef.current) {
      // Trigger AR mode directly
      modelViewerRef.current.activateAR()
    }
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              <span>AR Experience: {productName}</span>
              <Badge className="bg-purple-100 text-purple-800">🚀 Live AR</Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 relative">
          {/* Status Panel */}
          <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur rounded-lg p-3 shadow-lg max-w-xs">
            <h4 className="font-semibold mb-2">Status:</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <span>Model:</span>
                <Badge variant={isScriptLoaded ? "default" : "secondary"}>
                  {isScriptLoaded ? "✅ Loaded" : "⏳ Loading"}
                </Badge>
              </div>
              {deviceInfo && (
                <>
                  <div className="flex items-center gap-2">
                    <span>Device:</span>
                    <span>{deviceInfo.isIOS ? "iOS" : deviceInfo.isAndroid ? "Android" : "Desktop"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Browser:</span>
                    <span>{deviceInfo.isSafari ? "Safari" : deviceInfo.isChrome ? "Chrome" : "Other"}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Instructions Panel */}
          {arStatus === "wrong-browser" && (
            <div className="absolute top-4 right-4 z-10 bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-xs">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <span className="font-semibold text-yellow-800">Wrong Browser</span>
              </div>
              <p className="text-sm text-yellow-700">
                {deviceInfo?.isIOS ? "Use Safari for AR on iOS" : "Use Chrome for AR on Android"}
              </p>
            </div>
          )}

          {arStatus === "desktop" && (
            <div className="absolute top-4 right-4 z-10 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-xs">
              <div className="flex items-center gap-2 mb-2">
                <Smartphone className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-blue-800">Desktop Mode</span>
              </div>
              <p className="text-sm text-blue-700">3D preview available. For AR, open on mobile device</p>
            </div>
          )}

          {/* Model Viewer - Always show directly */}
          {isScriptLoaded ? (
            <div className="w-full h-full">
              <model-viewer
                ref={modelViewerRef}
                src={modelUrl}
                alt={`${productName} - 3D Model`}
                ar
                ar-modes="webxr scene-viewer quick-look"
                ar-scale="auto"
                ar-placement="floor"
                camera-controls
                touch-action="pan-y"
                auto-rotate
                environment-image="neutral"
                shadow-intensity="1"
                loading="eager"
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#f8fafc",
                }}
                onLoad={handleModelLoad}
                onError={handleModelError}
                onArStatus={handleARStatus}
              >
                {/* Progress Bar */}
                <div
                  slot="progress-bar"
                  style={{
                    position: "absolute",
                    bottom: "80px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "200px",
                    height: "4px",
                    backgroundColor: "rgba(255,255,255,0.3)",
                    borderRadius: "2px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      backgroundColor: "#8B5CF6",
                      borderRadius: "2px",
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>

                {/* Loading Poster */}
                <img slot="poster" src="/placeholder.svg?height=400&width=400&text=Loading+3D+Model" alt="Loading" />
              </model-viewer>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mx-auto mb-4" />
                <p className="text-gray-600">Loading AR Viewer...</p>
                <p className="text-sm text-purple-600 mt-2">Preparing 3D model...</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer with AR Launch Button */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {arStatus === "ios-ready" && "💡 Drag to rotate • Pinch to zoom • Ready for AR"}
              {arStatus === "android-ready" && "💡 Drag to rotate • Pinch to zoom • Ready for AR"}
              {arStatus === "wrong-browser" && "⚠️ Switch to correct browser for AR functionality"}
              {arStatus === "desktop" && "💻 Drag to rotate • Scroll to zoom • Open on mobile for AR"}
              {arStatus === "checking" && "🔍 Checking device compatibility..."}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              {(arStatus === "ios-ready" || arStatus === "android-ready") && (
                <Button
                  onClick={handleARClick}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Launch AR
                </Button>
              )}
              {arStatus === "desktop" && (
                <Button disabled className="bg-gray-400 cursor-not-allowed">
                  <Smartphone className="h-4 w-4 mr-2" />
                  AR (Mobile Only)
                </Button>
              )}
              {arStatus === "wrong-browser" && (
                <Button disabled className="bg-gray-400 cursor-not-allowed">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  AR (Wrong Browser)
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
