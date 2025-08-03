import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase.from("profile").select("*").limit(1).single()

    if (error && error.code !== "PGRST116") {
      throw error
    }

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = createServerClient()

    const { data, error } = await supabase.from("profile").insert(body).select().single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = createServerClient()

    // Get existing profile first
    const { data: existingProfile } = await supabase.from("profile").select("id").limit(1).single()

    if (!existingProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    const { data, error } = await supabase.from("profile").update(body).eq("id", existingProfile.id).select().single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
