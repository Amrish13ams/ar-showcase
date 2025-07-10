"use client"
export const dynamic = "force-dynamic" // Disable static generation
import * as LucideIcons from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  Save,
  Eye,
  Upload,
  Trash2,
  Plus,
  Home,
  Star,
  TrendingUp,
  Sparkles,
  Shield,
  Loader2,
  CheckCircle,
  AlertCircle,
  Bug,
  RefreshCw,
  Database,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useDashboard } from "@/contexts/dashboard-context"
import { ColorPicker } from "@/components/ui/color-picker"
import {
  saveHomepageData,
  loadHomepageData,
  getDefaultHomepageData,
  getStorageInfo,
  clearAllData,
  forceLoadDefaults,
  type HomepageData,
} from "@/lib/homepage-storage"

interface HeroSection {
  title: string
  subtitle: string
  description: string
  primaryButtonText: string
  secondaryButtonText: string
  backgroundImage: string
  logoImage: string
}

interface FeatureCard {
  id: string
  title: string
  description: string
  icon: string
  color: string
  enabled: boolean
}

interface FeaturedProduct {
  id: string
  name: string
  description: string
  price: string
  rating: string
  image: string
  arEnabled: boolean
  enabled: boolean
}

interface StatsSection {
  stat1: { value: string; label: string }
  stat2: { value: string; label: string }
  stat3: { value: string; label: string }
  stat4: { value: string; label: string }
  enabled: boolean
}

interface TrustIndicator {
  id: string
  title: string
  description: string
  icon: string
  enabled: boolean
}

interface SEOSettings {
  metaTitle: string
  metaDescription: string
  keywords: string
  ogImage: string
}

export default function HomepageEditor() {
  const { toast } = useToast()
  const { addNotification } = useDashboard()

  // Loading and save states
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [debugMode, setDebugMode] = useState(false)
  interface StorageInfo {
    hasGlobalData: boolean
    globalDataTimestamp: string
    saveHistoryCount: number
    lastSaveAttempt?: { success: boolean; timestamp: string; error?: string }
    recentSaves?: { success: boolean; timestamp: string; error?: string }[]
  }
  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null)

  // Hero Section State
  const [heroSection, setHeroSection] = useState<HeroSection>({
    title: "",
    subtitle: "",
    description: "",
    primaryButtonText: "",
    secondaryButtonText: "",
    backgroundImage: "",
    logoImage: "",
  })

  // Features State
  const [features, setFeatures] = useState<FeatureCard[]>([])

  // Featured Products State
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([])

  // Stats Section State
  const [statsSection, setStatsSection] = useState<StatsSection>({
    stat1: { value: "", label: "" },
    stat2: { value: "", label: "" },
    stat3: { value: "", label: "" },
    stat4: { value: "", label: "" },
    enabled: true,
  })

  // Trust Indicators State
  const [trustIndicators, setTrustIndicators] = useState<TrustIndicator[]>([])

  // SEO Settings State
  const [seoSettings, setSeoSettings] = useState<SEOSettings>({
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    ogImage: "",
  })

  const updateStorageInfo = useCallback(() => {
    const info = getStorageInfo()
    setStorageInfo(info)
  }, []) // FIXED: Empty dependency array

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        console.log("🚀 Homepage Editor: Starting data load")

        const savedData = loadHomepageData()

        if (savedData) {
          console.log("📥 Loading saved data")
          setHeroSection(savedData.heroSection)
          setFeatures(savedData.features)
          setFeaturedProducts(savedData.featuredProducts)
          setStatsSection(savedData.statsSection)
          setTrustIndicators(savedData.trustIndicators)
          setSeoSettings(savedData.seoSettings)
          setLastSaved(savedData.lastUpdated)
        } else {
          console.log("🏠 Loading default data")
          const defaultData = getDefaultHomepageData()
          setHeroSection(defaultData.heroSection)
          setFeatures(defaultData.features)
          setFeaturedProducts(defaultData.featuredProducts)
          setStatsSection(defaultData.statsSection)
          setTrustIndicators(defaultData.trustIndicators)
          setSeoSettings(defaultData.seoSettings)
        }

        // Update storage info after loading
        updateStorageInfo()      } catch (error) {
        console.error("❌ Error loading homepage data:", error)
        toast({
          title: "Error Loading Data",
          description: "Failed to load homepage data. Using defaults.",
          variant: "destructive",
        })

        // Load defaults as fallback
        const defaultData = getDefaultHomepageData()
        setHeroSection(defaultData.heroSection)
        setFeatures(defaultData.features)
        setFeaturedProducts(defaultData.featuredProducts)
        setStatsSection(defaultData.statsSection)
        setTrustIndicators(defaultData.trustIndicators)
        setSeoSettings(defaultData.seoSettings)
      } finally {
        setIsLoading(false)
        setIsInitialized(true)
        console.log("✅ Homepage Editor: Data loading complete")
      }
    }

    loadData()
  }, [toast]) // FIXED: Only toast dependency, removed updateStorageInfo

  // Mark as having unsaved changes when data changes
  useEffect(() => {
    if (isInitialized && !isLoading) {
      setHasUnsavedChanges(true)
      console.log("📝 Changes detected - marking as unsaved")
    }
  }, [heroSection, features, featuredProducts, statsSection, trustIndicators, seoSettings, isInitialized, isLoading])

  const handleSave = useCallback(async () => {
    setIsSaving(true)
    console.log("💾 Starting save operation...")

    try {
      const dataToSave: HomepageData = {
        heroSection,
        features,
        featuredProducts,
        statsSection,
        trustIndicators,
        seoSettings,
        lastUpdated: new Date().toISOString(),
      }

      console.log("📤 Saving data:", {
        heroTitle: dataToSave.heroSection.title,
        featuresCount: dataToSave.features.length,
        productsCount: dataToSave.featuredProducts.length,
      })

      const success = await saveHomepageData(dataToSave)

      if (success) {
        console.log("🎉 Save successful!")
        setHasUnsavedChanges(false)
        setLastSaved(dataToSave.lastUpdated)

        // Update storage info after successful save
        updateStorageInfo()
        toast({
          title: "✅ Homepage Saved Successfully!",
          description: "Your homepage changes have been saved and are now live.",
        })

        addNotification("Homepage Updated", "Your homepage customizations are now live!")
      } else {
        throw new Error("Save operation returned false")
      }
    } catch (error) {
      console.error("❌ Save failed:", error)
      toast({
        title: "❌ Save Failed",
        description: "Failed to save homepage changes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
      // Update storage info regardless of save result
      updateStorageInfo()    }
  }, [heroSection, features, featuredProducts, statsSection, trustIndicators, seoSettings, toast, addNotification]) // FIXED: Removed updateStorageInfo from dependencies

  const handlePreview = useCallback(() => {
    if (hasUnsavedChanges) {
      toast({
        title: "Unsaved Changes",
        description: "You have unsaved changes. Save first to see them in preview.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Opening Preview",
      description: "Opening homepage preview in a new tab...",
    })
    window.open("/", "_blank")
  }, [hasUnsavedChanges, toast])

  const addFeature = useCallback(() => {
    const newFeature: FeatureCard = {
      id: Date.now().toString(),
      title: "New Feature",
      description: "Feature description",
      icon: "Star",
      color: "blue",
      enabled: true,
    }
    setFeatures((prev) => [...prev, newFeature])
  }, [])

  const removeFeature = useCallback((id: string) => {
    setFeatures((prev) => prev.filter((f) => f.id !== id))
  }, [])

  const updateFeature = useCallback((id: string, updates: Partial<FeatureCard>) => {
    console.log("Updating feature:", id, updates)
    setFeatures((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)))
  }, [])

  const addProduct = useCallback(() => {
    const newProduct: FeaturedProduct = {
      id: Date.now().toString(),
      name: "New Product",
      description: "Product description",
      price: "₹0",
      rating: "5.0",
      image: "/placeholder.svg?height=300&width=400",
      arEnabled: false,
      enabled: true,
    }
    setFeaturedProducts((prev) => [...prev, newProduct])
  }, [])

  const removeProduct = useCallback((id: string) => {
    setFeaturedProducts((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const updateProduct = useCallback((id: string, updates: Partial<FeaturedProduct>) => {
    setFeaturedProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)))
  }, [])

  const updateTrustIndicator = useCallback((id: string, updates: Partial<TrustIndicator>) => {
    setTrustIndicators((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)))
  }, [])

  const toggleDebugMode = useCallback(() => {
    setDebugMode((prev) => !prev)
    setStorageInfo(getStorageInfo()) // Direct call instead of updateStorageInfo
  }, [])

  const handleClearData = useCallback(() => {
    clearAllData()
    setStorageInfo(getStorageInfo()) // Direct call instead of updateStorageInfo
    toast({
      title: "Data Cleared",
      description: "All saved data has been cleared.",
    })
  }, [toast])

  const handleLoadDefaults = useCallback(() => {
    const defaults = forceLoadDefaults()
    setHeroSection(defaults.heroSection)
    setFeatures(defaults.features)
    setFeaturedProducts(defaults.featuredProducts)
    setStatsSection(defaults.statsSection)
    setTrustIndicators(defaults.trustIndicators)
    setSeoSettings(defaults.seoSettings)
    setLastSaved(defaults.lastUpdated)
    setHasUnsavedChanges(false)
    setStorageInfo(getStorageInfo()) // Direct call instead of updateStorageInfo
    toast({
      title: "Defaults Loaded",
      description: "Default homepage data has been loaded.",
    })
  }, [toast])

  if (isLoading) {
    return (
      <DashboardLayout shopName="FurniCraft">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading homepage editor...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout shopName="FurniCraft">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Homepage Editor</h1>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-gray-600">Customize your homepage content and layout</p>
              {hasUnsavedChanges && (
                <Badge variant="outline" className="text-orange-600 border-orange-200">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Unsaved Changes
                </Badge>
              )}
              {lastSaved && !hasUnsavedChanges && (
                <Badge variant="outline" className="text-green-600 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Saved {new Date(lastSaved).toLocaleTimeString()}
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={toggleDebugMode} className="ml-2">
                <Bug className="h-4 w-4 mr-1" />
                {debugMode ? "Hide Debug" : "Debug"}
              </Button>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handlePreview}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="bg-gradient-to-r from-blue-600 to-purple-600">
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Debug Panel */}
        {debugMode && (
          <Card className="bg-gray-50 border-gray-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Storage Debug Information
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={updateStorageInfo}>
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Refresh
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleLoadDefaults}>
                    <Home className="h-4 w-4 mr-1" />
                    Load Defaults
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleClearData} className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear Data
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Storage Status</h4>
                  <div className="text-xs font-mono bg-gray-100 p-2 rounded">
                    <div>Has Global Data: {storageInfo?.hasGlobalData ? "✅ Yes" : "❌ No"}</div>
                    <div>Data Timestamp: {storageInfo?.globalDataTimestamp || "None"}</div>
                    <div>Save History: {storageInfo?.saveHistoryCount || 0} attempts</div>
                    <div>Last Save: {storageInfo?.lastSaveAttempt?.success ? "✅ Success" : "❌ Failed"}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Current State</h4>
                  <div className="text-xs font-mono bg-gray-100 p-2 rounded">
                    <div>Unsaved Changes: {hasUnsavedChanges ? "⚠️ Yes" : "✅ No"}</div>
                    <div>Is Saving: {isSaving ? "🔄 Yes" : "✅ No"}</div>
                    <div>Features Count: {features.length}</div>
                    <div>Products Count: {featuredProducts.length}</div>
                  </div>
                </div>
              </div>
              {storageInfo?.recentSaves && storageInfo.recentSaves.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Recent Save Attempts</h4>
                  <div className="text-xs font-mono bg-gray-100 p-2 rounded max-h-32 overflow-y-auto">
                    {storageInfo.recentSaves.map((save: any, i: number) => (
                      <div key={i} className="py-1 border-b border-gray-200">
                        {new Date(save.timestamp).toLocaleTimeString()} - {save.success ? "✅ Success" : "❌ Failed"}
                        {save.error && ` (${save.error})`}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="hero" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="hero">Hero Section</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="trust">Trust</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          {/* Hero Section */}
          <TabsContent value="hero">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Hero Section
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="hero-title">Main Title</Label>
                      <Textarea
                        id="hero-title"
                        value={heroSection.title}
                        onChange={(e) => setHeroSection((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Welcome to\nYour Store"
                        className="min-h-[80px]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hero-subtitle">Subtitle Badge</Label>
                      <Input
                        id="hero-subtitle"
                        value={heroSection.subtitle}
                        onChange={(e) => setHeroSection((prev) => ({ ...prev, subtitle: e.target.value }))}
                        placeholder="AR Furniture Visualization"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hero-description">Description</Label>
                      <Textarea
                        id="hero-description"
                        value={heroSection.description}
                        onChange={(e) => setHeroSection((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Transform your space with premium furniture..."
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="primary-btn">Primary Button Text</Label>
                      <Input
                        id="primary-btn"
                        value={heroSection.primaryButtonText}
                        onChange={(e) => setHeroSection((prev) => ({ ...prev, primaryButtonText: e.target.value }))}
                        placeholder="Browse Furniture"
                      />
                    </div>
                    <div>
                      <Label htmlFor="secondary-btn">Secondary Button Text</Label>
                      <Input
                        id="secondary-btn"
                        value={heroSection.secondaryButtonText}
                        onChange={(e) => setHeroSection((prev) => ({ ...prev, secondaryButtonText: e.target.value }))}
                        placeholder="Try AR Demo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bg-image">Background Image URL</Label>
                      <div className="flex gap-2">
                        <Input
                          id="bg-image"
                          value={heroSection.backgroundImage}
                          onChange={(e) => setHeroSection((prev) => ({ ...prev, backgroundImage: e.target.value }))}
                          placeholder="/images/hero-bg.jpg"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const imageUrl = URL.createObjectURL(file)
                              setHeroSection((prev) => ({ ...prev, backgroundImage: imageUrl }))
                            }
                          }}
                          className="hidden"
                          ref={bgImageInputRef}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => bgImageInputRef.current?.click()}
                        >
                          <Upload className="h-4 w-4" />
                        </Button>

                      </div>
                    </div>
                    <div>
                      <Label htmlFor="logo-image">Logo Image URL</Label>
                      <div className="flex gap-2">
                        <Input
                          id="logo-image"
                          value={heroSection.logoImage}
                          onChange={(e) => setHeroSection((prev) => ({ ...prev, logoImage: e.target.value }))}
                          placeholder="/images/logo.png"
                        />
                        <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setHeroSection((prev) => ({ ...prev, backgroundImage: imageUrl }))
    }
  }}
  className="hidden"
  ref={bgImageInputRef}
/>
<Button
  variant="outline"
  size="sm"
  onClick={() => bgImageInputRef.current?.click()}
>
  <Upload className="h-4 w-4" />
</Button>

                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Section */}
          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Features Section
                  </div>
                  <Button onClick={addFeature} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Feature
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <Card key={feature.id} className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                        {LucideIcons[feature.icon as keyof typeof LucideIcons] ? (
  React.createElement(LucideIcons[feature.icon as keyof typeof LucideIcons], { className: "h-5 w-5 mr-2" })
) : (
  <Star className="h-5 w-5 mr-2" />
)}
<Badge variant="outline">Feature {index + 1}</Badge>
                          <Switch
                            checked={feature.enabled}
                            onCheckedChange={(checked) => updateFeature(feature.id, { enabled: checked })}
                          />
                          <div className="text-xs text-gray-500">Current color: {feature.color}</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFeature(feature.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Title</Label>
                          <Input
                            value={feature.title}
                            onChange={(e) => updateFeature(feature.id, { title: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Icon</Label>
                          <Input
                            value={feature.icon}
                            onChange={(e) => updateFeature(feature.id, { icon: e.target.value })}
                            placeholder="Home, Star, etc."
                          />
                        </div>
                        <div>
                          <ColorPicker
                            label="Color"
                            value={feature.color}
                            onChange={(color) => {
                              console.log("Color picker onChange called:", color)
                              updateFeature(feature.id, { color })
                            }}
                          />
                        </div>
                        <div className="md:col-span-3">
                          <Label>Description</Label>
                          <Textarea
                            value={feature.description}
                            onChange={(e) => updateFeature(feature.id, { description: e.target.value })}
                            className="min-h-[80px]"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Featured Products */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Featured Products
                  </div>
                  <Button onClick={addProduct} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {featuredProducts.map((product, index) => (
                    <Card key={product.id} className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Product {index + 1}</Badge>
                          <Switch
                            checked={product.enabled}
                            onCheckedChange={(checked) => updateProduct(product.id, { enabled: checked })}
                          />
                          {product.arEnabled && <Badge className="bg-purple-100 text-purple-800">AR</Badge>}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProduct(product.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <Label>Product Name</Label>
                          <Input
                            value={product.name}
                            onChange={(e) => updateProduct(product.id, { name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Price</Label>
                          <Input
                            value={product.price}
                            onChange={(e) => updateProduct(product.id, { price: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Rating</Label>
                          <Input
                            value={product.rating}
                            onChange={(e) => updateProduct(product.id, { rating: e.target.value })}
                            placeholder="4.8"
                          />
                        </div>
                        <div className="flex items-end gap-2">
                          <div className="flex-1">
                            <Label>AR Enabled</Label>
                            <div className="mt-2">
                              <Switch
                                checked={product.arEnabled}
                                onCheckedChange={(checked) => updateProduct(product.id, { arEnabled: checked })}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="md:col-span-3">
                          <Label>Description</Label>
                          <Input
                            value={product.description}
                            onChange={(e) => updateProduct(product.id, { description: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Image URL</Label>
                          <div className="flex gap-2">
                            <Input
                              value={product.image}
                              onChange={(e) => updateProduct(product.id, { image: e.target.value })}
                              placeholder="/images/product.png"
                            />
                            <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setHeroSection((prev) => ({ ...prev, backgroundImage: imageUrl }))
    }
  }}
  className="hidden"
  ref={bgImageInputRef}
/>
<Button
  variant="outline"
  size="sm"
  onClick={() => bgImageInputRef.current?.click()}
>
  <Upload className="h-4 w-4" />
</Button>

                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stats Section */}
          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Statistics Section
                  </div>
                  <Switch
                    checked={statsSection.enabled}
                    onCheckedChange={(checked) => setStatsSection((prev) => ({ ...prev, enabled: checked }))}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Stat 1 - Value</Label>
                      <Input
                        value={statsSection.stat1.value}
                        onChange={(e) =>
                          setStatsSection((prev) => ({
                            ...prev,
                            stat1: { ...prev.stat1, value: e.target.value },
                          }))
                        }
                        placeholder="500+"
                      />
                    </div>
                    <div>
                      <Label>Stat 1 - Label</Label>
                      <Input
                        value={statsSection.stat1.label}
                        onChange={(e) =>
                          setStatsSection((prev) => ({
                            ...prev,
                            stat1: { ...prev.stat1, label: e.target.value },
                          }))
                        }
                        placeholder="Furniture Pieces"
                      />
                    </div>
                    <div>
                      <Label>Stat 3 - Value</Label>
                      <Input
                        value={statsSection.stat3.value}
                        onChange={(e) =>
                          setStatsSection((prev) => ({
                            ...prev,
                            stat3: { ...prev.stat3, value: e.target.value },
                          }))
                        }
                        placeholder="2000+"
                      />
                    </div>
                    <div>
                      <Label>Stat 3 - Label</Label>
                      <Input
                        value={statsSection.stat3.label}
                        onChange={(e) =>
                          setStatsSection((prev) => ({
                            ...prev,
                            stat3: { ...prev.stat3, label: e.target.value },
                          }))
                        }
                        placeholder="Happy Homes"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label>Stat 2 - Value</Label>
                      <Input
                        value={statsSection.stat2.value}
                        onChange={(e) =>
                          setStatsSection((prev) => ({
                            ...prev,
                            stat2: { ...prev.stat2, value: e.target.value },
                          }))
                        }
                        placeholder="50+"
                      />
                    </div>
                    <div>
                      <Label>Stat 2 - Label</Label>
                      <Input
                        value={statsSection.stat2.label}
                        onChange={(e) =>
                          setStatsSection((prev) => ({
                            ...prev,
                            stat2: { ...prev.stat2, label: e.target.value },
                          }))
                        }
                        placeholder="AR Models"
                      />
                    </div>
                    <div>
                      <Label>Stat 4 - Value</Label>
                      <Input
                        value={statsSection.stat4.value}
                        onChange={(e) =>
                          setStatsSection((prev) => ({
                            ...prev,
                            stat4: { ...prev.stat4, value: e.target.value },
                          }))
                        }
                        placeholder="24/7"
                      />
                    </div>
                    <div>
                      <Label>Stat 4 - Label</Label>
                      <Input
                        value={statsSection.stat4.label}
                        onChange={(e) =>
                          setStatsSection((prev) => ({
                            ...prev,
                            stat4: { ...prev.stat4, label: e.target.value },
                          }))
                        }
                        placeholder="Support"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trust Indicators */}
          <TabsContent value="trust">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Trust Indicators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trustIndicators.map((indicator, index) => (
                    <Card key={indicator.id} className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Trust {index + 1}</Badge>
                          <Switch
                            checked={indicator.enabled}
                            onCheckedChange={(checked) => updateTrustIndicator(indicator.id, { enabled: checked })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Title</Label>
                          <Input
                            value={indicator.title}
                            onChange={(e) => updateTrustIndicator(indicator.id, { title: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Icon</Label>
                          <Input
                            value={indicator.icon}
                            onChange={(e) => updateTrustIndicator(indicator.id, { icon: e.target.value })}
                            placeholder="Shield, Truck, Home"
                          />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Input
                            value={indicator.description}
                            onChange={(e) => updateTrustIndicator(indicator.id, { description: e.target.value })}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO Settings */}
          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="meta-title">Meta Title</Label>
                  <Input
                    id="meta-title"
                    value={seoSettings.metaTitle}
                    onChange={(e) => setSeoSettings((prev) => ({ ...prev, metaTitle: e.target.value }))}
                    placeholder="FurniCraft - Premium AR Furniture Store"
                  />
                </div>
                <div>
                  <Label htmlFor="meta-description">Meta Description</Label>
                  <Textarea
                    id="meta-description"
                    value={seoSettings.metaDescription}
                    onChange={(e) => setSeoSettings((prev) => ({ ...prev, metaDescription: e.target.value }))}
                    placeholder="Transform your space with premium furniture and cutting-edge AR technology..."
                    className="min-h-[100px]"
                  />
                </div>
                <div>
                  <Label htmlFor="keywords">Keywords</Label>
                  <Input
                    id="keywords"
                    value={seoSettings.keywords}
                    onChange={(e) => setSeoSettings((prev) => ({ ...prev, keywords: e.target.value }))}
                    placeholder="furniture, AR, home decor, interior design"
                  />
                </div>
                <div>
                  <Label htmlFor="og-image">Open Graph Image</Label>
                  <div className="flex gap-2">
                    <Input
                      id="og-image"
                      value={seoSettings.ogImage}
                      onChange={(e) => setSeoSettings((prev) => ({ ...prev, ogImage: e.target.value }))}
                      placeholder="/images/og-image.jpg"
                    />
                    <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setHeroSection((prev) => ({ ...prev, backgroundImage: imageUrl }))
    }
  }}
  className="hidden"
  ref={bgImageInputRef}
/>
<Button
  variant="outline"
  size="sm"
  onClick={() => bgImageInputRef.current?.click()}
>
  <Upload className="h-4 w-4" />
</Button>

                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Actions */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Ready to publish your changes?</h3>
                <p className="text-gray-600">
                  {hasUnsavedChanges
                    ? "You have unsaved changes that will be published immediately."
                    : "All changes are saved and live on your homepage."}
                </p>
                {lastSaved && (
                  <p className="text-sm text-gray-500 mt-1">
                  Last saved: {new Date(lastSaved).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                </p>
                )}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handlePreview}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Changes
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Publishing...
                    </>
                  ) : hasUnsavedChanges ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Publish Homepage
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      All Saved
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
