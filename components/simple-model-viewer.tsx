"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Camera, AlertCircle, CheckCircle, Smartphone, Loader2 } from "lucide-react"

interface SimpleModelViewerProps {
  isOpen: boolean
  onClose: () => void
  productName: string
  productId: number
}

// Working model URLs from model-viewer examples
const getModelUrls = (productId: number) => {
  const models = {
    1: {
      glb: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
      usdz: "https://modelviewer.dev/shared-assets/models/Astronaut.usdz",
    },
    2: {
      glb: "https://modelviewer.dev/shared-assets/models/Chair.glb",
      usdz: "https://modelviewer.dev/shared-assets/models/Chair.usdz",
    },
    3: {
      glb: "https://modelviewer.dev/shared-assets/models/shishkebab.glb",
      usdz: "https://modelviewer.dev/shared-assets/models/shishkebab.usdz",
    },
    4: {
      glb: "https://modelviewer.dev/shared-assets/models/reflective-sphere.glb",
      usdz: "https://modelviewer.dev/shared-assets/models/reflective-sphere.usdz",
    },
    5: {
      glb: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
      usdz: "https://modelviewer.dev/shared-assets/models/Astronaut.usdz",
    },
  }

  return models[productId as keyof typeof models] || models[1]
}

export function SimpleModelViewer({ isOpen, onClose, productName, productId }: SimpleModelViewerProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [deviceInfo, setDeviceInfo] = useState<any>(null)
  const [arStatus, setArStatus] = useState<string>("checking")
  const [modelLoaded, setModelLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  const models = getModelUrls(productId)

  useEffect(() => {
    if (!isOpen) return

    console.log("🚀 SimpleModelViewer opened for product:", productId, productName)

    // Device detection
    const detectDevice = () => {
      const ua = navigator.userAgent
      const info = {
        isIOS: /iPad|iPhone|iPod/.test(ua),
        isAndroid: /Android/.test(ua),
        isSafari: /Safari/.test(ua) && !/Chrome/.test(ua),
        isChrome: /Chrome/.test(ua),
        isMobile: /Mobi|Android|iPhone|iPad/.test(ua),
        hasTouch: "ontouchstart" in window,
        screenWidth: window.innerWidth,
        userAgent: ua.substring(0, 100),
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

      console.log("🔍 Device Detection:", info)
    }

    // Load model-viewer script
    const loadScript = () => {
      // Check if already loaded
      if (window.customElements && window.customElements.get("model-viewer")) {
        console.log("✅ Model-viewer already loaded")
        setIsScriptLoaded(true)
        setIsLoading(false)
        return
      }

      console.log("📦 Loading model-viewer script...")

      // Create script element
      const script = document.createElement("script")
      script.type = "module"
      script.src = "https://unpkg.com/@google/model-viewer@3.4.0/dist/model-viewer.min.js"
      script.crossOrigin = "anonymous"

      script.onload = () => {
        console.log("✅ Model-viewer script loaded successfully")
        setIsScriptLoaded(true)
        setIsLoading(false)
      }

      script.onerror = (error) => {
        console.error("❌ Failed to load model-viewer script:", error)
        setIsScriptLoaded(false)
        setIsLoading(false)
      }

      document.head.appendChild(script)
    }

    detectDevice()
    loadScript()

    return () => {
      // Cleanup on unmount
      console.log("🧹 Cleaning up SimpleModelViewer")
    }
  }, [isOpen, productId, productName])

  // Create model-viewer element programmatically
  useEffect(() => {
    if (!isScriptLoaded || !containerRef.current) return

    console.log("🎨 Creating model-viewer element...")

    const container = containerRef.current

    // Clear any existing content
    container.innerHTML = ""

    // Create model-viewer element
    const modelViewer = document.createElement("model-viewer")

    // Set attributes
    const attributes = {
      src: models.glb,
      "ios-src": models.usdz,
      alt: productName,
      ar: "",
      "ar-modes": "webxr scene-viewer quick-look",
      "ar-scale": "auto",
      "ar-placement": "floor",
      "camera-controls": "",
      "touch-action": "pan-y",
      "auto-rotate": "",
      "auto-rotate-delay": "3000",
      "environment-image": "neutral",
      "shadow-intensity": "1",
      loading: "eager",
      reveal: "auto",
    }

    Object.entries(attributes).forEach(([key, value]) => {
      modelViewer.setAttribute(key, value)
    })

    // Set styles
    modelViewer.style.width = "100%"
    modelViewer.style.height = "100%"
    modelViewer.style.backgroundColor = "transparent"
    modelViewer.style.minHeight = "400px"

    // Event handlers
    const handleLoad = () => {
      console.log("✅ 3D Model loaded successfully")
      setModelLoaded(true)
    }

    const handleError = (event: any) => {
      console.error("❌ Model failed to load:", event)
      setModelLoaded(false)
    }

    const handleARStatusChange = (event: any) => {
      console.log("🔄 AR Status changed:", event.detail)
    }

    // Add event listeners
    modelViewer.addEventListener("load", handleLoad)
    modelViewer.addEventListener("error", handleError)
    modelViewer.addEventListener("ar-status", handleARStatusChange)

    // Create custom AR button HTML
    const arButtonHTML = `
      <button slot="ar-button" style="
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #3B82F6, #8B5CF6);
        color: white;
        border: none;
        padding: 14px 28px;
        border-radius: 28px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
        z-index: 100;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 8px;
      ">
        📱 View in AR
      </button>
    `

    // Create poster image HTML
    const posterHTML = `
      <img slot="poster" 
           src="/placeholder.svg?height=400&width=400&text=Loading+3D+Model" 
           alt="Loading 3D model"
           style="background-color: #f5f5f5; width: 100%; height: 100%; object-fit: cover;" />
    `

    // Set innerHTML with slots
    modelViewer.innerHTML = arButtonHTML + posterHTML

    // Append to container
    container.appendChild(modelViewer)

    console.log("🎯 Model-viewer element created and added to DOM")

    // Cleanup function
    return () => {
      if (container && modelViewer) {
        modelViewer.removeEventListener("load", handleLoad)
        modelViewer.removeEventListener("error", handleError)
        modelViewer.removeEventListener("ar-status", handleARStatusChange)
        container.innerHTML = ""
        console.log("🧹 Model-viewer element cleaned up")
      }
    }
  }, [isScriptLoaded, models, productName])

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[95vh] p-0">
        <DialogHeader className="p-4 border-b bg-white">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Camera className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold">AR Experience: {productName}</span>
                <div className="text-sm text-gray-500 font-normal flex items-center gap-2">
                  <Badge variant={arStatus.includes("ready") ? "default" : "secondary"} className="text-xs">
                    {arStatus === "ios-ready" && "✅ iOS AR Ready"}
                    {arStatus === "android-ready" && "✅ Android AR Ready"}
                    {arStatus === "wrong-browser" && "⚠️ Wrong Browser"}
                    {arStatus === "desktop" && "💻 Desktop Mode"}
                    {arStatus === "checking" && "🔍 Checking..."}
                  </Badge>
                  {deviceInfo && (
                    <>
                      <span>•</span>
                      <span>{deviceInfo.isIOS ? "iOS" : deviceInfo.isAndroid ? "Android" : "Desktop"}</span>
                      <span>•</span>
                      <span>{deviceInfo.isSafari ? "Safari" : deviceInfo.isChrome ? "Chrome" : "Other"}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 relative bg-gradient-to-br from-gray-50 to-gray-100">
          {/* Status Overlay */}
          <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur rounded-lg p-3 shadow-lg max-w-xs border">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              Status:
            </h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center justify-between">
                <span>Script:</span>
                <Badge variant={isScriptLoaded ? "default" : "secondary"} className="text-xs">
                  {isScriptLoaded ? "✅ Loaded" : "⏳ Loading"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Model:</span>
                <Badge variant={modelLoaded ? "default" : "secondary"} className="text-xs">
                  {modelLoaded ? "✅ Ready" : "⏳ Loading"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>AR:</span>
                <Badge variant={arStatus.includes("ready") ? "default" : "secondary"} className="text-xs">
                  {arStatus.includes("ready") ? "✅ Available" : "❌ Not Available"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Instructions Overlay */}
          {arStatus === "wrong-browser" && (
            <div className="absolute top-4 right-4 z-20 bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-xs">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <span className="font-semibold text-yellow-800">Wrong Browser</span>
              </div>
              <p className="text-sm text-yellow-700">
                {deviceInfo?.isIOS
                  ? "Please use Safari browser for AR on iOS"
                  : "Please use Chrome browser for AR on Android"}
              </p>
            </div>
          )}

          {arStatus.includes("ready") && (
            <div className="absolute top-4 right-4 z-20 bg-green-50 border border-green-200 rounded-lg p-4 max-w-xs">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-semibold text-green-800">AR Ready!</span>
              </div>
              <p className="text-sm text-green-700">Look for the "📱 View in AR" button below the 3D model</p>
            </div>
          )}

          {/* Model Viewer Container */}
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading AR Viewer</h3>
                <p className="text-gray-600">Initializing model-viewer...</p>
              </div>
            </div>
          ) : (
            <div ref={containerRef} className="w-full h-full relative" style={{ minHeight: "400px" }} />
          )}

          {/* Model Info */}
          {isScriptLoaded && (
            <div className="absolute bottom-4 right-4 z-10 bg-white/95 backdrop-blur rounded-lg p-3 shadow-lg border max-w-xs">
              <div className="text-sm">
                <div className="font-semibold text-gray-800 mb-2">Model Info:</div>
                <div className="space-y-1 text-gray-600">
                  <div>Format: GLB/USDZ</div>
                  <div>Platform: {arStatus.includes("ready") ? "AR + 3D" : "3D Only"}</div>
                  <div>Controls: Touch/Mouse</div>
                  <div>Product ID: {productId}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-white">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              💡 <strong>Instructions:</strong>{" "}
              {arStatus === "ios-ready" && "Tap '📱 View in AR' → Allow camera → Point at floor → Tap to place"}
              {arStatus === "android-ready" &&
                "Tap '📱 View in AR' → Scene Viewer opens → Point at floor → Tap to place"}
              {arStatus === "wrong-browser" && "Switch to correct browser for AR support"}
              {arStatus === "desktop" && "Open on mobile device (Safari/Chrome) for AR experience"}
              {arStatus === "checking" && "Checking device compatibility..."}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
