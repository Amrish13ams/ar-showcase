/**
 * Frontend utilities for B2 optimization
 */

export class B2OptimizationHelper {
  // Image compression before upload
  static async compressImage(file: File, maxSizeMB = 2): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!
      const img = new Image()

      img.onload = () => {
        // Calculate new dimensions
        const maxWidth = 1200
        const maxHeight = 1200
        let { width, height } = img

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            const compressedFile = new File([blob!], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            })
            resolve(compressedFile)
          },
          "image/jpeg",
          0.85, // 85% quality
        )
      }

      img.src = URL.createObjectURL(file)
    })
  }

  // Check file size before upload
  static validateFileSize(file: File, maxSizeMB = 5): boolean {
    const fileSizeMB = file.size / (1024 * 1024)
    return fileSizeMB <= maxSizeMB
  }

  // Get usage statistics
  static async getUsageStats(): Promise<{
    storageUsed: number
    storageLimit: number
    usagePercentage: number
  }> {
    try {
      const response = await fetch("/api/b2-usage/")
      const data = await response.json()

      return {
        storageUsed: data.current_usage_gb,
        storageLimit: 10, // Free tier limit
        usagePercentage: data.usage_percentage,
      }
    } catch (error) {
      console.error("Error fetching usage stats:", error)
      return {
        storageUsed: 0,
        storageLimit: 10,
        usagePercentage: 0,
      }
    }
  }
}
