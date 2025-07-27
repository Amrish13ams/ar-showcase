"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import {
  Eye,
  ArrowLeft,
  Share2,
  Heart,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Product {
  id: number
  name: string
  description: string
  price: number
  discount_price?: number
  discount_percentage: number
  effective_price: number
  company: {
    id: number
    name: string
    subdomain: string
    description: string
    logo: string
  }
  category: string
  images: string[]
  dimensions: string
  weight: string
  material: string
  color: string
  ar_scale: number
  ar_placement: "floor" | "wall" | "table"
  has_ar: boolean
  glb_file: string
  usdz_file: string
  featured: boolean
  status: string
  created_at: string
  updated_at: string
}

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [companyDetails, setCompanyDetails] = useState<any | null>(null)


  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string)
    }
  }, [params.id])
  const fetchCompanyBySubdomain = async (subdomain: string) => {
    try {
      const res = await fetch(`/api/companies/${subdomain}`)
      if (!res.ok) throw new Error("Company not found")
      const company = await res.json()
      setCompanyDetails(company)
      console.log("📱 Company WhatsApp:", product.featured) 
    } catch (err) {
      console.error("❌ Failed to fetch company by subdomain", err)
    }
  }
  
  const handleBuyNow = async () => {
    try {
      console.log("🛒 Buy Now clicked")
  
      // Re-fetch product (in case of stale state)
      const productRes = await fetch(`/api/products/${params.id}`)
      if (!productRes.ok) throw new Error("Failed to fetch product")
      const freshProduct = await productRes.json()
  
      // Re-fetch company
      const subdomain = freshProduct.company?.subdomain
      const companyRes = await fetch(`/api/companies/${subdomain}`)
      if (!companyRes.ok) throw new Error("Failed to fetch company")
      const freshCompany = await companyRes.json()
  
      console.log("📦 Fresh Product:", freshProduct)
      console.log("🏢 Fresh Company:", freshCompany)
  
      const message = `Hi, I'm interested in buying *${freshProduct.name}* (Product ID: ${freshProduct.id}). Please share more details.`
      const encodedMessage = encodeURIComponent(message)
      const rawNumber = freshCompany.company.whatsapp
      const whatsappNumber = rawNumber.replace(/\D/g, "")
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
  
      console.log("📨 WhatsApp Message:", message)
      console.log("🌐 Redirecting to:", whatsappUrl)
  
      window.open(whatsappUrl, "_blank")
    } catch (err) {
      console.error("❌ Error in handleBuyNow:", err)
      toast({
        title: "Error",
        description: "Unable to contact seller via WhatsApp",
        variant: "destructive",
      })
    }
  }
  
  

  const fetchProduct = async (id: string) => {
    try {
      console.log(`🛍️ Fetching product: ${id}`)
      const response = await fetch(`/api/products/${id}`)
      if (!response.ok) throw new Error("Product not found")
  
      const data = await response.json()
      console.log("📦 Product data:", data)
      setProduct(data)
  
      // Get company from subdomain
      if (data?.company?.subdomain) {
        fetchCompanyBySubdomain(data.company.subdomain)
      }
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

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product?.name,
          text: product?.description,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Link copied!",
          description: "Product link copied to clipboard",
        })
      }
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    toast({
      title: isLiked ? "Removed from favorites" : "Added to favorites",
      description: isLiked ? "Product removed from your favorites" : "Product added to your favorites",
    })
  }

  const nextImage = () => {
    if (product && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
    }
  }

  const prevImage = () => {
    if (product && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded-xl"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.push("/")} className="hover:bg-blue-50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Store
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center space-x-2">
                {product.company.logo && (
                  <img
                    src={product.company.logo || "/placeholder.svg?height=32&width=32&text=Logo"}
                    alt={product.company.name}
                    className="h-8 w-8 rounded-lg object-cover"
                  />
                )}
                <span className="font-medium text-gray-900">{product.company.name}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
              {/* <Button
                variant="outline"
                size="sm"
                onClick={handleLike}
                className={isLiked ? "text-red-500 border-red-200" : ""}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              </Button> */}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <Card className="overflow-hidden border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={product.images[currentImageIndex] || "/placeholder.svg?height=500&width=500&text=Product"}
                    alt={product.name}
                    className="w-full h-96 lg:h-[500px] object-cover"
                  />

                  {/* Image Navigation */}
                  {product.images.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.discount_percentage > 0 && (
                      <Badge className="bg-red-500 text-white shadow-lg">{product.discount_percentage}% OFF</Badge>
                    )}
                    {product.has_ar && (
                      <Badge className="bg-purple-500 text-white shadow-lg">
                        <Eye className="h-3 w-3 mr-1" />
                        AR Available
                      </Badge>
                    )}
                    {product.featured && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">
                        ⭐ Featured
                      </Badge>
                    )}
                  </div>

                  {/* AR Button */}
                  {product.has_ar && (
                    <div className="absolute bottom-4 right-4">
                      <Link href={`/products/${product.id}/ar`}>
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg">
                          <Eye className="h-4 w-4 mr-2" />
                          View in AR
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index
                        ? "border-purple-500 shadow-lg"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.category && (
                  <Badge variant="outline" className="border-purple-200 text-purple-600">
                    {product.category}
                  </Badge>
                )}
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">(4.8)</span>
                </div>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

              <div className="flex items-center space-x-4 mb-6">
                {product.discount_price ? (
                  <>
                    <span className="text-3xl font-bold text-gray-900">{formatPrice(product.effective_price)}</span>
                    <span className="text-xl text-gray-500 line-through">{formatPrice(product.price)}</span>
                    <Badge className="bg-green-100 text-green-800">
                      Save {formatPrice(product.price - product.effective_price)}
                    </Badge>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                )}
              </div>
            </div>

            {product.description && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Product Specifications */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Specifications</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {product.dimensions && (
                    <div>
                      <span className="text-gray-500">Dimensions:</span>
                      <p className="font-medium">{product.dimensions}</p>
                    </div>
                  )}
                  {product.weight && (
                    <div>
                      <span className="text-gray-500">Weight:</span>
                      <p className="font-medium">{product.weight}</p>
                    </div>
                  )}
                  {product.material && (
                    <div>
                      <span className="text-gray-500">Material:</span>
                      <p className="font-medium">{product.material}</p>
                    </div>
                  )}
                  {product.color && (
                    <div>
                      <span className="text-gray-500">Color:</span>
                      <p className="font-medium">{product.color}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                {/* <Button
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button> */}
                {product.has_ar && (
                  <Link href={`/products/${product.id}/ar`} className="flex-1">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full border-purple-200 text-purple-600 hover:bg-purple-50 bg-transparent"
                    >
                      <Eye className="h-5 w-5 mr-2" />
                      Try AR
                    </Button>
                  </Link>
                )}
              </div>

              <Button
                size="lg"
                variant="outline"
                className="w-full bg-transparent"
                onClick={handleBuyNow}
              >
                Buy Now whatsapp
              </Button>

            </div>

            {/* Features */}
            {/* <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-blue-50">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Truck className="h-5 w-5 text-green-600" />
                    <span>Free Delivery</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <span>1 Year Warranty</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RotateCcw className="h-5 w-5 text-purple-600" />
                    <span>Easy Returns</span>
                  </div>
                </div>
              </CardContent>
            </Card> */}

            {/* Contact Information */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Contact Seller</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-500">Store:</span> {product.company.name}
                  </p>
                  {product.company.description && (
                    <p>
                      <span className="text-gray-500">About:</span> {product.company.description}
                    </p>
                  )}
                </div>
                {/* <div className="flex space-x-2 mt-4">
                  <Button variant="outline" size="sm">
                    Contact Store
                  </Button>
                  <Button variant="outline" size="sm">
                    View All Products
                  </Button>
                </div> */}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
