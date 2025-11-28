// 🔵 BLUE PRISM INTEGRATION POINT #3: Bulk Insert
// Blue Prism usa este endpoint para inserción masiva desde CSV/Excel

import { type NextRequest, NextResponse } from "next/server"
import { RPAHelpers } from "@/lib/api-integration"

export async function POST(request: NextRequest) {
  try {
    const { volunteers } = await request.json()

    if (!Array.isArray(volunteers)) {
      return NextResponse.json({ success: false, error: "Invalid data format" }, { status: 400 })
    }

    // 🔵 BLUE PRISM: Valida y normaliza datos
    const validVolunteers = volunteers
      .filter((v) => RPAHelpers.validateVolunteerData(v))
      .map((v) => RPAHelpers.normalizeVolunteerData(v))

    console.log(`[BLUE PRISM BULK INSERT] Processing ${validVolunteers.length} volunteers`)

    // 🔵 REEMPLAZAR: Inserción masiva en base de datos
    // Ejemplo: await db.bulkInsert('volunteers', validVolunteers)

    return NextResponse.json({
      success: true,
      inserted: validVolunteers.length,
      rejected: volunteers.length - validVolunteers.length,
      message: `Successfully inserted ${validVolunteers.length} volunteers`,
    })
  } catch (error) {
    console.error("[API ERROR]", error)
    return NextResponse.json({ success: false, error: "Error in bulk insert" }, { status: 500 })
  }
}
