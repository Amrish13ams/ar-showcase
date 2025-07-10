"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Camera, Smartphone, Download, Share2 } from "lucide-react"

interface ARViewerProps {
  isOpen: boolean
  onClose: () => void
  productName: string
  productId: number
  modelUrl?: string
}

// Map product IDs to model URLs (you would replace these with actual GLB/GLTF files)
const getModelUrl = (productId: number): string => {
  const modelMap: Record<number, string> = {
    1: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    2: "https://modelviewer.dev/shared-assets/models/Chair.glb",
    3: "https://modelviewer.dev/shared-assets/models/shishkebab.glb",
    4: "https://modelviewer.dev/shared-assets/models/reflective-sphere.glb",
    5: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    6: "https://modelviewer.dev/shared-assets/models/Chair.glb",
    7: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    8: "https://modelviewer.dev/shared-assets/models/Chair.glb",
  }
  return modelMap[productId] || "https://modelviewer.dev/shared-assets/models/Astronaut.glb"
}

export function ARViewer({ isOpen, onClose, productName, productId, modelUrl }: ARViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [deviceType, setDeviceType] = useState<"desktop" | "mobile">("desktop")
  const [arSupported, setArSupported] = useState(false)

  const finalModelUrl = modelUrl || getModelUrl(productId)

  useEffect(() => {
    // Load model-viewer script with better error handling
    if (typeof window !== "undefined") {
      const existingScript = document.querySelector('script[src*="model-viewer"]')

      if (!existingScript && !window.customElements.get("model-viewer")) {
        const script = document.createElement("script")
        script.type = "module"
        script.src = "https://unpkg.com/@google/model-viewer@3.4.0/dist/model-viewer.min.js"
        script.crossOrigin = "anonymous"
        document.head.appendChild(script)

        script.onload = () => {
          console.log("Model-viewer loaded successfully")
          setIsLoading(false)
        }

        script.onerror = (error) => {
          console.error("Failed to load model-viewer:", error)
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }

    // Enhanced device detection
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isIOS = /iphone|ipad|ipod/.test(userAgent)
      const isAndroid = /android/.test(userAgent)
      const isMobile = isIOS || isAndroid || /mobile|tablet/.test(userAgent)
      const hasTouch = "ontouchstart" in window
      const isSmallScreen = window.innerWidth < 768

      const isMobileDevice = isMobile || hasTouch || isSmallScreen
      setDeviceType(isMobileDevice ? "mobile" : "desktop")

      // Better AR support detection
      let arSupported = false

      if (isIOS) {
        // iOS supports AR in Safari
        arSupported = /safari/.test(userAgent) && !/chrome/.test(userAgent)
      } else if (isAndroid) {
        // Android supports AR in Chrome
        arSupported = /chrome/.test(userAgent)
      }

      setArSupported(arSupported)

      console.log("Device detection result:", {
        userAgent: userAgent.substring(0, 50),
        isIOS,
        isAndroid,
        isMobile,
        hasTouch,
        isSmallScreen,
        arSupported,
        deviceType: isMobileDevice ? "mobile" : "desktop",
      })
    }

    if (isOpen) {
      checkDevice()
      window.addEventListener("resize", checkDevice)
    }

    return () => {
      window.removeEventListener("resize", checkDevice)
    }
  }, [isOpen])

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `AR View: ${productName}`,
        text: `Check out this ${productName} in AR!`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied! Share it to view in AR on mobile devices.")
    }
  }

  const handleDownloadModel = () => {
    const link = document.createElement("a")
    link.href = finalModelUrl
    link.download = `${productName.replace(/\s+/g, "_")}.glb`
    link.click()
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0 border-b">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Camera className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold">AR Experience: {productName}</span>
                <div className="text-sm text-gray-500 font-normal flex items-center gap-2">
                  <Badge variant={arSupported ? "default" : "secondary"} className="text-xs">
                    {arSupported ? "AR Supported" : "3D View Only"}
                  </Badge>
                  <span>•</span>
                  <span>{deviceType === "mobile" ? "Mobile Device" : "Desktop"}</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 relative bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-6"></div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading AR Experience</h3>
                <p className="text-gray-600">Preparing your AR viewer...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Google Model Viewer */}
              <div className="w-full h-full relative">
                <model-viewer
                  src={finalModelUrl}
                  alt={productName}
                  ar
                  ar-modes="webxr scene-viewer quick-look"
                  ar-scale="auto"
                  ar-placement="floor"
                  camera-controls
                  touch-action="pan-y"
                  auto-rotate
                  auto-rotate-delay="3000"
                  rotation-per-second="30deg"
                  environment-image="neutral"
                  shadow-intensity="1"
                  camera-orbit="0deg 75deg 105%"
                  min-camera-orbit="auto auto 50%"
                  max-camera-orbit="auto auto 200%"
                  loading="eager"
                  reveal="auto"
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "transparent",
                  }}
                >
                  {/* AR Button (appears automatically on supported devices) */}
                  <div
                    slot="ar-button"
                    style={{
                      position: "absolute",
                      bottom: "20px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      zIndex: 10,
                    }}
                  >
                    <button
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 font-medium transition-all transform hover:scale-105"
                      style={{ border: "none", cursor: "pointer" }}
                    >
                      <Camera className="h-5 w-5" />
                      View in AR
                    </button>
                  </div>

                  {/* Loading indicator */}
                  <div slot="progress-bar" className="progress-bar">
                    <div className="update-bar"></div>
                  </div>

                  {/* Poster image while loading */}
                  <img
                    slot="poster"
                    src="/placeholder.svg?height=400&width=400&text=Loading+3D+Model"
                    alt="Loading 3D model"
                  />
                </model-viewer>

                {/* Instructions Overlay */}
                <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 max-w-xs shadow-lg border">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Camera className="h-4 w-4 text-blue-600" />
                    AR Controls:
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Drag to rotate the model
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Pinch to zoom in/out
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      {arSupported
                        ? deviceType === "mobile"
                          ? navigator.userAgent.includes("android")
                            ? "Tap AR for Scene Viewer"
                            : navigator.userAgent.includes("iphone") || navigator.userAgent.includes("ipad")
                              ? "Tap AR for Quick Look"
                              : "Tap AR button to place in room"
                          : "AR available on mobile"
                        : "AR not available on this device"}
                    </li>
                  </ul>
                </div>

                {/* Model Info */}
                <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border">
                  <div className="text-sm">
                    <div className="font-semibold text-gray-800 mb-2">Model Details:</div>
                    <div className="space-y-1 text-gray-600">
                      <div>Format: GLB/GLTF</div>
                      <div>Platform: AR Viewer</div>
                      <div>Features: {arSupported ? "AR + 3D" : "3D Only"}</div>
                    </div>
                  </div>
                </div>

                {/* Device-specific instructions */}
                {arSupported && deviceType === "mobile" && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-md text-center">
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Smartphone className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-blue-800 mb-2">
                      {navigator.userAgent.includes("android")
                        ? "Android AR Ready"
                        : navigator.userAgent.includes("iphone") || navigator.userAgent.includes("ipad")
                          ? "iOS AR Ready"
                          : "AR Ready"}
                    </h4>
                    <p className="text-sm text-blue-700">
                      {navigator.userAgent.includes("android")
                        ? "Uses ARCore and Scene Viewer for placing furniture in your space"
                        : navigator.userAgent.includes("iphone") || navigator.userAgent.includes("ipad")
                          ? "Uses ARKit and Quick Look for placing furniture in your space"
                          : "Tap the AR button below to place furniture in your room"}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                💡 <strong>Pro Tip:</strong>{" "}
                {arSupported ? "Tap the AR button to place furniture in your room" : "Open on mobile for AR experience"}
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleShare} size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" onClick={handleDownloadModel} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Custom Styles for model-viewer */}
      <style jsx global>{`
        model-viewer {
          --poster-color: transparent;
          --progress-bar-color: #3b82f6;
          --progress-mask: #ffffff;
        }

        model-viewer .progress-bar {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: 200px;
          height: 4px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
          overflow: hidden;
        }

        model-viewer .update-bar {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        model-viewer button[slot="ar-button"] {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
        }

        model-viewer button[slot="ar-button"]:not([data-visible]) {
          display: none;
        }
      `}</style>
    </Dialog>
  )
}
