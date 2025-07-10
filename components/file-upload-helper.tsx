"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileImage, Box, CheckCircle } from 'lucide-react'

export function FileUploadHelper() {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])

  const requiredFiles = [
    { type: "3D Model", path: "public/models/your-model.glb", icon: Box },
    { type: "Main Photo", path: "public/images/your-product-main.jpg", icon: FileImage },
    { type: "Side Photo", path: "public/images/your-product-side.jpg", icon: FileImage },
    { type: "Detail Photo", path: "public/images/your-product-detail.jpg", icon: FileImage },
  ]

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          File Upload Checklist
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Follow these steps to add your 3D model and photos to the platform:
          </p>

          <div className="space-y-3">
            {requiredFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <file.icon className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium">{file.type}</div>
                    <div className="text-sm text-gray-500">{file.path}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {uploadedFiles.includes(file.path) ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Next Steps:</h4>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. Place your files in the specified folders</li>
              <li>2. Edit `lib/user-products.ts` with your product details</li>
              <li>3. Update file paths to match your uploaded files</li>
              <li>4. Test your product on the `/products` page</li>
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
