"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

// credenciales "falsas" para salir del apuro
const VALID_EMAIL = "admin@botathon.cl"
const VALID_PASSWORD = "Teleton2025"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorEmail, setErrorEmail] = useState("")
  const [errorPassword, setErrorPassword] = useState("")
  const [errorGeneral, setErrorGeneral] = useState("")
  const [loading, setLoading] = useState(false)

  // si ya está logueado, lo mando al dashboard
  useEffect(() => {
    const isAuth = typeof window !== "undefined" ? localStorage.getItem("isAuthenticated") : null
    if (isAuth === "true") {
      router.push("/")
    }
  }, [router])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setErrorEmail("")
    setErrorPassword("")
    setErrorGeneral("")

    // validaciones simples
    let hayError = false

    if (!email.trim()) {
      setErrorEmail("El correo es obligatorio")
      hayError = true
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorEmail("Ingresa un correo válido")
      hayError = true
    }

    if (!password.trim()) {
      setErrorPassword("La contraseña es obligatoria")
      hayError = true
    } else if (password.length < 4) {
      setErrorPassword("La contraseña debe tener al menos 4 caracteres")
      hayError = true
    }

    if (hayError) return

    setLoading(true)
    try {
      // login fake para el apuro
      if (email === VALID_EMAIL && password === VALID_PASSWORD) {
        localStorage.setItem("isAuthenticated", "true")
        router.push("/") // al dashboard
      } else {
        setErrorGeneral("Usuario o contraseña incorrectos")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Iniciar sesión
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Correo</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@botathon.cl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errorEmail && (
                <p className="text-red-500 text-xs mt-1">{errorEmail}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errorPassword && (
                <p className="text-red-500 text-xs mt-1">{errorPassword}</p>
              )}
            </div>

            {errorGeneral && (
              <p className="text-red-500 text-sm mt-1 text-center">{errorGeneral}</p>
            )}

            <Button
              type="submit"
              className="w-full mt-2"
              disabled={loading}
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
