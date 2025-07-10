"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, RotateCcw, Move3D, Maximize, Camera } from "lucide-react"
import { Sample3DViewer } from "./sample-3d-models"
import { SimpleARViewer } from "./simple-ar-viewer"
import { getModelType } from "@/lib/ar-models"

interface ARViewerProps {
  isOpen: boolean
  onClose: () => void
  productName: string
  modelUrl?: string
  productId?: number
  dimensions?: string
  category?: string
}

export function ARViewer({ isOpen, onClose, productName, modelUrl, productId, dimensions, category }: ARViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAROpen, setIsAROpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true)
      setError(null)

      // Simulate loading time
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleReset = () => {
    console.log("Resetting 3D model view")
  }

  const handleFullscreen = () => {
    console.log("Entering fullscreen AR mode")
  }

  const handlePlaceInRoom = () => {
    console.log("Opening AR viewer for product:", productName, productId)
    setIsAROpen(true)
  }

  const modelType = getModelType(productId)

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl h-[85vh] p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0 border-b">
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Move3D className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="text-lg font-bold">3D Preview: {productName}</span>
                  <div className="text-sm text-gray-500 font-normal">Interactive 3D Model</div>
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
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading 3D Model</h3>
                  <p className="text-gray-600">Preparing your AR experience...</p>
                  <div className="flex gap-2 justify-center mt-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm animate-pulse">
                      Initializing
                    </span>
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-red-800 mb-2">Failed to Load</h3>
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
            ) : (
              <>
                {/* 3D Model Viewer with proper dimensions */}
                <div className="w-full h-full relative">
                  <Sample3DViewer
                    modelType={modelType}
                    dimensions={dimensions}
                    category={category}
                    className="w-full h-full"
                  />

                  {/* AR Instructions Overlay */}
                  <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 max-w-xs shadow-lg border">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Move3D className="h-4 w-4 text-purple-600" />
                      3D Controls:
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Drag to rotate the model
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Scroll to zoom in/out
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        Right-click + drag to pan
                      </li>
                    </ul>
                  </div>

                  {/* Model Info */}
                  <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border">
                    <div className="text-sm">
                      <div className="font-semibold text-gray-800 mb-2">Model Details:</div>
                      <div className="space-y-1 text-gray-600">
                        <div>Type: {modelType.charAt(0).toUpperCase() + modelType.slice(1)}</div>
                        <div>Format: 3D Interactive</div>
                        <div>Features: 360° View</div>
                        {dimensions && <div>Size: {dimensions}</div>}
                      </div>
                    </div>
                  </div>

                  {/* Floating Action Buttons */}
                  <div className="absolute top-6 right-6 flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleFullscreen}
                      className="bg-white/90 hover:bg-white shadow-lg"
                      title="Fullscreen Mode"
                    >
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Control Panel */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-full p-3 flex gap-2 shadow-lg border">
                  <Button variant="ghost" size="sm" onClick={handleReset} title="Reset View" className="rounded-full">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <div className="w-px bg-gray-300 mx-1"></div>
                  <div className="flex items-center gap-2 px-3">
                    <Move3D className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">Interactive 3D Model</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 pt-4 border-t bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  💡 <strong>Pro Tip:</strong> Use AR to place this furniture in your real space with your camera
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose}>
                  Close Preview
                </Button>
                <Button
                  onClick={handlePlaceInRoom}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  View in AR
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Simple AR Viewer */}
      <SimpleARViewer
        isOpen={isAROpen}
        onClose={() => setIsAROpen(false)}
        productName={productName}
        productId={productId || 1}
      />
    </>
  )
}
