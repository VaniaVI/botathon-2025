// app/api/campana/route.ts
import { NextResponse } from "next/server";
import { query } from "@/lib/api-integration";

export async function GET() {
  try {
    const campana = await query<{ programa_campana: string; count: number }[]>(
      `SELECT p.campana AS programa_campana, COUNT(*) AS count
       FROM volunteer v
       JOIN programa_campana p ON v.Campana = p.id
       GROUP BY p.campana
       ORDER BY count DESC`
    );

      return NextResponse.json(campana);
  } catch (error) {
    console.error("[DATABASE ERROR]", error);
    return NextResponse.json([], { status: 500 });
  }
}