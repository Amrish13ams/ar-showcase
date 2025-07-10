"use client"

import { PublicLayout } from "@/components/layouts/public-layout"
import { FileUploadHelper } from "@/components/file-upload-helper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileImage, Box, Code, ArrowRight } from 'lucide-react'
import Link from "next/link"

export default function UploadGuidePage() {
  return (
    <PublicLayout shopName="FurniCraft">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Your 3D Model & Photos</h1>
          <p className="text-gray-600">Follow this guide to integrate your furniture into the AR platform</p>
        </div>

        {/* File Upload Helper */}
        <div className="mb-8">
          <FileUploadHelper />
        </div>

        {/* Requirements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Box className="h-5 w-5 text-purple-600" />
                3D Model
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Badge variant="outline">GLB Recommended</Badge>
                  <Badge variant="outline" className="ml-2">GLTF Supported</Badge>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• File size: Under 10MB</li>
                  <li>• Optimized for web</li>
                  <li>• Proper scaling</li>
                  <li>• Clean geometry</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileImage className="h-5 w-5 text-blue-600" />
                Product Photos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Badge variant="outline">JPG/PNG</Badge>
                  <Badge variant="outline" className="ml-2">1200x1200px+</Badge>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Main product view</li>
                  <li>• Side/angle views</li>
                  <li>• Detail shots</li>
                  <li>• Lifestyle photos</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-green-600" />
                Product Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Badge variant="outline">TypeScript</Badge>
                  <Badge variant="outline" className="ml-2">JSON Format</Badge>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Product name & description</li>
                  <li>• Pricing information</li>
                  <li>• Dimensions & materials</li>
                  <li>• Category & tags</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Code Example */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Example Product Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm">
{`{
  id: 100,
  name: "Modern Leather Sofa",
  price: 89900,
  discountPrice: 79900,
  discount: 11,
  images: [
    "/images/leather-sofa-main.jpg",
    "/images/leather-sofa-side.jpg",
    "/images/leather-sofa-detail.jpg",
    "/images/leather-sofa-lifestyle.jpg"
  ],
  hasAR: true,
  arModel: "/models/leather-sofa.glb",
  description: "Premium leather sofa with...",
  dimensions: "220 × 85 × 90 cm",
  rating: 4.8,
  reviews: 0,
  category: "Living Room",
  material: "Genuine Leather",
  color: "Brown"
}`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
                View Products Gallery
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="/ar-test">
              <Button variant="outline" size="lg">
                Test AR Functionality
                <Box className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
