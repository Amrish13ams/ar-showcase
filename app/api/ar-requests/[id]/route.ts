import { type NextRequest, NextResponse } from "next/server"
import { apiClient } from "@/lib/api-client"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const arRequest = await apiClient.updateARRequest(Number.parseInt(params.id), data)
    return NextResponse.json(arRequest)
  } catch (error) {
    console.error("Error updating AR request:", error)
    return NextResponse.json({ error: "Failed to update AR request" }, { status: 500 })
  }
}
