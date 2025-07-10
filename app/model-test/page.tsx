"use client"

import dynamicImport from "next/dynamic" // ✅ Rename the import to avoid conflict
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic" // ✅ This is for Next.js, leave as-is

const ModelViewer = dynamicImport(() => import("./viewer"), { ssr: false })

export default function ModelTestPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">3D Model Test: Wooden Round Dining Table</h1>
      <ModelViewer />
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="font-semibold text-blue-800 mb-2">About This Model</h3>
        <p className="text-blue-700">This is a 3D model of a wooden round dining table. You can interact with it by:</p>
        <ul className="mt-2 space-y-1 text-blue-700 text-sm">
          <li>• Click and drag to rotate the model</li>
          <li>• Scroll to zoom in and out</li>
          <li>• Right-click and drag to pan</li>
        </ul>
      </div>
    </div>
  )
}
