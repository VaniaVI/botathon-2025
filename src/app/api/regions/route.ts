// app/api/regions/route.ts
import { NextResponse } from "next/server";
import { query } from "@/lib/api-integration";

export async function GET() {
  try {
    const regions = await query<{ region: string; count: number }[]>(
      `SELECT r.nombre AS region, COUNT(*) AS count
       FROM volunteer v
       JOIN region r ON v.RegionPostulante = r.id
       GROUP BY r.nombre
       ORDER BY count DESC`
    );

    return NextResponse.json(regions);
  } catch (error) {
    console.error("[DATABASE ERROR]", error);
    return NextResponse.json([], { status: 500 });
  }
}
