import { type NextRequest, NextResponse } from "next/server"
import { apiClient } from "@/lib/api-client"

export async function GET() {
  try {
    const requests = await apiClient.getARRequests()
    return NextResponse.json(requests)
  } catch (error) {
    console.error("Error fetching AR requests:", error)
    return NextResponse.json({ error: "Failed to fetch AR requests" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { productId, shopId } = await request.json()
    const arRequest = await apiClient.createARRequest(productId, shopId)
    return NextResponse.json(arRequest)
  } catch (error) {
    console.error("Error creating AR request:", error)
    return NextResponse.json({ error: "Failed to create AR request" }, { status: 500 })
  }
}
