"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"

export function RegionDistribution() {
  const [data, setData] = useState<{ region: string; count: number }[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/regions")
        const json = await res.json()
        setData(json)
      } catch (error) {
        console.error("Error fetching regions:", error)
      }
    }

    fetchData()
  }, [])

const topRegions = data
  .filter(item => item.region)
  .sort((a, b) => b.count - a.count)
  .slice(0, 10)
  .map(item => ({
    ...item,
    region: String(item.region).replace("Región de ", "").replace("Región del ", "").replace("Región ", ""),
  }));

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Distribución Geográfica</CardTitle>
        <CardDescription className="text-muted-foreground">Top 10 regiones con más voluntarios</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topRegions} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--color-border))" />
            <XAxis type="number" stroke="rgb(var(--color-muted-foreground))" style={{ fontSize: "12px" }} />
            <YAxis
              type="category"
              dataKey="region"
              width={120}
              stroke="rgb(var(--color-muted-foreground))"
              style={{ fontSize: "11px" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgb(var(--color-card))",
                border: "1px solid rgb(var(--color-border))",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="count" fill="rgb(var(--color-primary))" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
