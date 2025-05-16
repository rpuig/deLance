"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

// Tokens de ejemplo para mostrar en la interfaz
const EXAMPLE_TOKENS = ["USDC", "SOL", "USDT", "ETH", "BTC"]

export default function CurrencyPreferenceForm() {
  const [selectedToken, setSelectedToken] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Establecer USDC como valor predeterminado
    setSelectedToken("USDC")
  }, [])

  const handleSavePreference = async () => {
    if (!selectedToken) return

    setIsLoading(true)
    try {
      // Aquí guardaríamos la preferencia en la base de datos
      // Por ahora, simulamos una llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Preferencia guardada",
        description: `Recibirás tus pagos en ${selectedToken}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar tu preferencia de moneda",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Preferencia de Moneda</CardTitle>
        <CardDescription>Selecciona la moneda en la que deseas recibir tus pagos automáticamente</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="currency" className="text-sm font-medium">
              Moneda preferida
            </label>
            <Select value={selectedToken} onValueChange={setSelectedToken}>
              <SelectTrigger id="currency">
                <SelectValue placeholder="Selecciona una moneda" />
              </SelectTrigger>
              <SelectContent>
                {EXAMPLE_TOKENS.map((token) => (
                  <SelectItem key={token} value={token}>
                    {token}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSavePreference} disabled={isLoading || !selectedToken} className="w-full">
          {isLoading ? "Guardando..." : "Guardar preferencia"}
        </Button>
      </CardFooter>
    </Card>
  )
}
