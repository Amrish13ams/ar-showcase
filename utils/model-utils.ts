// Utility functions for scaling 3D models based on real-world dimensions

export interface ProductDimensions {
  length: number // in cm
  width: number // in cm
  height: number // in cm
}

export function parseDimensions(dimensionString: string): ProductDimensions {
  // Parse dimension strings like "180 × 90 × 75 cm" or "220 × 85 × 90 cm"
  const matches = dimensionString.match(/(\d+)\s*×\s*(\d+)\s*×\s*(\d+)/)

  if (!matches) {
    // Default dimensions if parsing fails
    return { length: 100, width: 50, height: 75 }
  }

  return {
    length: Number.parseInt(matches[1]),
    width: Number.parseInt(matches[2]),
    height: Number.parseInt(matches[3]),
  }
}

export function calculateModelScale(
  productDimensions: ProductDimensions,
  targetSize = 2, // Target size in Three.js units (meters)
): number {
  // Convert cm to meters and find the largest dimension
  const maxDimension = Math.max(
    productDimensions.length / 100,
    productDimensions.width / 100,
    productDimensions.height / 100,
  )

  // Scale so the largest dimension fits within targetSize
  return targetSize / maxDimension
}

export function getModelPosition(productDimensions: ProductDimensions, scale: number): [number, number, number] {
  // Position the model so it sits on the ground plane
  const heightInMeters = (productDimensions.height / 100) * scale
  return [0, -heightInMeters / 2, 0]
}
