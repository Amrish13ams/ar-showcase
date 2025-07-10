"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Camera, Smartphone, Monitor, X } from "lucide-react"
import { MobileARExperience } from "./mobile-ar-experience"

interface WebXRARViewerProps {
  isOpen: boolean
  onClose: () => void
  productName: string
  productId: number
}

export function WebXRARViewer({ isOpen, onClose, productName, productId }: WebXRARViewerProps) {
  const [deviceType, setDeviceType] = useState<"desktop" | "mobile">("desktop")
  const [showMobileAR, setShowMobileAR] = useState(false)
  const [debugInfo, setDebugInfo] = useState("")

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobile = /iphone|ipad|android|mobile|tablet/.test(userAgent)
      const hasTouch = "ontouchstart" in window
      const isSmallScreen = window.innerWidth < 768

      const deviceInfo = {
        userAgent: userAgent.substring(0, 50),
        isMobile,
        hasTouch,
        isSmallScreen,
        screenWidth: window.innerWidth,
      }

      setDebugInfo(JSON.stringify(deviceInfo, null, 2))

      // More aggressive mobile detection
      const isMobileDevice = isMobile || hasTouch || isSmallScreen
      setDeviceType(isMobileDevice ? "mobile" : "desktop")

      console.log("Device detection:", deviceInfo, "Result:", isMobileDevice ? "mobile" : "desktop")
    }

    if (isOpen) {
      checkDevice()
      window.addEventListener("resize", checkDevice)
    }

    return () => {
      window.removeEventListener("resize", checkDevice)
    }
  }, [isOpen])

  const handleStartAR = () => {
    console.log("Starting AR experience, device type:", deviceType)
    setShowMobileAR(true)
  }

  const handleCloseMobileAR = () => {
    console.log("Closing mobile AR")
    setShowMobileAR(false)
    onClose()
  }

  // If mobile AR is active, render it full screen
  if (showMobileAR) {
    return <MobileARExperience productName={productName} productId={productId} onClose={handleCloseMobileAR} />
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            AR Room Placement - {productName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-6">
          <div className="text-center">
            <div className="h-24 w-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              {deviceType === "mobile" ? (
                <Smartphone className="h-12 w-12 text-white" />
              ) : (
                <Monitor className="h-12 w-12 text-white" />
              )}
            </div>

            <h3 className="text-xl font-semibold mb-2">
              {deviceType === "mobile" ? "Ready for AR Experience" : "AR Experience Available"}
            </h3>
            <p className="text-gray-600 mb-6">
              {deviceType === "mobile"
                ? "Your device supports AR! Click the button below to start placing furniture in your room."
                : "For the best AR experience, this feature works best on mobile devices with cameras."}
            </p>
          </div>

          {/* Debug Info - Remove in production */}
          <details className="bg-gray-50 p-3 rounded text-xs">
            <summary className="cursor-pointer font-medium">Debug Info (Click to expand)</summary>
            <pre className="mt-2 text-xs overflow-auto">{debugInfo}</pre>
            <p className="mt-2">
              Detected as: <strong>{deviceType}</strong>
            </p>
          </details>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">How AR works:</h4>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. Click "Start AR Experience" below</li>
              <li>2. Allow camera access when prompted</li>
              <li>3. Point your camera at the floor</li>
              <li>4. Tap to place your {productName}</li>
              <li>5. Adjust size and rotation as needed</li>
            </ol>
          </div>

          <div className="flex gap-3">
            <Button onClick={onClose} variant="outline" className="flex-1">
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>

            <Button onClick={handleStartAR} className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600">
              <Camera className="h-4 w-4 mr-2" />
              Start AR Experience
            </Button>
          </div>

          {/* Device Detection Info */}
          <div className="text-center text-xs text-gray-500 bg-gray-50 p-2 rounded">
            Device: {deviceType} | Screen: {typeof window !== "undefined" ? window.innerWidth : 0}px
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
