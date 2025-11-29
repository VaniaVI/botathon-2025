"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"

interface ParticipationChartProps {
  data: { mes: string | number; participantes: number }[] // Mes puede venir como string o número desde BD
}

export function ParticipationChart({ data }: ParticipationChartProps) {
  // Formatear meses si vienen como números
  const formattedData = data.map(d => {
    let mesLabel = d.mes
    if (typeof d.mes === "number") {
      const date = new Date(0, d.mes - 1) // mes 1-12
      mesLabel = date.toLocaleString("es-CL", { month: "short" })
    }
    return { ...d, mes: mesLabel }
  })

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Participación Mensual</CardTitle>
        <CardDescription className="text-muted-foreground">
          Evolución de voluntarios participantes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData.length ? formattedData : [{ mes: "", participantes: 0 }]}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--color-border))" />
            <XAxis dataKey="mes" stroke="rgb(var(--color-muted-foreground))" style={{ fontSize: "12px" }} />
            <YAxis stroke="rgb(var(--color-muted-foreground))" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgb(var(--color-card))",
                border: "1px solid rgb(var(--color-border))",
                borderRadius: "8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="participantes"
              stroke="rgb(var(--color-primary))"
              strokeWidth={2}
              dot={{ fill: "rgb(var(--color-primary))", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
