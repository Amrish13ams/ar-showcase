export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price)
}

export const sampleProducts = [
  {
    id: 1,
    name: "Modern Sectional Sofa",
    description: "Comfortable L-shaped sectional sofa perfect for modern living rooms",
    price: 89900,
    discount_price: 79900,
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop",
    ],
    has_ar: true,
    rating: 4.8,
    category: "Sofas",
    discount: 11,
    featured: true,
  },
  {
    id: 2,
    name: "Glass Coffee Table",
    description: "Elegant glass-top coffee table with chrome legs",
    price: 25900,
    discount_price: 22900,
    images: ["https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&h=400&fit=crop"],
    has_ar: true,
    rating: 4.6,
    category: "Tables",
    discount: 12,
    featured: true,
  },
  {
    id: 3,
    name: "Executive Office Chair",
    description: "Ergonomic leather office chair with lumbar support",
    price: 34900,
    images: ["https://images.unsplash.com/photo-1541558869434-2840d308329a?w=600&h=400&fit=crop"],
    has_ar: true,
    rating: 4.7,
    category: "Office",
  },
]

export const sampleCompanies = [
  {
    id: 1,
    name: "Demo Furniture Store",
    subdomain: "demo",
    description: "Premium furniture with AR visualization",
    logo: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop&crop=center",
  },
  {
    id: 2,
    name: "Modern Living",
    subdomain: "modern",
    description: "Contemporary furniture for modern homes",
    logo: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop&crop=center",
  },
  {
    id: 3,
    name: "Classic Designs",
    subdomain: "classic",
    description: "Timeless furniture with classic appeal",
    logo: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop&crop=center",
  },
]
