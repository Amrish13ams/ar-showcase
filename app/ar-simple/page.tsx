"use client"

import { useState } from "react"
import { SimpleARViewer } from "@/components/simple-ar-viewer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera } from "lucide-react"

export default function SimpleARPage() {
  const [isAROpen, setIsAROpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Simple AR Test</h1>
          <p className="text-gray-600">Minimal AR implementation for debugging</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>AR Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm space-y-2">
              <p>
                <strong>Instructions:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>
                  📱 <strong>iOS:</strong> Use Safari browser
                </li>
                <li>
                  🤖 <strong>Android:</strong> Use Chrome browser
                </li>
                <li>👆 Tap "Test AR" button below</li>
                <li>🔍 Look for "View in AR" button in the 3D viewer</li>
                <li>📷 Tap it to launch AR mode</li>
              </ul>
            </div>

            <Button onClick={() => setIsAROpen(true)} className="w-full" size="lg">
              <Camera className="h-5 w-5 mr-2" />
              Test AR
            </Button>

            <div className="text-xs text-gray-500 bg-gray-100 p-3 rounded">
              <strong>Debug Info:</strong>
              <br />
              User Agent: {typeof window !== "undefined" ? navigator.userAgent.substring(0, 100) : "Loading..."}...
            </div>
          </CardContent>
        </Card>

        <SimpleARViewer
          isOpen={isAROpen}
          onClose={() => setIsAROpen(false)}
          productName="Test Astronaut"
          productId={1}
        />
      </div>
    </div>
  )
}
