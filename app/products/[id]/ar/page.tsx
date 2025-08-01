"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Smartphone, Monitor, AlertCircle, Eye } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import '@google/model-viewer'
// import { Canvas } from "@react-three/fiber"
// import { OrbitControls, useGLTF } from "@react-three/drei"
// import { Suspense } from "react"


// function Model({ url }: { url: string }) {
//   const { scene } = useGLTF(url)
//   return <primitive object={scene} scale={1} />
// }
interface Product {
  id: number
  name: string
  description: string
  price: number
  discount_price?: number
  company: {
    name: string
    subdomain: string
  }
  images: string[]
  has_ar: boolean
  glb_file: string
  usdz_file: string
  ar_scale: number
  ar_placement: "floor" | "wall" | "table"
}

export default function ARPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [deviceType, setDeviceType] = useState<"ios" | "android" | "desktop">("desktop")

  useEffect(() => {
    // Detect device type
    const userAgent = navigator.userAgent.toLowerCase()
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setDeviceType("ios")
    } else if (/android/.test(userAgent)) {
      setDeviceType("android")
    } else {
      setDeviceType("desktop")
    }

    if (params.id) {
      fetchProduct(params.id as string)
    }
  }, [params.id])

  const fetchProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`)
      if (!response.ok) {
        throw new Error("Product not found")
      }
      const data = await response.json()
      setProduct(data)
    } catch (error) {
      console.error("Error fetching product:", error)
      toast({
        title: "Error",
        description: "Product not found",
        variant: "destructive",
      })
      router.push("/")
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleARView = () => {
    if (!product) return

    if (deviceType === "ios" && product.usdz_file) {
      // iOS AR Quick Look
      const link = document.createElement("a")
      link.href = product.usdz_file
      link.rel = "ar"
      link.click()
    } else if (deviceType === "android" && product.glb_file) {
      // Android Scene Viewer
      const intent = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(product.glb_file)}&mode=ar_only#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`
      window.location.href = intent
    } else {
      toast({
        title: "AR not available",
        description: "AR viewing is only available on mobile devices",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Button onClick={() => router.push("/")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Store
          </Button>
        </div>
      </div>
    )
  }

  if (!product.has_ar) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">AR Not Available</h2>
            <p className="text-gray-600 mb-6">This product doesn't have AR visualization available yet.</p>
            <div className="space-y-2">
              <Button onClick={() => router.push(`/products/${product.id}`)} className="w-full">
                View Product Details
              </Button>
              <Button onClick={() => router.push("/")} variant="outline" className="w-full">
                Back to Store
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => router.push(`/products/${product.id}`)}
              className="hover:bg-purple-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Product
            </Button>
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <Eye className="h-4 w-4 mr-1" />
              AR Experience
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Product Info */}
          <Card className="mb-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <img
                  src={product.images[0] || "/placeholder.svg?height=80&width=80&text=Product"}
                  alt={product.name}
                  className="h-20 w-20 rounded-lg object-cover shadow-lg"
                />
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
                  <div className="flex items-center space-x-4">
                    <span className="text-xl font-bold text-purple-600">
                      {product.discount_price ? formatPrice(product.discount_price) : formatPrice(product.price)}
                    </span>
                    {product.discount_price && (
                      <span className="text-gray-500 line-through">{formatPrice(product.price)}</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AR Instructions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Mobile Instructions */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Smartphone className="h-6 w-6 text-purple-600" />
                  <span>Mobile AR Experience</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-purple-800">For the best AR experience:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Use your smartphone or tablet</li>
                    <li>• Ensure good lighting in your room</li>
                    <li>• Point camera at a flat surface</li>
                    <li>• Move device slowly to scan the area</li>
                  </ul>
                </div>

                {deviceType === "desktop" ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      📱 Open this page on your mobile device for the full AR experience
                    </p>
                  </div>
                ) : (
                  <Button
                    onClick={handleARView}
                    size="lg"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                  >
                    <Eye className="h-5 w-5 mr-2" />
                    Launch AR View
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Desktop Preview */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Monitor className="h-6 w-6 text-blue-600" />
                  <span>3D Preview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-lg p-8 text-center">
                  <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-gray-500">
                      {/* <Eye className="h-12 w-12 mx-auto mb-2" /> */}
                      <iframe
                        src={product.glb_file}
                        style={{ width: '100%', height: '200px', border: 'none' }}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Interactive 3D model will be displayed here on supported devices
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Device Compatibility */}
          <Card className="mt-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Device Compatibility</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-600">✅ Supported Devices</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• iPhone 6s and newer (iOS 11+)</li>
                    <li>• iPad (5th generation) and newer</li>
                    <li>• Android devices with ARCore support</li>
                    <li>• Samsung Galaxy S7 and newer</li>
                    <li>• Google Pixel devices</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-600">ℹ️ Requirements</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Good lighting conditions</li>
                    <li>• Flat surface for placement</li>
                    <li>• Stable internet connection</li>
                    <li>• Camera permissions enabled</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QR Code for Mobile */}
          {deviceType === "desktop" && (
            <Card className="mt-8 border-0 shadow-xl bg-gradient-to-r from-purple-50 to-pink-50">
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-semibold mb-4">Scan with Mobile Device</h3>
                <div className="bg-white p-4 rounded-lg inline-block shadow-lg">
                  <div className="h-32 w-32 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-500">QR Code</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Scan this QR code with your mobile device to open the AR experience
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
