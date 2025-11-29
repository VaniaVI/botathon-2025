"use client"

import { useState } from "react"
import { UploadCloud } from "lucide-react"

interface UploadFileProps {
  onFileSelected: (file: File) => void
}

function UploadFile({ onFileSelected }: UploadFileProps) {
  const [fileName, setFileName] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    const allowedTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ]

    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Solo se permiten archivos Excel (.xls, .xlsx) o CSV (.csv)")
      event.target.value = ""
      setFileName(null)
      setFile(null)
      return
    }

    setFileName(selectedFile.name)
    setFile(selectedFile)
    onFileSelected(selectedFile)
  }

  const handleSend = () => {
    if (!file) {
      alert("Primero selecciona un archivo")
      return
    }

    // Simulación de envío
    alert(`Archivo "${file.name}" enviado correctamente ✅`)

    // Limpiar selección
    setFileName(null)
    setFile(null)
    const input = document.getElementById("file-upload") as HTMLInputElement
    if (input) input.value = ""
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto mt-12 p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
      <UploadCloud className="w-12 h-12 text-gray-400 mb-4" />
      <p className="text-gray-600 text-center mb-2">
        Arrastra tu archivo aquí o haz clic para seleccionar
      </p>
      <p className="text-gray-400 text-sm mb-4">
        Tipos permitidos: Excel (.xls, .xlsx), CSV (.csv)
      </p>

      <label
        htmlFor="file-upload"
        className="cursor-pointer inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Seleccionar archivo
      </label>
      <input
        id="file-upload"
        type="file"
        accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        onChange={handleFileChange}
        className="hidden"
      />

      {fileName && (
        <div className="mt-4 text-center">
          <p className="text-gray-700 font-medium">Archivo seleccionado:</p>
          <p className="text-gray-500 text-sm truncate">{fileName}</p>

          <button
            onClick={handleSend}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Enviar archivo
          </button>
        </div>
      )}
    </div>
  )
}

export default function UploadVolunteerFilePage() {
  const handleFileSelected = (file: File) => {
    console.log("Archivo recibido:", file)
    // Aquí podrías simular guardarlo en backend
  }

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Subir archivo de voluntarios</h1>
      <UploadFile onFileSelected={handleFileSelected} />
    </div>
  )
}