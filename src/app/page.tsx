"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { ParticipationChart } from "@/components/dashboard/participation-chart"
import { RegionDistribution } from "@/components/dashboard/region-distribution"
import { VolunteerTypeChart } from "@/components/dashboard/volunteer-type-chart"
import type { DashboardStats } from "@/types/volunteer"
import { Loader2 } from "lucide-react"
import Image from "next/image"

export default function Dashboard() {
  const router = useRouter()

  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  // para no mostrar nada hasta saber si está logueado
  const [authChecked, setAuthChecked] = useState(false)

  // 🔐 Chequear login
  useEffect(() => {
    const isAuth =
      typeof window !== "undefined" ? localStorage.getItem("isAuthenticated") : null

    if (isAuth !== "true") {
      router.push("/login")
    } else {
      setAuthChecked(true)
    }
  }, [router])

  // cargar stats solo si está autenticado
  useEffect(() => {
    if (!authChecked) return

    const loadStats = async () => {
      try {
        const response = await fetch("/api/dashboard/stats")
        const result = await response.json()
        if (result.success) {
          setStats(result.data)
        }
      } catch (error) {
        console.error("[DASHBOARD ERROR]", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [authChecked])

  // mientras revisa auth o carga stats, mostramos loader centrado
  if (!authChecked || loading) {
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

  const uniqueRegions = new Set(
    (stats.voluntariosPorRegion ?? []).map(r => r.key)
  ).size

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap items-center gap-6 sm:gap-10">
            {/* LOGO */}
            <Image
              src="/logo_teleton.png"
              alt="Logo Teleton"
              width={200}
              height={100}
              className="w-32 sm:w-48 h-auto"
            />

            {/* TEXTO */}
            <div className="flex flex-col">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                CRM Voluntarios Teletón
              </h1>
              <p className="mt-1 text-sm sm:text-base text-muted-foreground">
                Sistema de Gestión de Voluntariado - Botathon 2025
              </p>
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
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Base de Datos
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-green-500" />
                  <div>
                    <p className="font-medium text-foreground">Conexión activa</p>
                    <p className="text-muted-foreground">
                      Configurada en DATABASE_URL
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                  <div>
                    <p className="font-medium text-foreground">Endpoints API</p>
                    <p className="text-muted-foreground">
                      5 puntos de integración activos
                    </p>
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
