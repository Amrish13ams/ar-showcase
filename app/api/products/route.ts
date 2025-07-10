import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    await db.initializeTables()

    const { searchParams } = new URL(request.url)
    const shopId = searchParams.get("shop_id")
    const subdomain = searchParams.get("subdomain")

    let products
    if (subdomain) {
      products = await db.getProductsBySubdomain(subdomain)
    } else if (shopId) {
      products = await db.getProducts(Number.parseInt(shopId))
    } else {
      products = await db.getProducts()
    }

    return NextResponse.json(products)
  } catch (error) {
    console.error("❌ API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await db.initializeTables()
    const data = await request.json()
    const product = await db.createProduct(data)
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("❌ API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
