"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PublicLayout } from "@/components/layouts/public-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, Filter, Sparkles, Star, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"



interface Product {
  id: string
  name: string
  description: string
  price: number
  discount_price?: number
  discount: number
  images: string[]
  has_ar: boolean
  ar_model_glb?: string
  status: string
  dimensions?: string
  rating: number
  reviews_count: number
  category?: string
  material?: string
  color?: string
  shop: string
  created_at: string
  updated_at: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name-asc")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/products/`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("Fetched products:", data)

        // Handle paginated response
        const productsData = data.results || data
        setProducts(Array.isArray(productsData) ? productsData : [])
        setError(null)
      } catch (err) {
        console.error("Error fetching products:", err)
        setError("Failed to load products. Please check if the backend is running.")
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Get unique categories from products
  const categories = ["all", ...new Set(products.map((p) => p.category).filter(Boolean))]

  // Filter products
  const filteredProducts = products.filter(
    (product) =>
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (categoryFilter === "all" || product.category === categoryFilter),
  )

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name)
      case "name-desc":
        return b.name.localeCompare(a.name)
      case "price-low":
        return (a.discount_price || a.price) - (b.discount_price || b.price)
      case "price-high":
        return (b.discount_price || b.price) - (a.discount_price || a.price)
      case "discount":
        return b.discount - a.discount
      case "rating":
        return b.rating - a.rating
      default:
        return 0
    }
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return (
      <PublicLayout shopName="AR Showcase" showSearch={false} cartCount={0}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
          <div className="mb-6 sm:mb-8">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-0">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <div className="p-3 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PublicLayout>
    )
  }

  if (error) {
    return (
      <PublicLayout shopName="AR Showcase" showSearch={false} cartCount={0}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
          <div className="text-center py-16">
            <div className="h-24 w-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to load products</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout shopName="AR Showcase" showSearch={false} cartCount={0}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
            Our Product Collection
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Discover premium products with AR visualization technology ({products.length} products)
          </p>
        </div>

        {/* Filters */}
        <div className="sticky top-16 bg-white/90 backdrop-blur-md z-10 pb-4 sm:pb-6 mb-6 sm:mb-8 border-b border-gray-200 rounded-xl shadow-sm">
          <div className="flex flex-col gap-3 sm:gap-4 items-start justify-between p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <span className="font-medium text-gray-700 text-sm sm:text-base">Filters & Search</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-300 focus:border-blue-500 transition-colors text-sm"
                />
              </div>

              <div className="flex gap-3 sm:gap-4">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-40 bg-white border-gray-300 text-sm">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.slice(1).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48 bg-white border-gray-300 text-sm">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name-asc">Name: A–Z</SelectItem>
                    <SelectItem value="name-desc">Name: Z–A</SelectItem>
                    <SelectItem value="price-low">Price: Low–High</SelectItem>
                    <SelectItem value="price-high">Price: High–Low</SelectItem>
                    <SelectItem value="discount">Best Discount</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {sortedProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border-0 bg-white overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    <img
                      src={product.images[0] || "/placeholder.svg?height=300&width=400&text=No+Image"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=300&width=400&text=No+Image"
                      }}
                    />

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.has_ar && (
                        <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg text-xs">
                          <Sparkles className="h-2 w-2 mr-1" />
                          AR
                        </Badge>
                      )}
                      {product.discount > 0 && (
                        <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-lg text-xs">
                          -{product.discount}%
                        </Badge>
                      )}
                    </div>

                    {/* Category Badge */}
                    {product.category && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-white/90 text-gray-700 text-xs">
                          {product.category}
                        </Badge>
                      </div>
                    )}

                    {/* Quick View Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <Button
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-gray-900 hover:bg-gray-100 text-xs px-3 py-1"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>

                  <div className="p-3 space-y-2">
                    <div>
                      <h3 className="font-semibold text-sm lg:text-base line-clamp-2 group-hover:text-blue-600 transition-colors mb-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-2 hidden sm:block">{product.description}</p>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium ml-1">{product.rating || 0}</span>
                      </div>
                      <span className="text-xs text-gray-500 hidden md:inline">({product.reviews_count || 0})</span>
                    </div>

                    {/* Material & Color - Hidden on mobile */}
                    <div className="hidden lg:flex items-center gap-2 text-xs text-gray-600">
                      {product.material && <span>📦 {product.material}</span>}
                      {product.color && <span>🎨 {product.color}</span>}
                    </div>

                    {/* Price */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-green-600 text-sm lg:text-base">
                          {formatPrice(product.discount_price || product.price)}
                        </span>
                        {product.discount > 0 && product.discount_price && (
                          <span className="text-xs text-gray-500 line-through hidden sm:inline">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>
                      {product.discount > 0 && product.discount_price && (
                        <div className="text-xs text-green-600 font-medium hidden sm:block">
                          Save {formatPrice(product.price - product.discount_price)}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {sortedProducts.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">
              {products.length === 0
                ? "No products available. Add some products from the dashboard."
                : "Try adjusting your search or filter criteria"}
            </p>
          </div>
        )}
      </div>
    </PublicLayout>
  )
}
