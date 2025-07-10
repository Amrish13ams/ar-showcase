export interface ARModel {
  id: number
  name: string
  category: string
  dimensions: string
}

export const arModels: ARModel[] = [
  {
    id: 1,
    name: "Modern Sectional Sofa",
    category: "Living Room",
    dimensions: "220 × 85 × 90 cm",
  },
  {
    id: 2,
    name: "Dining Table Set",
    category: "Dining Room",
    dimensions: "180 × 180 × 75 cm",
  },
  {
    id: 3,
    name: "Ergonomic Office Chair",
    category: "Office",
    dimensions: "65 × 60 × 120 cm",
  },
  {
    id: 4,
    name: "Glass Coffee Table",
    category: "Living Room",
    dimensions: "120 × 60 × 45 cm",
  },
  {
    id: 5,
    name: "Platform Bed Frame",
    category: "Bedroom",
    dimensions: "160 × 200 × 100 cm",
  },
  {
    id: 6,
    name: "Wooden Bookshelf",
    category: "Storage",
    dimensions: "80 × 30 × 180 cm",
  },
]

// Helper function to get model type based on product ID
export const getModelType = (id?: number): "sofa" | "chair" | "table" => {
  if (!id) return "sofa"

  switch (id) {
    case 1: // Modern Sectional Sofa
    case 5: // Platform Bed Frame
      return "sofa"
    case 2: // Dining Table Set
    case 4: // Glass Coffee Table
    case 6: // Wooden Bookshelf
      return "table"
    case 3: // Ergonomic Office Chair
      return "chair"
    default:
      return "table"
  }
}
