import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { subdomain: string } }) {
  try {
    await db.initializeTables()

    const subdomain = params.subdomain
    console.log(`🏢 API: Fetching data for subdomain: ${subdomain}`)

    const company = await db.getCompanyBySubdomain(subdomain)
     
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 })
    }

    const products = await db.getProductsBySubdomain(subdomain)
    console.log(`company_data:${products[0]}`)

    console.log(`✅ API: Found company ${company.shop_name} with ${products.length} products`)

    return NextResponse.json({
      company,
      products,
    })
  } catch (error) {
    console.error("❌ API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
