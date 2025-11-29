// app/api/tipoVoluntariado/route.ts
import { NextResponse } from "next/server";
import { query } from "@/lib/api-integration";

export async function GET() {
  try {
    const voluntaries = await query<{ tipo_voluntariado: string; count: number }[]>(
      `SELECT t.tipo AS tipo_voluntariado, COUNT(*) AS count
       FROM volunteer v
       JOIN tipo_voluntariado t ON v.Tipo_voluntariado = t.id
       GROUP BY t.tipo
       ORDER BY count DESC`
    );

    return NextResponse.json(voluntaries);
  } catch (error) {
    console.error("[DATABASE ERROR]", error);
    return NextResponse.json([], { status: 500 });
  }
}