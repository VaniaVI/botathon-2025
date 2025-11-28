"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Users, CheckCircle } from "lucide-react"
import type { FilterOptions } from "@/types/volunteer"
import { toast } from "sonner"

interface SegmentationPanelProps {
  filters: FilterOptions
  selectedCount: number
}

export function SegmentationPanel({ filters, selectedCount }: SegmentationPanelProps) {
  const [communicationType, setCommunicationType] = useState<string>("email")
  const [message, setMessage] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSegment = async () => {
    if (!message.trim()) {
      toast.error("Debes escribir un mensaje")
      return
    }

    setLoading(true)
    setSuccess(false)

    try {
      const response = await fetch("/api/communications/segment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filters,
          communicationType,
          message,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setSuccess(true)
        toast.success(result.message)
      }
    } catch (error) {
      console.error("[SEGMENTATION ERROR]", error)
      toast.error("Error al segmentar voluntarios")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Comunicación Segmentada</CardTitle>
        <CardDescription className="text-muted-foreground">
          Prepara una comunicación masiva para los voluntarios seleccionados
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="rounded-lg bg-secondary p-4">
          <div className="flex items-center gap-2 text-foreground">
            <Users className="h-5 w-5 text-primary" />
            <span className="font-semibold text-lg">{selectedCount}</span>
            <span className="text-muted-foreground">voluntarios seleccionados</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Tipo de Comunicación</Label>
          <Select value={communicationType} onValueChange={setCommunicationType}>
            <SelectTrigger className="border-border bg-background text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Correo Electrónico</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="push">Notificación Push</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Mensaje</Label>
          <Textarea
            placeholder="Escribe el mensaje que se enviará a los voluntarios seleccionados..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            className="border-border bg-background text-foreground"
          />
        </div>

        <Button
          onClick={handleSegment}
          disabled={loading || selectedCount === 0}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {success ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Comunicación Preparada
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              {loading ? "Procesando..." : "Preparar Comunicación"}
            </>
          )}
        </Button>

        {success && (
          <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-800">
            <strong>¡Listo!</strong> La comunicación ha sido segmentada y está lista para envío. Blue Prism procesará el
            envío masivo.
          </div>
        )}

        <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-xs text-blue-800">
          <strong>🔵 Integración Blue Prism:</strong> Este módulo simula la preparación de comunicaciones masivas. Blue
          Prism se encargará del envío real mediante RPA.
        </div>
      </CardContent>
    </Card>
  )
}
