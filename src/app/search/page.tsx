"use client"

import { useState, useEffect } from "react"
import { SearchFilters } from "@/components/search/search-filters"
import { VolunteersTable } from "@/components/search/volunteers-table"
import type { FilterOptions, Volunteer } from "@/types/volunteer"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

function validarRut(rut: string) {
  rut = rut.replace(/\./g, "").replace("-", "")

  if (rut.length < 8) return false

  const cuerpo = rut.slice(0, -1)
  let dv = rut.slice(-1).toUpperCase()

  let suma = 0
  let multiplo = 2

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplo
    multiplo = multiplo < 7 ? multiplo + 1 : 2
  }

  const dvCalculado = 11 - (suma % 11)
  const dvFinal =
    dvCalculado === 11 ? "0" : dvCalculado === 10 ? "K" : dvCalculado.toString()

  return dv === dvFinal
}

export default function SearchPage() {
  const [filters, setFilters] = useState<FilterOptions>({})
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [searchDuration, setSearchDuration] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const [regiones, setRegiones] = useState<string[]>([])
  const [tiposVoluntariado, setTiposVoluntariado] = useState<string[]>([])
  const [habilidades, setHabilidades] = useState<string[]>([])
  const [campanas, setCampanas] = useState<string[]>([])

  const [errorNombre, setErrorNombre] = useState("")
  const [errorRut, setErrorRut] = useState("")

  // 🔹 Traer filtros iniciales + voluntarios iniciales
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
        setTiposVoluntariado(
          tiposData.map((t: { tipo_voluntariado: string }) => t.tipo_voluntariado)
        )

        // Campañas
        const campanasResponse = await fetch("/api/campana")
        const campanasData = await campanasResponse.json()
        setCampanas(
          campanasData.map((c: { programa_campana: string }) => c.programa_campana)
        )

        // Voluntarios iniciales (sin filtros)
        const response = await fetch("/api/volunteers/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        })
        const result = await response.json()
        if (result.success) {
          setVolunteers(result.data)
          setTotalCount(result.count ?? result.data.length)
        }
      } catch (error) {
        console.error("[FILTER DATA ERROR]", error)
      }
    }

    fetchFilterData()
  }, [])

  const handleSearch = async () => {
    // limpiamos errores primero
    setErrorNombre("")
    setErrorRut("")

    const term = filters.searchTerm?.trim() || ""
    const esRut = /^\d+[-‐-–—−]?[0-9kK]$/.test(term)

    // ✅ Validación de RUT antes de llamar a la API
    if (term !== "" && esRut && !validarRut(term)) {
      setErrorRut("El RUT no es válido")
      setVolunteers([])
      setTotalCount(0)
      setSearchDuration("")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/volunteers/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
      })

      const result = await response.json()

      if (result.success) {
        // si no hay resultados, prendemos el mensaje correspondiente
        if (result.count === 0 && term !== "") {
          if (esRut) {
            setErrorRut("El RUT no existe")
          } else {
            setErrorNombre("El nombre no existe")
          }
        }

        setVolunteers(result.data)
        setTotalCount(result.count)
        setSearchDuration(result.duration)
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
    setErrorNombre("")
    setErrorRut("")
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
          <h1 className="mt-4 text-3xl font-bold text-foreground">
            Búsqueda de Voluntarios
          </h1>
          <p className="mt-1 text-muted-foreground">Motor de búsqueda inteligente</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
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
            // 👇 AQUÍ ES DONDE SE CONECTAN LOS MENSAJES 👇
            errorNombre={errorNombre}
            errorRut={errorRut}
          />

          {(volunteers.length > 0 || loading) && (
            <VolunteersTable
              volunteers={volunteers}
              totalCount={totalCount}
              searchDuration={searchDuration}
            />
          )}
        </div>
      </main>
    </div>
  )
}
