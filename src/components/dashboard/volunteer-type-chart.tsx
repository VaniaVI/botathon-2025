"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Pie, PieChart, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface VolunteerTypeChartProps {
  data: { tipo: string; count: number }[]
}

const COLORS = [
  "rgb(var(--color-chart-1))",
  "rgb(var(--color-chart-2))",
  "rgb(var(--color-chart-3))",
  "rgb(var(--color-chart-4))",
  "rgb(var(--color-chart-5))",
]

export function VolunteerTypeChart({ data }: VolunteerTypeChartProps) {
  const topTypes = data.sort((a, b) => b.count - a.count).slice(0, 5)

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Tipos de Voluntariado</CardTitle>
        <CardDescription className="text-muted-foreground">Distribución por categoría (Top 5)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={topTypes}
              dataKey="count"
              nameKey="tipo"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={(entry) => `${entry.count}`}
            >
              {topTypes.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgb(var(--color-card))",
                border: "1px solid rgb(var(--color-border))",
                borderRadius: "8px",
              }}
            />
            <Legend
              wrapperStyle={{
                fontSize: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
