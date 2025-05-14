"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Wallet } from "lucide-react"
import { useRouter } from "next/navigation"
import { useWallet } from "@/components/wallet-provider"

export default function ConnectWallet() {
  const router = useRouter()
  const { connected, openWalletModal } = useWallet()

  // Redirigir si ya está conectado
  useEffect(() => {
    if (connected) {
      router.push("/role-selection")
    }
  }, [connected, router])

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-8 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl">Bienvenido a deLance</CardTitle>
          <CardDescription>Plataforma de freelancers en Solana</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <div className="h-24 w-24 rounded-full bg-solana-purple/10 flex items-center justify-center">
              <Wallet className="h-12 w-12 text-solana-purple" />
            </div>
          </div>
          <p className="text-sm text-center text-gray-500">
            Para utilizar deLance, necesitas conectar tu wallet de Solana. Recomendamos usar Solflare para la mejor
            experiencia.
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-solana-purple hover:bg-solana-purple/90" onClick={openWalletModal}>
            Conectar Wallet
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
