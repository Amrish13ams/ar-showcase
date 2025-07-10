import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET() {
  try {
    await db.initializeTables()
    const companies = await db.getCompanies()
    return NextResponse.json(companies)
  } catch (error) {
    console.error("❌ API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await db.initializeTables()
    const data = await request.json()
    const company = await db.createCompany(data)
    return NextResponse.json(company, { status: 201 })
  } catch (error) {
    console.error("❌ API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
