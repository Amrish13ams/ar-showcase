// Frontend utility for Backblaze B2 integration with private bucket support

export interface B2UploadResponse {
  key: string
  signed_url?: string
}

export class BackblazeB2Client {
  private apiUrl: string

  constructor(apiUrl: string = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api") {
    this.apiUrl = apiUrl
  }

  /**
   * Upload files directly to B2 via backend (works with private buckets)
   */
  async uploadProductFiles(productData: {
    name: string
    description: string
    price: number
    discount_price?: number
    category?: string
    main_image?: File
    additional_images?: File[]
    ar_model?: File
  }): Promise<any> {
    const formData = new FormData()

    // Add text fields
    Object.entries(productData).forEach(([key, value]) => {
      if (value !== undefined && !["main_image", "additional_images", "ar_model"].includes(key)) {
        formData.append(key, value.toString())
      }
    })

    // Add files
    if (productData.main_image) {
      formData.append("main_image", productData.main_image)
    }

    if (productData.additional_images) {
      productData.additional_images.forEach((image) => {
        formData.append("additional_images", image)
      })
    }

    if (productData.ar_model) {
      formData.append("ar_model", productData.ar_model)
    }

    try {
      const response = await fetch(`${this.apiUrl}/products/bulk_upload/`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error uploading to B2:", error)
      throw error
    }
  }

  /**
   * Get fresh signed URLs for product images (for private buckets)
   */
  async refreshProductUrls(productId: number): Promise<{
    main_image_url?: string
    additional_images_urls: string[]
    ar_model_url?: string
  }> {
    try {
      const response = await fetch(`${this.apiUrl}/products/${productId}/refresh_urls/`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error refreshing URLs:", error)
      throw error
    }
  }

  /**
   * Upload additional images to existing product
   */
  async uploadImages(productId: number, images: File[]): Promise<string[]> {
    const formData = new FormData()
    images.forEach((image) => {
      formData.append("images", image)
    })

    try {
      const response = await fetch(`${this.apiUrl}/products/${productId}/upload_images/`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.keys // Return file keys instead of URLs for private buckets
    } catch (error) {
      console.error("Error uploading images:", error)
      throw error
    }
  }

  /**
   * Upload AR model to existing product
   */
  async uploadARModel(productId: number, modelFile: File): Promise<string> {
    const formData = new FormData()
    formData.append("ar_model", modelFile)

    try {
      const response = await fetch(`${this.apiUrl}/products/${productId}/upload_ar_model/`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.ar_model_key // Return file key instead of URL for private buckets
    } catch (error) {
      console.error("Error uploading AR model:", error)
      throw error
    }
  }

  /**
   * Validate file before upload
   */
  validateFile(file: File, type: "image" | "model"): { valid: boolean; error?: string } {
    const maxSizes = {
      image: 10 * 1024 * 1024, // 10MB
      model: 50 * 1024 * 1024, // 50MB
    }

    const allowedTypes = {
      image: ["image/jpeg", "image/png", "image/webp"],
      model: ["model/gltf-binary", "model/gltf+json", "application/octet-stream"],
    }

    if (file.size > maxSizes[type]) {
      return {
        valid: false,
        error: `File size too large. Maximum ${maxSizes[type] / (1024 * 1024)}MB allowed.`,
      }
    }

    if (type === "image" && !allowedTypes.image.includes(file.type)) {
      return {
        valid: false,
        error: "Invalid image format. Only JPEG, PNG, and WebP are allowed.",
      }
    }

    if (type === "model") {
      const extension = file.name.toLowerCase().split(".").pop()
      if (!["glb", "gltf", "usdz"].includes(extension || "")) {
        return {
          valid: false,
          error: "Invalid model format. Only GLB, GLTF, and USDZ are allowed.",
        }
      }
    }

    return { valid: true }
  }
}

export const b2Client = new BackblazeB2Client()
