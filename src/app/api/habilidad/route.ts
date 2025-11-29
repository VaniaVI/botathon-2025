// app/api/habilidad/route.ts
import { NextResponse } from "next/server";
import { query } from "@/lib/api-integration";

export async function GET() {
  try {
    const habilities = await query<{ habilidad: string; count: number }[]>(
      `SELECT h.nombre AS habilidad, COUNT(*) AS count
       FROM volunteer v
       JOIN habilidad h ON v.Habilidad = h.id
       GROUP BY h.nombre
       ORDER BY count DESC`
    );

    return NextResponse.json(habilities);
  } catch (error) {
    console.error("[DATABASE ERROR]", error);
    return NextResponse.json([], { status: 500 });
  }
}
