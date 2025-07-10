"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, Move, RotateCcw, ZoomIn, ZoomOut, X, Check, AlertCircle } from "lucide-react"

interface MobileARExperienceProps {
  productName: string
  productId: number
  onClose: () => void
}

export function MobileARExperience({ productName, productId, onClose }: MobileARExperienceProps) {
  const [isPlaced, setIsPlaced] = useState(false)
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [cameraStatus, setCameraStatus] = useState<"loading" | "ready" | "error">("loading")
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    console.log("MobileARExperience mounted for product:", productName, productId)

    // Set initial dimensions
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)

    // Start camera with delay to ensure component is mounted
    setTimeout(() => {
      startCamera()
    }, 100)

    return () => {
      window.removeEventListener("resize", updateDimensions)
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    console.log("Starting camera...")
    setCameraStatus("loading")
    setCameraError(null)

    try {
      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera not supported on this device")
      }

      const constraints = {
        video: {
          facingMode: "environment",
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
        },
        audio: false,
      }

      console.log("Requesting camera with constraints:", constraints)
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      console.log("Camera stream obtained:", stream)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          console.log("Video metadata loaded")
          setCameraStatus("ready")
        }
        videoRef.current.onerror = (e) => {
          console.error("Video error:", e)
          setCameraError("Failed to load camera stream")
          setCameraStatus("error")
        }
        await videoRef.current.play()
        console.log("Video playing")
      }
    } catch (err) {
      console.error("Camera error:", err)
      const errorMessage = err instanceof Error ? err.message : "Unknown camera error"
      setCameraError(errorMessage)
      setCameraStatus("error")
    }
  }

  const stopCamera = () => {
    console.log("Stopping camera...")
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => {
        console.log("Stopping track:", track.kind)
        track.stop()
      })
      videoRef.current.srcObject = null
    }
  }

  const placeFurniture = () => {
    console.log("Placing furniture:", productName, "at scale:", scale, "rotation:", rotation)
    setIsPlaced(true)

    // Draw furniture representation on canvas
    if (canvasRef.current && dimensions.width > 0) {
      const ctx = canvasRef.current.getContext("2d")
      if (ctx) {
        const centerX = dimensions.width / 2
        const centerY = dimensions.height / 2 + 50

        // Clear previous drawings
        ctx.clearRect(0, 0, dimensions.width, dimensions.height)

        // Draw furniture shadow
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)"
        ctx.ellipse(centerX, centerY + 40, 80 * scale, 20 * scale, 0, 0, 2 * Math.PI)
        ctx.fill()

        // Draw furniture based on product type
        ctx.save()
        ctx.translate(centerX, centerY)
        ctx.rotate((rotation * Math.PI) / 180)
        ctx.scale(scale, scale)

        if (productId === 1 || productId === 6) {
          // Sofa representation
          ctx.fillStyle = "#4A5568"
          ctx.fillRect(-60, -20, 120, 40)
          ctx.fillStyle = "#718096"
          ctx.fillRect(-50, -25, 100, 15)
          // Add sofa arms
          ctx.fillStyle = "#4A5568"
          ctx.fillRect(-65, -25, 10, 45)
          ctx.fillRect(55, -25, 10, 45)
        } else if (productId === 3) {
          // Chair representation
          ctx.fillStyle = "#2D3748"
          ctx.fillRect(-25, -15, 50, 30)
          ctx.fillRect(-25, -35, 50, 20)
          // Chair legs
          ctx.fillStyle = "#1A202C"
          ctx.fillRect(-20, 15, 3, 15)
          ctx.fillRect(17, 15, 3, 15)
          ctx.fillRect(-20, -10, 3, 15)
          ctx.fillRect(17, -10, 3, 15)
        } else if (productId === 2 || productId === 5 || productId === 8) {
          // Dining Table Set (ID: 2), Glass Coffee Table (ID: 5), TV Stand (ID: 8)
          ctx.fillStyle = "#8B4513"
          // Table top - make it larger for dining table
          const tableWidth = productId === 2 ? 100 : 80
          const tableHeight = productId === 2 ? 60 : 40
          ctx.fillRect(-tableWidth / 2, -5, tableWidth, 10)

          // Table legs
          ctx.fillStyle = "#654321"
          const legOffset = tableWidth / 2 - 5
          const legOffsetY = tableHeight / 2 - 5
          ctx.fillRect(-legOffset, -legOffsetY, 4, 20)
          ctx.fillRect(legOffset - 4, -legOffsetY, 4, 20)
          ctx.fillRect(-legOffset, legOffsetY - 10, 4, 20)
          ctx.fillRect(legOffset - 4, legOffsetY - 10, 4, 20)

          // For dining table, add chairs around it
          if (productId === 2) {
            ctx.fillStyle = "#2D3748"
            // Chair positions around table
            const chairPositions = [
              [-tableWidth / 2 - 20, -20],
              [tableWidth / 2 + 15, -20],
              [-tableWidth / 2 - 20, 20],
              [tableWidth / 2 + 15, 20],
              [0, -tableHeight / 2 - 20],
              [0, tableHeight / 2 + 15],
            ]

            chairPositions.forEach(([x, y]) => {
              ctx.fillRect(x, y, 15, 15)
              ctx.fillRect(x, y - 10, 15, 10)
            })
          }
        } else {
          // Default furniture representation
          ctx.fillStyle = "#4A5568"
          ctx.fillRect(-40, -20, 80, 40)
        }

        ctx.restore()

        // Draw placement indicator
        ctx.strokeStyle = "#8B5CF6"
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        const indicatorSize = productId === 2 ? 120 : 80
        ctx.strokeRect(centerX - indicatorSize * scale, centerY - 40 * scale, indicatorSize * 2 * scale, 80 * scale)
        ctx.setLineDash([])

        // Add product label
        ctx.fillStyle = "rgba(139, 92, 246, 0.9)"
        ctx.fillRect(centerX - 60, centerY - 60, 120, 20)
        ctx.fillStyle = "white"
        ctx.font = "12px Arial"
        ctx.textAlign = "center"
        ctx.fillText(productName.substring(0, 20), centerX, centerY - 47)
      }
    }
  }

  const resetPlacement = () => {
    console.log("Resetting placement")
    setIsPlaced(false)
    setScale(1)
    setRotation(0)

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, dimensions.width, dimensions.height)
      }
    }
  }

  const adjustScale = (delta: number) => {
    const newScale = Math.max(0.5, Math.min(2, scale + delta))
    console.log("Adjusting scale from", scale, "to", newScale)
    setScale(newScale)
    if (isPlaced) placeFurniture()
  }

  const adjustRotation = (delta: number) => {
    const newRotation = (rotation + delta) % 360
    console.log("Adjusting rotation from", rotation, "to", newRotation)
    setRotation(newRotation)
    if (isPlaced) placeFurniture()
  }

  const handleRetryCamera = () => {
    console.log("Retrying camera...")
    startCamera()
  }

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Camera View */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        playsInline
        muted
        autoPlay
        style={{ display: cameraStatus === "ready" ? "block" : "none" }}
      />

      {/* Loading State */}
      {cameraStatus === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold mb-2">Starting Camera</h3>
            <p className="text-gray-300">Please allow camera access when prompted</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {cameraStatus === "error" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-center text-white max-w-md mx-4">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Camera Error</h3>
            <p className="text-gray-300 mb-4">{cameraError}</p>
            <div className="space-y-3">
              <Button onClick={handleRetryCamera} className="bg-blue-600 hover:bg-blue-700">
                Try Again
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-black"
              >
                Close AR
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* AR Overlay Canvas */}
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Header */}
      <div className="absolute top-4 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div
                className={`w-2 h-2 rounded-full ${cameraStatus === "ready" ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
              ></div>
              <span className="text-sm font-medium">
                {cameraStatus === "ready" ? "AR Active" : cameraStatus === "loading" ? "Starting..." : "Camera Error"}
              </span>
            </div>
            <p className="text-xs text-gray-300">{productName}</p>
          </div>
          <Button onClick={onClose} variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Instructions */}
      {!isPlaced && cameraStatus === "ready" && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
          <div className="bg-black/70 backdrop-blur-sm rounded-lg p-6 max-w-xs">
            <Camera className="h-8 w-8 mx-auto mb-3 text-purple-400" />
            <h3 className="font-semibold mb-2">Point at the floor</h3>
            <p className="text-sm text-gray-300 mb-4">Find a flat surface where you'd like to place your furniture</p>
            <div className="w-8 h-8 border-2 border-white rounded-full mx-auto opacity-70"></div>
          </div>
        </div>
      )}

      {/* Crosshair */}
      {cameraStatus === "ready" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative">
            <div className="w-6 h-6 border-2 border-white rounded-full opacity-70"></div>
            <div className="absolute inset-0 w-6 h-6 border-2 border-purple-400 rounded-full animate-ping"></div>
          </div>
        </div>
      )}

      {/* Main Action Button */}
      {cameraStatus === "ready" && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
          {!isPlaced ? (
            <Button
              onClick={placeFurniture}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full shadow-lg text-lg"
            >
              <Move className="h-5 w-5 mr-2" />
              Place Furniture
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <Badge className="bg-green-600 text-white px-4 py-2">
                <Check className="h-4 w-4 mr-1" />
                Placed!
              </Badge>
            </div>
          )}
        </div>
      )}

      {/* Controls */}
      {isPlaced && cameraStatus === "ready" && (
        <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-xs text-gray-300 mb-2">Size</p>
              <div className="flex gap-1">
                <Button
                  onClick={() => adjustScale(-0.1)}
                  size="sm"
                  variant="outline"
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  <ZoomOut className="h-3 w-3" />
                </Button>
                <Button
                  onClick={() => adjustScale(0.1)}
                  size="sm"
                  variant="outline"
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  <ZoomIn className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-300 mb-2">Rotate</p>
              <div className="flex gap-1">
                <Button
                  onClick={() => adjustRotation(-15)}
                  size="sm"
                  variant="outline"
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  ↺
                </Button>
                <Button
                  onClick={() => adjustRotation(15)}
                  size="sm"
                  variant="outline"
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  ↻
                </Button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-300 mb-2">Reset</p>
              <Button
                onClick={resetPlacement}
                size="sm"
                variant="outline"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
