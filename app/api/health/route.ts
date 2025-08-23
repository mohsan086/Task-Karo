import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    // Check database connection
    const supabase = await createClient()

    const { error } = await supabase.from("profiles").select("count").limit(1).single()

    if (error && error.code !== "PGRST116") {
      throw new Error("Database connection failed")
    }

    return NextResponse.json(
      {
        status: "healthy",
        timestamp: new Date().toISOString(),
        services: {
          database: "connected",
          auth: "operational",
        },
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 },
    )
  }
}
