// 🔵 BLUE PRISM INTEGRATION POINT #2: Volunteers API
// Este endpoint será llamado por Blue Prism para insertar/consultar voluntarios

import { type NextRequest, NextResponse } from "next/server"
import { getMockVolunteers } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  try {
    // 🔵 REEMPLAZAR: Aquí Blue Prism debe consultar la base de datos real
    // Ejemplo: const volunteers = await db.query('SELECT * FROM volunteers')

    const volunteers = getMockVolunteers()

    return NextResponse.json({
      success: true,
      count: volunteers.length,
      data: volunteers,
    })
  } catch (error) {
    console.error("[API ERROR]", error)
    return NextResponse.json({ success: false, error: "Error fetching volunteers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 🔵 BLUE PRISM: Aquí se reciben datos desde el RPA
    // Blue Prism debe enviar datos normalizados en este formato

    console.log("[BLUE PRISM DATA RECEIVED]", body)

    // 🔵 REEMPLAZAR: Insertar en base de datos real
    // Ejemplo: await db.query('INSERT INTO volunteers VALUES (...)', body)

    return NextResponse.json({
      success: true,
      message: "Volunteer created successfully",
      id: `VOL-${Date.now()}`,
    })
  } catch (error) {
    console.error("[API ERROR]", error)
    return NextResponse.json({ success: false, error: "Error creating volunteer" }, { status: 500 })
  }
}
