"use client";

import { createContext, useContext, type ReactNode, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"

// Definir los tipos para la API de Solflare
type SolflareWallet = {
  connect: () => Promise<{ publicKey: PublicKey }>
  disconnect: () => Promise<void>
  publicKey: PublicKey | null
  isConnected: boolean
  on: (event: string, callback: (...args: any[]) => void) => void
  off: (event: string, callback: (...args: any[]) => void) => void
}

// Extender la interfaz Window para incluir Solflare
declare global {
  interface Window {
    solflare?: SolflareWallet
  }
}

type WalletContextType = {
  connected: boolean
  address: string | null
  connect: () => Promise<void>
  disconnect: () => void
  openWalletModal: () => void
  balance: string | null
}

const WalletContext = createContext<WalletContextType>({
  connected: false,
  address: null,
  connect: async () => {},
  disconnect: () => {},
  openWalletModal: () => {},
  balance: null,
})

// Endpoint de RPC de Solana (usando el endpoint público de Solana Devnet para desarrollo)
const SOLANA_RPC_ENDPOINT = "https://api.testnet.solana.com"

export function WalletProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [isSolflareInstalled, setIsSolflareInstalled] = useState(false)

  // Comprobar si Solflare está instalado
  useEffect(() => {
    const checkSolflareInstalled = () => {
      const isSolflareAvailable = window.solflare && window.solflare.isConnected !== undefined
      setIsSolflareInstalled(!!isSolflareAvailable)
    }

    checkSolflareInstalled()
    // También verificar cuando la ventana se enfoca, por si el usuario instala la extensión mientras la página está abierta
    window.addEventListener("focus", checkSolflareInstalled)
    return () => window.removeEventListener("focus", checkSolflareInstalled)
  }, [])

  // Comprobar si ya hay una conexión activa al cargar la página
  useEffect(() => {
    const checkConnection = async () => {
      if (window.solflare && window.solflare.isConnected) {
        try {
          // Si Solflare ya está conectado, obtener la clave pública
          const publicKey = window.solflare.publicKey
          if (publicKey) {
            setAddress(publicKey.toString())
            setConnected(true)
            await fetchBalance(publicKey.toString())
          }
        } catch (error) {
          console.error("Error al verificar la conexión existente:", error)
        }
      }
    }

    checkConnection()
  }, [])

  // Configurar listeners para eventos de Solflare
  useEffect(() => {
    if (!window.solflare) return

    const handleConnect = async (publicKey: PublicKey) => {
      setAddress(publicKey.toString())
      setConnected(true)
      await fetchBalance(publicKey.toString())
    }

    const handleDisconnect = () => {
      setAddress(null)
      setBalance(null)
      setConnected(false)
    }

    const handleAccountChange = async (publicKey: PublicKey) => {
      setAddress(publicKey.toString())
      await fetchBalance(publicKey.toString())
    }

    // Añadir event listeners
    window.solflare.on("connect", handleConnect)
    window.solflare.on("disconnect", handleDisconnect)
    window.solflare.on("accountChanged", handleAccountChange)

    // Limpiar event listeners al desmontar
    return () => {
      if (window.solflare) {
        window.solflare.off("connect", handleConnect)
        window.solflare.off("disconnect", handleDisconnect)
        window.solflare.off("accountChanged", handleAccountChange)
      }
    }
  }, [])

  // Función para obtener el balance de SOL
  const fetchBalance = async (address: string) => {
    try {
      const connection = new Connection(SOLANA_RPC_ENDPOINT, "confirmed")
      const publicKey = new PublicKey(address)
      const balanceInLamports = await connection.getBalance(publicKey)
      const balanceInSOL = (balanceInLamports / LAMPORTS_PER_SOL).toFixed(2)
      setBalance(balanceInSOL)
      return balanceInSOL
    } catch (error) {
      console.error("Error al obtener el balance:", error)
      setBalance("0.00")
      return "0.00"
    }
  }

  const openWalletModal = () => {
    setShowWalletModal(true)
  }

  const connectSolflare = async () => {
    if (!window.solflare) {
      alert("Solflare no está instalado. Por favor, instala la extensión Solflare para continuar.")
      return
    }

    try {
      setConnecting(true)

      // Conectar con Solflare
      const { publicKey } = await window.solflare.connect()

      if (publicKey) {
        const addressString = publicKey.toString()
        setAddress(addressString)
        setConnected(true)

        // Obtener el balance
        await fetchBalance(addressString)
      }

      setShowWalletModal(false)
    } catch (error) {
      console.error("Error al conectar con Solflare:", error)
      alert("Error al conectar con Solflare. Por favor, intenta de nuevo.")
    } finally {
      setConnecting(false)
    }
  }

  const disconnect = async () => {
    if (window.solflare) {
      try {
        await window.solflare.disconnect()
      } catch (error) {
        console.error("Error al desconectar:", error)
      }
    }

    setAddress(null)
    setBalance(null)
    setConnected(false)
  }

  return (
    <WalletContext.Provider
      value={{
        connected,
        address,
        connect: connectSolflare,
        disconnect,
        openWalletModal,
        balance,
      }}
    >
      {children}

      <Dialog open={showWalletModal} onOpenChange={setShowWalletModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Conectar Wallet</DialogTitle>
            <DialogDescription>Conecta tu wallet de Solana para acceder a deLance</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <Button
              onClick={connectSolflare}
              disabled={connecting || !isSolflareInstalled}
              className="flex items-center justify-center gap-2 bg-solana-purple hover:bg-solana-purple/90"
            >
              {connecting ? (
                <>
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
                  Conectando...
                </>
              ) : (
                <>
                  <SolflareIcon />
                  Conectar con Solflare
                </>
              )}
            </Button>

            {!isSolflareInstalled && (
              <div className="text-center text-sm text-yellow-600 dark:text-yellow-400">
                No se detectó Solflare.{" "}
                <a href="https://solflare.com" target="_blank" rel="noopener noreferrer" className="underline">
                  Instalar Solflare
                </a>
              </div>
            )}
          </div>

          <DialogFooter className="sm:justify-center">
            <Button variant="outline" onClick={() => setShowWalletModal(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </WalletContext.Provider>
  )
}

export const useWallet = () => useContext(WalletContext)

function SolflareIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M107.1 50.3L69 12.1C65.3 8.4 59.6 8.4 55.9 12.1L12.1 55.9C8.4 59.6 8.4 65.3 12.1 69L50.3 107.1C54 110.8 59.7 110.8 63.4 107.1L107.1 63.4C110.8 59.7 110.8 54 107.1 50.3Z"
        fill="#00A9E0"
      />
      <path
        d="M33.5 66.5L66.5 33.5C69.1 30.9 74.5 30.9 77.1 33.5L94.7 51.1C97.3 53.7 97.3 59.1 94.7 61.7L61.7 94.7C59.1 97.3 53.7 97.3 51.1 94.7L33.5 77.1C30.9 74.5 30.9 69.1 33.5 66.5Z"
        fill="white"
      />
    </svg>
  )
}
