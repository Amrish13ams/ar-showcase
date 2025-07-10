interface B2AuthResponse {
  authorizationToken: string
  apiUrl: string
  downloadUrl: string
}

interface B2UploadUrlResponse {
  bucketId: string
  uploadUrl: string
  authorizationToken: string
}

interface B2FileInfo {
  fileId: string
  fileName: string
  contentType: string
  contentLength: number
  uploadTimestamp: number
}

class B2Client {
  private authToken: string | null = null
  private apiUrl: string | null = null
  private downloadUrl: string | null = null

  constructor(
    private keyId: string,
    private applicationKey: string,
    private bucketId: string,
    private bucketName: string,
  ) {}

  async authenticate(): Promise<void> {
    try {
      const credentials = Buffer.from(`${this.keyId}:${this.applicationKey}`).toString("base64")

      const response = await fetch("https://api.backblazeb2.com/b2api/v2/b2_authorize_account", {
        method: "GET",
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      })

      if (!response.ok) {
        throw new Error(`B2 authentication failed: ${response.statusText}`)
      }

      const data: B2AuthResponse = await response.json()
      this.authToken = data.authorizationToken
      this.apiUrl = data.apiUrl
      this.downloadUrl = data.downloadUrl

      console.log("✅ B2 authentication successful")
    } catch (error) {
      console.error("❌ B2 authentication failed:", error)
      throw error
    }
  }

  async getUploadUrl(): Promise<B2UploadUrlResponse> {
    if (!this.authToken || !this.apiUrl) {
      await this.authenticate()
    }

    const response = await fetch(`${this.apiUrl}/b2api/v2/b2_get_upload_url`, {
      method: "POST",
      headers: {
        Authorization: this.authToken!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bucketId: this.bucketId,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to get upload URL: ${response.statusText}`)
    }

    return response.json()
  }

  async uploadFile(file: Buffer, fileName: string, contentType: string, folder?: string): Promise<B2FileInfo> {
    try {
      const uploadInfo = await this.getUploadUrl()
      const fullFileName = folder ? `${folder}/${fileName}` : fileName

      const response = await fetch(uploadInfo.uploadUrl, {
        method: "POST",
        headers: {
          Authorization: uploadInfo.authorizationToken,
          "X-Bz-File-Name": encodeURIComponent(fullFileName),
          "Content-Type": contentType,
          "X-Bz-Content-Sha1": "unverified",
        },
        body: file,
      })

      if (!response.ok) {
        throw new Error(`File upload failed: ${response.statusText}`)
      }

      const fileInfo: B2FileInfo = await response.json()
      console.log(`✅ File uploaded successfully: ${fullFileName}`)

      return fileInfo
    } catch (error) {
      console.error("❌ File upload failed:", error)
      throw error
    }
  }

  getFileUrl(fileName: string, folder?: string): string {
    const fullFileName = folder ? `${folder}/${fileName}` : fileName
    return `${this.downloadUrl}/file/${this.bucketName}/${fullFileName}`
  }

  async uploadProductImage(file: Buffer, productId: number, imageIndex: number, originalName: string): Promise<string> {
    const extension = originalName.split(".").pop()
    const fileName = `product-${productId}-image-${imageIndex}.${extension}`
    const folder = `products/${productId}/images`

    await this.uploadFile(file, fileName, `image/${extension}`, folder)
    return this.getFileUrl(fileName, folder)
  }

  async uploadARModel(
    file: Buffer,
    productId: number,
    modelType: "glb" | "usdz",
    originalName: string,
  ): Promise<string> {
    const extension = originalName.split(".").pop()
    const fileName = `product-${productId}-model.${extension}`
    const folder = `products/${productId}/ar`

    await this.uploadFile(file, fileName, `model/${extension}`, folder)
    return this.getFileUrl(fileName, folder)
  }
}

// Initialize B2 client
export const b2Client = new B2Client(
  process.env.B2_KEY_ID!,
  process.env.B2_APPLICATION_KEY!,
  process.env.B2_BUCKET_ID!,
  process.env.B2_BUCKET_NAME!,
)
