"use client"

import { type ReactNode, useEffect, useState } from "react"
import { OrderlyProvider } from "@orderly.network/hooks"
import { orderlyConfig } from "@/services/orderly"
import { useWallet } from "@solana/wallet-adapter-react"

interface OrderlyProviderWrapperProps {
  children: ReactNode
}

export default function OrderlyProviderWrapper({ children }: OrderlyProviderWrapperProps) {
  const { publicKey, signMessage } = useWallet()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Solo inicializar cuando el wallet esté conectado
    if (publicKey) {
      setIsReady(true)
    }
  }, [publicKey])

  if (!isReady || !publicKey) {
    return <div>Conecta tu wallet para continuar</div>
  }

  return (
    <OrderlyProvider
      config={orderlyConfig}
      accountId={publicKey.toString()}
      chainId="solana"
      wallet={{
        signMessage: async (message: Uint8Array) => {
          if (!signMessage) throw new Error("Wallet no soporta firma de mensajes")

          // Firmar el mensaje
          const signatureBytes = await signMessage(message)

          // Convertir a base64 en lugar de usar bs58
          // Esto usa APIs nativas del navegador
          return arrayBufferToBase64(signatureBytes)
        },
      }}
    >
      {children}
    </OrderlyProvider>
  )
}

// Función auxiliar para convertir ArrayBuffer a base64
function arrayBufferToBase64(buffer: Uint8Array): string {
  // Convertir Uint8Array a string
  let binary = ""
  const bytes = new Uint8Array(buffer)
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }

  // Convertir string binario a base64
  return window.btoa(binary)
}
