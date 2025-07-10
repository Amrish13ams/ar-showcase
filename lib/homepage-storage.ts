export interface HomepageData {
  heroSection: {
    title: string
    subtitle: string
    description: string
    primaryButtonText: string
    secondaryButtonText: string
    backgroundImage: string
    logoImage: string
  }
  features: Array<{
    id: string
    title: string
    description: string
    icon: string
    color: string
    enabled: boolean
  }>
  featuredProducts: Array<{
    id: string
    name: string
    description: string
    price: string
    rating: string
    image: string
    arEnabled: boolean
    enabled: boolean
  }>
  statsSection: {
    stat1: { value: string; label: string }
    stat2: { value: string; label: string }
    stat3: { value: string; label: string }
    stat4: { value: string; label: string }
    enabled: boolean
  }
  trustIndicators: Array<{
    id: string
    title: string
    description: string
    icon: string
    enabled: boolean
  }>
  seoSettings: {
    metaTitle: string
    metaDescription: string
    keywords: string
    ogImage: string
  }
  lastUpdated: string
}

// Global in-memory storage - this will persist during the session
let globalHomepageData: HomepageData | null = null
let saveHistory: Array<{ timestamp: string; success: boolean; error?: string }> = []

// Simple storage implementation that always works
export const saveHomepageData = (data: HomepageData): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      console.log("🔄 Starting save operation...")

      // Add timestamp
      const dataWithTimestamp = {
        ...data,
        lastUpdated: new Date().toISOString(),
      }

      // Save to global memory (this always works)
      globalHomepageData = dataWithTimestamp

      // Log the save
      saveHistory.push({
        timestamp: new Date().toISOString(),
        success: true,
      })

      console.log("✅ Data saved successfully to memory")
      console.log("📊 Saved data:", {
        heroTitle: dataWithTimestamp.heroSection.title,
        featuresCount: dataWithTimestamp.features.length,
        productsCount: dataWithTimestamp.featuredProducts.length,
        lastUpdated: dataWithTimestamp.lastUpdated,
      })

      // Try to also save to localStorage as backup (but don't fail if it doesn't work)
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          localStorage.setItem("homepage-data-backup", JSON.stringify(dataWithTimestamp))
          console.log("💾 Also saved to localStorage backup")
        }
      } catch (localStorageError) {
        console.log("⚠️ localStorage backup failed (but main save succeeded):", localStorageError)
      }

      // Simulate API delay
      setTimeout(() => {
        console.log("🎉 Save operation completed successfully")
        resolve(true)
      }, 500)
    } catch (error) {
      console.error("❌ Save operation failed:", error)
      saveHistory.push({
        timestamp: new Date().toISOString(),
        success: false,
        error: String(error),
      })
      resolve(false)
    }
  })
}

export const loadHomepageData = (): HomepageData | null => {
  try {
    console.log("🔍 Loading homepage data...")

    // First try global memory
    if (globalHomepageData) {
      console.log("✅ Found data in global memory")
      return globalHomepageData
    }

    // Try localStorage backup
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const backup = localStorage.getItem("homepage-data-backup")
        if (backup) {
          const parsed = JSON.parse(backup)
          globalHomepageData = parsed // Store in memory for next time
          console.log("✅ Loaded data from localStorage backup")
          return parsed
        }
      }
    } catch (localStorageError) {
      console.log("⚠️ localStorage backup load failed:", localStorageError)
    }

    console.log("ℹ️ No saved data found")
    return null
  } catch (error) {
    console.error("❌ Failed to load homepage data:", error)
    return null
  }
}

export const getDefaultHomepageData = (): HomepageData => {
  console.log("🏠 Loading default homepage data")
  return {
    heroSection: {
      title: "Welcome to\nFurniCraft",
      subtitle: "AR Furniture Visualization",
      description:
        "Transform your space with premium furniture and cutting-edge AR technology. See how furniture looks in your home before you buy!",
      primaryButtonText: "Browse Furniture",
      secondaryButtonText: "Try AR Demo",
      backgroundImage: "/images/hero-bg.jpg",
      logoImage: "/images/logo.png",
    },
    features: [
      {
        id: "1",
        title: "Premium Quality",
        description: "Handcrafted furniture made from the finest materials with attention to every detail",
        icon: "Home",
        color: "blue",
        enabled: true,
      },
      {
        id: "2",
        title: "AR Visualization",
        description: "See exactly how furniture will look in your space with our advanced AR technology",
        icon: "Sparkles",
        color: "purple",
        enabled: true,
      },
      {
        id: "3",
        title: "Free Assembly",
        description: "Professional delivery and assembly service included with every purchase",
        icon: "Truck",
        color: "green",
        enabled: true,
      },
    ],
    featuredProducts: [
      {
        id: "1",
        name: "Modern Sectional Sofa",
        description: "Comfortable 3-seater with premium fabric",
        price: "₹79,900",
        rating: "4.8",
        image: "/images/sofa-modern.png",
        arEnabled: true,
        enabled: true,
      },
      {
        id: "2",
        name: "Dining Table Set",
        description: "Elegant 6-seater solid oak wood",
        price: "₹59,900",
        rating: "4.6",
        image: "/images/dining-table.png",
        arEnabled: true,
        enabled: true,
      },
      {
        id: "3",
        name: "Ergonomic Office Chair",
        description: "High-back with lumbar support",
        price: "₹22,900",
        rating: "4.7",
        image: "/images/office-chair.png",
        arEnabled: true,
        enabled: true,
      },
    ],
    statsSection: {
      stat1: { value: "500+", label: "Furniture Pieces" },
      stat2: { value: "50+", label: "AR Models" },
      stat3: { value: "2000+", label: "Happy Homes" },
      stat4: { value: "24/7", label: "Support" },
      enabled: true,
    },
    trustIndicators: [
      {
        id: "1",
        title: "2-Year Warranty",
        description: "Comprehensive warranty on all furniture pieces",
        icon: "Shield",
        enabled: true,
      },
      {
        id: "2",
        title: "Free Delivery",
        description: "Professional delivery and assembly included",
        icon: "Truck",
        enabled: true,
      },
      {
        id: "3",
        title: "30-Day Returns",
        description: "Not satisfied? Return within 30 days",
        icon: "Home",
        enabled: true,
      },
    ],
    seoSettings: {
      metaTitle: "FurniCraft - Premium AR Furniture Store",
      metaDescription:
        "Transform your space with premium furniture and cutting-edge AR technology. See how furniture looks in your home before you buy!",
      keywords: "furniture, AR, home decor, interior design, augmented reality",
      ogImage: "/images/og-image.jpg",
    },
    lastUpdated: new Date().toISOString(),
  }
}

// Debug functions
export const getStorageInfo = () => {
  return {
    hasGlobalData: !!globalHomepageData,
    globalDataTimestamp: globalHomepageData?.lastUpdated || null,
    saveHistoryCount: saveHistory.length,
    lastSaveAttempt: saveHistory[saveHistory.length - 1] || null,
    recentSaves: saveHistory.slice(-5),
  }
}

export const clearAllData = () => {
  globalHomepageData = null
  saveHistory = []
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem("homepage-data-backup")
    }
  } catch (e) {
    console.log("Could not clear localStorage backup")
  }
  console.log("🗑️ All data cleared")
}

export const forceLoadDefaults = () => {
  const defaults = getDefaultHomepageData()
  globalHomepageData = defaults
  console.log("🔄 Forced load of default data")
  return defaults
}
