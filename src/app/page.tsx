"use client"

import { useEffect, useState } from "react"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { ParticipationChart } from "@/components/dashboard/participation-chart"
import { RegionDistribution } from "@/components/dashboard/region-distribution"
import { VolunteerTypeChart } from "@/components/dashboard/volunteer-type-chart"
import type { DashboardStats } from "@/types/volunteer"
import { initializeMockData } from "@/lib/mock-data"
import { Loader2 } from "lucide-react"

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Inicializa datos mock
    initializeMockData()

    // Carga estadísticas
    const loadStats = async () => {
      try {
        const response = await fetch("/api/dashboard/stats")
        const result = await response.json()
        if (result.success) {
          setStats(result.data)
        }
      } catch (error) {
        console.error("[ERROR]", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Error al cargar datos</p>
      </div>
    )
  }

  const uniqueRegions = new Set(stats.voluntariosPorRegion.map((r) => r.region)).size

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">CRM Voluntarios Teletón</h1>
              <p className="mt-1 text-muted-foreground">Sistema de Gestión de Voluntariado - Botathon 2025</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-primary" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Stats Cards */}
          <StatsCards
            totalVoluntarios={stats.totalVoluntarios}
            voluntariosActivos={stats.voluntariosActivos}
            totalRegiones={uniqueRegions}
            participacionActual={stats.voluntariosActivos}
          />

          {/* Charts Row 1 */}
          <div className="grid gap-6 lg:grid-cols-2">
            <ParticipationChart data={stats.participacionMensual} />
            <RegionDistribution data={stats.voluntariosPorRegion} />
          </div>

          {/* Charts Row 2 */}
          <div className="grid gap-6 lg:grid-cols-2">
            <VolunteerTypeChart data={stats.voluntariosPorTipo} />
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Integración Blue Prism</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-green-500" />
                  <div>
                    <p className="font-medium text-foreground">Base de Datos</p>
                    <p className="text-muted-foreground">Configurar en DATABASE_URL</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                  <div>
                    <p className="font-medium text-foreground">Blue Prism RPA</p>
                    <p className="text-muted-foreground">Ver lib/api-integration.ts</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-orange-500" />
                  <div>
                    <p className="font-medium text-foreground">Endpoints API</p>
                    <p className="text-muted-foreground">5 puntos de integración activos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
