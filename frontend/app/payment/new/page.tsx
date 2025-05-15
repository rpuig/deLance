"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Info, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { useWallet } from "@/components/wallet-provider"

export default function NewPayment() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { connected } = useWallet()

  // Redirigir si no está conectado
  useEffect(() => {
    if (!connected) {
      router.push("/connect")
    }
  }, [connected, router])

  // Datos de ejemplo - en una implementación real, estos datos vendrían de la selección del servicio
  const service = {
    id: "1",
    title: "Diseño Gráfico Profesional",
    freelancer: "Freelancer A",
    price: "2 SOL",
    fee: "0.1 SOL",
    total: "2.1 SOL",
  }

  const handleCreateContract = () => {
    setLoading(true)
    // Simulación de creación de contrato en la blockchain
    setTimeout(() => {
      setLoading(false)
      router.push("/contract/123")
    }, 2000)
  }

  if (!connected) {
    return null // No renderizar nada mientras redirige
  }

  return (
    <div className="container py-8 px-4">
      <div className="mb-4">
        <Button
          variant="ghost"
          className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <h1 className="text-2xl font-bold">Crear nuevo contrato</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardDescription>
                Estás contratando: {service.title} de {service.freelancer}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título del proyecto</Label>
                <Input id="title" defaultValue={service.title} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción detallada</Label>
                <Textarea id="description" placeholder="Describe detalladamente lo que necesitas..." rows={5} />
                <p className="text-xs text-gray-500">Sé específico sobre tus requisitos, plazos y expectativas.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Fecha límite</Label>
                <Input id="deadline" type="date" />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex flex-col sm:flex-row">
                <Info className="h-5 w-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5 mb-2 sm:mb-0" />
                <div>
                  <h4 className="font-medium text-yellow-800 mb-1">Información importante</h4>
                  <p className="text-sm text-yellow-700">
                    Al crear este contrato, el pago se mantendrá en un smart contract de escrow hasta que valides la
                    entrega del trabajo. El freelancer solo recibirá el pago una vez que confirmes que el trabajo ha
                    sido completado satisfactoriamente.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Resumen del pago</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Precio del servicio</span>
                  <span className="font-medium">{service.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Comisión de la plataforma</span>
                  <span className="font-medium">{service.fee}</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-bold">
                  <span>Total</span>
                  <span>{service.total}</span>
                </div>
              </div>

              <div className="mt-6 bg-solana-purple/10 border border-solana-purple/20 rounded-lg p-4 flex flex-col sm:flex-row">
                <Shield className="h-5 w-5 text-solana-purple mr-3 flex-shrink-0 mt-0.5 mb-2 sm:mb-0" />
                <div>
                  <h4 className="font-medium text-solana-purple mb-1">Pago seguro</h4>
                  <p className="text-sm text-solana-purple/80">
                    Tu pago está protegido por un smart contract de escrow en Solana.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-solana-purple hover:bg-solana-purple/90"
                onClick={handleCreateContract}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Procesando...
                  </span>
                ) : (
                  "Crear contrato y pagar"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
