"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Check, AlertCircle } from "lucide-react"

export function ImageUploader() {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const selectedFiles = Array.from(e.target.files)
    setFiles(selectedFiles)

    // Create preview URLs
    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file))
    setPreviews((prev) => {
      // Revoke old preview URLs to avoid memory leaks
      prev.forEach((url) => URL.revokeObjectURL(url))
      return newPreviews
    })
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setUploading(true)
    setUploadStatus("idle")
    setErrorMessage("")

    try {
      // This is a mock upload - in a real app, you would upload to your server or cloud storage
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate successful upload
      setUploadStatus("success")

      // In a real app, you would get back URLs of the uploaded images
      console.log("Images would be uploaded to server")
    } catch (error) {
      setUploadStatus("error")
      setErrorMessage("Failed to upload images. Please try again.")
      console.error("Upload error:", error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Upload Product Images</CardTitle>
        <CardDescription>Upload high-quality images of your product from different angles</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="images">Product Images</Label>
          <div className="flex items-center gap-2">
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="cursor-pointer"
            />
          </div>
          <p className="text-sm text-muted-foreground">Select up to 4 images (main view, side view, detail, etc.)</p>
        </div>

        {previews.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {previews.map((preview, index) => (
              <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview || "/placeholder.svg"}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {uploadStatus === "success" && (
          <div className="flex items-center gap-2 text-sm font-medium text-green-600 bg-green-50 p-2 rounded-md">
            <Check size={16} />
            <span>Images uploaded successfully!</span>
          </div>
        )}

        {uploadStatus === "error" && (
          <div className="flex items-center gap-2 text-sm font-medium text-red-600 bg-red-50 p-2 rounded-md">
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleUpload} disabled={files.length === 0 || uploading} className="w-full">
          {uploading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Images
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
