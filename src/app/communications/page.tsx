"use client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { SearchFilters } from "@/components/search/search-filters"
import { VolunteersTable } from "@/components/search/volunteers-table"
import { SegmentationPanel } from "@/components/communications/segmentation-panel"
import type { FilterOptions, Volunteer } from "@/types/volunteer"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SearchPage() {
  const router = useRouter()
  const [filters, setFilters] = useState<FilterOptions>({})
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [searchDuration, setSearchDuration] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const [regiones, setRegiones] = useState<string[]>([])
  const [tiposVoluntariado, setTiposVoluntariado] = useState<string[]>([])
  const [habilidades, setHabilidades] = useState<string[]>([])
  const [campanas, setCampanas] = useState<string[]>([])
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const isAuth =
      typeof window !== "undefined" ? localStorage.getItem("isAuthenticated") : null

    if (isAuth !== "true") {
      router.push("/login")
    } else {
      setAuthChecked(true)
    }
  }, [router])

  // 🔹 Traer filtros iniciales
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        // Regiones
        const regionsResponse = await fetch("/api/regions")
        const regionsData = await regionsResponse.json()
        setRegiones(regionsData.map((r: { region: string }) => r.region))

        // Habilidades
        const habilitiesResponse = await fetch("/api/habilidad")
        const habilitiesData = await habilitiesResponse.json()
        setHabilidades(habilitiesData.map((h: { habilidad: string }) => h.habilidad))

        // Tipos de voluntariado
        const tiposResponse = await fetch("/api/tipoVoluntariado")
        const tiposData = await tiposResponse.json()
        setTiposVoluntariado(tiposData.map((t: { tipo_voluntariado: string }) => t.tipo_voluntariado))

        // Campañas
        const campanasResponse = await fetch("/api/campana")
        const campanasData = await campanasResponse.json()
        setCampanas(campanasData.map((c: { programa_campana: string }) => c.programa_campana))

        // Traer voluntarios iniciales
        const response = await fetch("/api/volunteers/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        })
        const result = await response.json()
        if (result.success) {
          setVolunteers(result.data)
          setTotalCount(result.count || result.data.length)
          setSearchDuration(result.duration || "")
        }
      } catch (error) {
        console.error("[FILTER DATA ERROR]", error)
      }
    }

    fetchFilterData()
  }, [])

  const handleSearch = async () => {
    setLoading(true)
    try {
      // Normalizar filtros: "Todas" o "Todos" => undefined
      const normalizedFilters: FilterOptions = { ...filters }
      Object.keys(normalizedFilters).forEach((key) => {
        const value = (normalizedFilters as any)[key]
        if (value === "Todas" || value === "Todos") {
          ;(normalizedFilters as any)[key] = undefined
        }
      })

      const response = await fetch("/api/volunteers/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalizedFilters),
      })
      const result = await response.json()
      if (result.success) {
        setVolunteers(result.data)
        setTotalCount(result.count || result.data.length)
        setSearchDuration(result.duration || "")
      }
    } catch (error) {
      console.error("[SEARCH ERROR]", error)
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setFilters({})
    setVolunteers([])
    setTotalCount(0)
    setSearchDuration("")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Volver al Dashboard
            </Link>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-foreground">Búsqueda de Voluntarios</h1>
          <p className="mt-1 text-muted-foreground">Motor de búsqueda inteligente</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
  <div className="grid lg:grid-cols-3 gap-6">
    {/* Columna izquierda: filtros + tabla */}
    <div className="lg:col-span-2 space-y-6">
      <SearchFilters
        filters={filters}
        onFilterChange={setFilters}
        onSearch={handleSearch}
        onClear={handleClear}
        loading={loading}
        regiones={regiones}
        tiposVoluntariado={tiposVoluntariado}
        habilidades={habilidades}
        campanas={campanas}
      />

      {(volunteers.length > 0 || loading) && (
        <VolunteersTable
          volunteers={volunteers}
          totalCount={totalCount}
          searchDuration={searchDuration}
        />
      )}
    </div>

    {/* Columna derecha: segmentación */}
    <div className="lg:col-span-1">
      <div className="sticky top-4">
        <SegmentationPanel filters={filters} selectedCount={totalCount} />
      </div>
    </div>
  </div>
</main>

    </div>
  )
}
