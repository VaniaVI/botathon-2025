"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"

interface ParticipationChartProps {
  data: { mes: string; participantes: number }[]
}

export function ParticipationChart({ data }: ParticipationChartProps) {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Participación Mensual</CardTitle>
        <CardDescription className="text-muted-foreground">
          Evolución de voluntarios participantes en 2024
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
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
