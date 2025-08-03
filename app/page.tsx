"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, Sparkles, ShoppingBag, ArrowRight, Search, X } from "lucide-react"

interface Product {
  id: number
  name: string
  description: string
  price: number
  discount_price?: number
  discount_percentage: number
  effective_price: number
  images: string[]
  has_ar: boolean
  category: string
  featured: boolean
}

interface Company {
  id: number
  shop_name: string
  logo: string
  description: string
  subdomain: string
  phone: string
  website: string
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const getSubdomain = () => {
    if (typeof window === "undefined") return null

    const hostname = window.location.hostname

    // For subdomain.localhost:3000 format
    if (hostname.includes("localhost")) {
      const parts = hostname.split(".")
      if (parts.length > 1 && parts[0] !== "localhost") {
        return parts[0] // demo.localhost → demo
      }
    }

    // For production domains
    if (hostname.includes(".") && !hostname.includes("localhost")) {
      const parts = hostname.split(".")
      if (parts.length > 2) {
        return parts[0] // demo.yourdomain.com → demo
      }
    }

    // Default fallback for localhost
    return "demo"
  }

  const fetchData = async () => {
    try {
      const subdomain = getSubdomain()
      console.log(`🌐 Fetching data for subdomain: ${subdomain}`)

      // Use the new API endpoint
      const response = await fetch(`/api/companies/${subdomain}`)

      if (!response.ok) {
        throw new Error("Failed to fetch data")
      }

      const data = await response.json()
      console.log("📦 Received data:", data)

      setCompany(data.company)
      setProducts(data.products || [])
    } catch (error) {
      console.error("Error fetching data:", error)
      setError("Failed to load store data")

      // Fallback demo data
      setCompany({
        id: 1,
        shop_name: "Demo Store",
        subdomain: "demo",
        logo: "",
        description: "Premium products with AR visualization",
        phone: "+91 98765 43210",
        website: "https://demo.localhost:3000",
      })

      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products

    const query = searchQuery.toLowerCase()
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query)
    )
  }, [products, searchQuery])

  // Get featured products from filtered results
  const filteredFeaturedProducts = useMemo(() => {
    return filteredProducts.filter((p) => p.featured).slice(0, 3)
  }, [filteredProducts])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {company?.logo && (
                <img
                  src={company.logo || "/placeholder.svg?height=48&width=48&text=Logo"}
                  alt={company.shop_name}
                  className="h-12 w-12 rounded-xl object-cover shadow-lg"
                />
              )}
              <div>
              <h1 className="text-2xl font-bold text-black">
                {company?.shop_name || "AR Showcase"}
              </h1>
                {company?.description && <p className="text-gray-600 text-sm">{company.description}</p>}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
                <Sparkles className="h-4 w-4 mr-1" />
                AR Enabled
              </Badge>
              <div className="text-sm text-gray-500 bg-white/50 px-3 py-1 rounded-full">
                {searchQuery ? `${filteredProducts.length} of ${products.length}` : `${products.length}`} Products
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-blue-600/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              {company?.shop_name || "AR Showcase"}
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            {company?.description || "Experience our products in AR - See how they look in your space before you buy"}
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search products, categories, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-12 py-4 text-lg bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-sm text-gray-600 mt-3">
                {filteredProducts.length === 0 
                  ? "No products found matching your search" 
                  : `Found ${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} matching "${searchQuery}"`
                }
              </p>
            )}
          </div>

          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 max-w-md mx-auto shadow-sm">
              <p className="text-yellow-800 text-sm">⚠️ {error}</p>
            </div>
          )}

          {products.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                disabled
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg opacity-60 cursor-not-allowed"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Shop Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                disabled
                className="border-purple-200 text-purple-600 bg-transparent opacity-60 cursor-not-allowed"
              >
                <Eye className="h-5 w-5 mr-2" />
                Try AR Experience
              </Button>
            </div>
          )}

        </div>
      </div>

      {/* Products Grid */}
      <main className="container mx-auto px-4 py-16">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto shadow-lg">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                {searchQuery ? "No Products Found" : "No Products Available"}
              </h2>
              <p className="text-gray-600 mb-6">
                {searchQuery 
                  ? `No products match "${searchQuery}". Try a different search term.`
                  : "This store is being set up. Check back later for amazing products!"
                }
              </p>
              {searchQuery && (
                <Button 
                  onClick={clearSearch} 
                  variant="outline" 
                  className="mb-4 border-purple-200 text-purple-600"
                >
                  Clear Search
                </Button>
              )}
              {company?.phone && !searchQuery && (
                <div className="text-sm text-gray-500">
                  <p>Contact:<strong> {company.shop_name}</strong> </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Featured Products Section */}
            {filteredFeaturedProducts.length > 0 && (
              <div className="mb-16">
                <div className="text-center mb-12">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    {searchQuery ? "Featured Search Results" : "Featured Products"}
                  </h3>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    {searchQuery 
                      ? `Featured products matching "${searchQuery}"`
                      : "Discover our handpicked selection of premium products with AR visualization"
                    }
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredFeaturedProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg"
                    >
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden rounded-t-xl">
                          <img
                            src={product.images[0] || "/placeholder.svg?height=300&width=300&text=Product"}
                            alt={product.name}
                            className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                          />

                          {/* Badges */}
                          <div className="absolute top-4 left-4 flex flex-col gap-2">
                            {product.discount_percentage > 0 && (
                              <Badge className="bg-red-500 text-white shadow-lg">
                                {product.discount_percentage}% OFF
                              </Badge>
                            )}
                            {product.has_ar && (
                              <Badge className="bg-purple-500 text-white shadow-lg">
                                <Eye className="h-3 w-3 mr-1" />
                                AR
                              </Badge>
                            )}
                            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">
                              ⭐ Featured
                            </Badge>
                          </div>

                          {/* Quick AR Button */}
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {product.has_ar && (
                              <Link href={`/products/${product.id}/ar`}>
                                <Button size="sm" className="bg-purple-600 hover:bg-purple-700 shadow-lg">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                            )}
                          </div>

                          {/* Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        <div className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-bold text-lg text-gray-900 line-clamp-2 flex-1">{product.name}</h3>
                          </div>

                          {product.description && (
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                              {product.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-2">
                              {product.discount_price ? (
                                <>
                                  <span className="text-xl font-bold text-gray-900">
                                    {formatPrice(product.effective_price)}
                                  </span>
                                  <span className="text-sm text-gray-500 line-through">
                                    {formatPrice(product.price)}
                                  </span>
                                </>
                              ) : (
                                <span className="text-xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                              )}
                            </div>

                            {product.category && (
                              <Badge variant="outline" className="text-xs border-purple-200 text-purple-600">
                                {product.category}
                              </Badge>
                            )}
                          </div>

                          <Link href={`/products/${product.id}`} className="block">
                            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg">
                              View Details
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* All Products Section */}
            <div>
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  {searchQuery ? "Search Results" : "All Products"}
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {searchQuery 
                    ? `Products matching "${searchQuery}"`
                    : "Browse our complete collection of products"
                  }
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-0 shadow-lg"
                  >
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden rounded-t-xl">
                        <img
                          src={product.images[0] || "/placeholder.svg?height=300&width=300&text=Product"}
                          alt={product.name}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          {product.discount_percentage > 0 && (
                            <Badge className="bg-red-500 text-white shadow-md">
                              {product.discount_percentage}% OFF
                            </Badge>
                          )}
                          {product.has_ar && (
                            <Badge className="bg-purple-500 text-white shadow-md">
                              <Eye className="h-3 w-3 mr-1" />
                              AR
                            </Badge>
                          )}
                        </div>

                        {/* Quick AR Button */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          {product.has_ar && (
                            <Link href={`/products/${product.id}/ar`}>
                              <Button size="sm" className="bg-purple-600 hover:bg-purple-700 shadow-md">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">{product.name}</h3>
                        </div>

                        {product.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                        )}

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            {product.discount_price ? (
                              <>
                                <span className="text-lg font-bold text-gray-900">
                                  {formatPrice(product.effective_price)}
                                </span>
                                <span className="text-sm text-gray-500 line-through">{formatPrice(product.price)}</span>
                              </>
                            ) : (
                              <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
                            )}
                          </div>

                          {product.category && (
                            <Badge variant="outline" className="text-xs border-purple-200 text-purple-600">
                              {product.category}
                            </Badge>
                          )}
                        </div>

                        <Link href={`/products/${product.id}`} className="block">
                          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-white/20 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold text-lg mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {company?.shop_name || "AR Showcase"}
              </h4>
              <p className="text-gray-600 mb-4">{company?.description || "Experience products in Augmented Reality"}</p>
              {company?.phone && <p className="text-sm text-gray-500">📞 <strong> {company.phone} </strong> </p>}
            </div>

            <div>
              <h5 className="font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-purple-600 transition-colors">
                    All Products
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-600 transition-colors">
                    AR Experience
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-600 transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Features</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✨ AR Visualization</li>
                <li>📱 Mobile Friendly</li>
                <li>🚚 Fast Delivery</li>
                <li>💯 Quality Assured</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2024 {company?.shop_name || "AR Showcase"}. All rights reserved.</p>
            <p className="text-sm mt-2">Powered by MCSAK AR Solutions Ph: 6381612505</p>
          </div>
        </div>
      </footer>
    </div>
  )
}