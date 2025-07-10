"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Camera, AlertCircle } from "lucide-react"

interface SimpleARModalProps {
  isOpen: boolean
  onClose: () => void
  productName: string
  productId: number
}

export function SimpleARModal({ isOpen, onClose, productName, productId }: SimpleARModalProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [modelLoaded, setModelLoaded] = useState(false)

  // Use a guaranteed working model from model-viewer examples
  const modelUrl = "https://modelviewer.dev/shared-assets/models/Astronaut.glb"

  useEffect(() => {
    if (!isOpen) return

    // Load the model-viewer script
    const loadModelViewerScript = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Check if script is already loaded
        if (window.customElements && window.customElements.get("model-viewer")) {
          console.log("✅ model-viewer already loaded")
          setScriptLoaded(true)
          setIsLoading(false)
          return
        }

        // Load the script
        const script = document.createElement("script")
        script.type = "module"
        script.src = "https://unpkg.com/@google/model-viewer@3.4.0/dist/model-viewer.min.js"

        script.onload = () => {
          console.log("✅ model-viewer script loaded successfully")
          setScriptLoaded(true)
          setIsLoading(false)
        }

        script.onerror = (e) => {
          console.error("❌ Failed to load model-viewer script:", e)
          setError("Failed to load AR viewer script")
          setIsLoading(false)
        }

        document.head.appendChild(script)
      } catch (err) {
        console.error("❌ Error loading model-viewer:", err)
        setError("Error initializing AR viewer")
        setIsLoading(false)
      }
    }

    loadModelViewerScript()
  }, [isOpen])

  const handleModelLoad = () => {
    console.log("✅ 3D model loaded successfully")
    setModelLoaded(true)
  }

  const handleModelError = () => {
    console.error("❌ Failed to load 3D model")
    setError("Failed to load 3D model")
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              <span>AR View: {productName}</span>
              <Badge variant="outline">Product #{productId}</Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="relative w-full h-full flex-1 bg-gray-50">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-600">Loading AR Viewer...</p>
              </div>
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
                <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-red-700 mb-2">Error</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          ) : scriptLoaded ? (
            <div className="w-full h-full">
              <model-viewer
                src={modelUrl}
                alt={`3D model of ${productName}`}
                ar
                ar-modes="webxr scene-viewer quick-look"
                camera-controls
                auto-rotate
                shadow-intensity="1"
                environment-image="neutral"
                style={{ width: "100%", height: "100%" }}
                onLoad={handleModelLoad}
                onError={handleModelError}
              >
                <div slot="progress-bar" className="progress-bar">
                  <div className="update-bar"></div>
                </div>

                <button
                  slot="ar-button"
                  style={{
                    backgroundColor: "#4F46E5",
                    borderRadius: "4px",
                    border: "none",
                    position: "absolute",
                    bottom: "16px",
                    right: "16px",
                    color: "white",
                    padding: "8px 16px",
                    fontWeight: "bold",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  👋 Activate AR
                </button>
              </model-viewer>

              {!modelLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading 3D Model...</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">AR Viewer Not Available</h3>
                <p className="text-gray-600 mb-4">The AR viewer could not be initialized.</p>
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {scriptLoaded ? "✅ AR viewer ready" : "⚠️ AR viewer not loaded"}
              {modelLoaded && " • 3D model loaded successfully"}
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>

      <style jsx global>{`
        model-viewer {
          --poster-color: transparent;
          --progress-bar-color: #4F46E5;
          --progress-mask: #ffffff;
        }
        
        .progress-bar {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: rgba(0, 0, 0, 0.1);
        }
        
        .update-bar {
          background: #4F46E5;
          height: 100%;
          width: 0%;
          transition: width 0.3s;
        }
      `}</style>
    </Dialog>
  )
}
