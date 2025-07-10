import { type NextRequest, NextResponse } from "next/server"
import { b2Client } from "@/lib/b2-client"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const productId = formData.get("productId") as string
    const type = formData.get("type") as string // 'image' | 'ar-model'
    const index = formData.get("index") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    let fileUrl: string

    if (type === "image") {
      fileUrl = await b2Client.uploadProductImage(buffer, Number.parseInt(productId), Number.parseInt(index), file.name)
    } else if (type === "ar-model") {
      const modelType = file.name.endsWith(".glb") ? "glb" : "usdz"
      fileUrl = await b2Client.uploadARModel(buffer, Number.parseInt(productId), modelType, file.name)
    } else {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    return NextResponse.json({ url: fileUrl })
  } catch (error) {
    console.error("❌ Upload Error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
