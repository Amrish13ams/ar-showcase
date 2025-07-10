"use client"

import { useState } from "react"
import { ImageUploader } from "@/components/image-uploader"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { productPlaceholders } from "@/lib/placeholder-images"
import { ImageIcon, Plus, Trash2 } from "lucide-react"

export default function ImagesPage() {
  const [activeTab, setActiveTab] = useState("upload")

  // Get all placeholder images as a flat array
  const allPlaceholders = Object.values(productPlaceholders).flatMap((product) => Object.values(product))

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Product Images</h1>

      <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="upload">Upload Images</TabsTrigger>
          <TabsTrigger value="manage">Manage Images</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-6">
          <ImageUploader />
        </TabsContent>

        <TabsContent value="manage" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-dashed border-2 flex items-center justify-center h-64 cursor-pointer hover:bg-gray-50 transition-colors">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Plus className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-center text-sm text-gray-600">Add new product image</p>
              </CardContent>
            </Card>

            {/* Display placeholder images */}
            {allPlaceholders.slice(0, 8).map((placeholder, index) => (
              <Card key={index} className="overflow-hidden group relative">
                <CardContent className="p-0">
                  <div className="aspect-square relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={placeholder || "/placeholder.svg"}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Button variant="destructive" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-sm font-medium truncate">placeholder-{index + 1}.jpg</span>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
