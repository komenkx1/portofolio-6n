import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const { data, error } = await supabase.from("technologies").update(body).eq("id", params.id).select().single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error updating technology:", error)
    return NextResponse.json({ error: "Failed to update technology" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await supabase.from("technologies").delete().eq("id", params.id)

    if (error) throw error

    return NextResponse.json({ message: "Technology deleted successfully" })
  } catch (error) {
    console.error("Error deleting technology:", error)
    return NextResponse.json({ error: "Failed to delete technology" }, { status: 500 })
  }
}
