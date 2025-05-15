"use client"

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

declare global {
  interface Window {
    solflare: {
      connect: () => Promise<void>
      disconnect: () => Promise<void>
      publicKey: any
      on: (event: string, callback: () => void) => void
      off: (event: string, callback: () => void) => void
    }
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

export function WalletProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [isSolflareInstalled, setIsSolflareInstalled] = useState(false)

  // Check if Solflare is installed
  useEffect(() => {
    const checkSolflare = () => {
      setIsSolflareInstalled(!!window.solflare)
    }
    
    // Check immediately
    if (typeof window !== 'undefined') {
      checkSolflare()
    }
    
    // Also check after a delay to handle slow loading extensions
    const timer = setTimeout(checkSolflare, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Restore connection state on page load
  useEffect(() => {
    const isConnected = localStorage.getItem("walletConnected") === "true"
    const savedAddress = localStorage.getItem("walletAddress")
    const savedBalance = localStorage.getItem("walletBalance")

    if (isConnected && savedAddress) {
      setConnected(true)
      setAddress(savedAddress)
      setBalance(savedBalance)
    }
  }, [])

  const openWalletModal = () => {
    setShowWalletModal(true)
  }

  const connectSolflare = async () => {
    try {
      setConnecting(true)
      
      // Check if Solflare is installed
      if (!window.solflare) {
        alert("Solflare wallet not found! Please install the Solflare extension.")
        setConnecting(false)
        return
      }
      
      try {
        // Connect to Solflare
        await window.solflare.connect()
        
        // Get the wallet address - make sure we're using the actual Solflare public key
        const publicKeyString = window.solflare.publicKey.toString()
        console.log("Connected to Solflare wallet:", publicKeyString) // Debug log
        
        // Set a placeholder balance initially
        let solBalance = "--"
        
        // Try to get the wallet balance
        try {
          const connection = new Connection("https://api.devnet.solana.com", "confirmed")
          const publicKey = window.solflare.publicKey
          const balance = await connection.getBalance(publicKey)
          solBalance = (balance / LAMPORTS_PER_SOL).toFixed(2)
        } catch (balanceError) {
          console.error("Error fetching balance:", balanceError)
          // Continue with connection even if balance fetch fails
        }
        
        // Make sure we're setting the actual address from Solflare
        setAddress(publicKeyString)
        setBalance(solBalance)
        setConnected(true)
        
        // Save the actual address to localStorage
        localStorage.setItem("walletConnected", "true")
        localStorage.setItem("walletAddress", publicKeyString) // Use the actual Solflare address
        localStorage.setItem("walletBalance", solBalance) // Use the actual balance
        
        setShowWalletModal(false)
      } catch (error) {
        console.error("Error connecting to Solflare:", error)
        alert("Failed to connect to Solflare wallet.")
      }
    } catch (error) {
      console.error("Error al conectar con Solflare:", error)
    } finally {
      setConnecting(false)
    }
  }
  
  // Separate function to fetch balance
  const fetchBalance = async (publicKey: PublicKey): Promise<string | null> => {
    try {
      // Try multiple RPC endpoints in case one fails
      const endpoints = [
        "https://api.devnet.solana.com",
        "https://api.mainnet-beta.solana.com",
        "https://solana-api.projectserum.com"
      ]
      
      for (const endpoint of endpoints) {
        try {
          const connection = new Connection(endpoint, "confirmed")
          const balance = await connection.getBalance(publicKey)
          return (balance / LAMPORTS_PER_SOL).toFixed(2)
        } catch (e) {
          console.warn(`Failed to connect to ${endpoint}:`, e)
          // Try the next endpoint
        }
      }
      
      // If all endpoints fail
      return null
    } catch (error) {
      console.error("Error fetching balance:", error)
      return null
    }
  }

  const disconnect = async () => {
    if (window.solflare) {
      try {
        await window.solflare.disconnect()
      } catch (error) {
        console.error("Error disconnecting from Solflare:", error)
      }
    }
    
    setAddress(null)
    setBalance(null)
    setConnected(false)
    
    // Clear localStorage
    localStorage.removeItem("walletConnected")
    localStorage.removeItem("walletAddress")
    localStorage.removeItem("walletBalance")
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
        d="M107.1 50.3L69 12.1C65.3 8.4 59.4 8.4 55.7 12.1L17.6 50.3C13.9 54 13.9 59.9 17.6 63.6L55.7 101.8C59.4 105.5 65.3 105.5 69 101.8L107.1 63.6C110.9 59.9 110.9 54 107.1 50.3Z"
        fill="#FF9E00"
      />
      <path
        d="M62.3 19.7L23.5 58.5C21.6 60.4 21.6 63.5 23.5 65.4L62.3 104.2C64.2 106.1 67.3 106.1 69.2 104.2L108 65.4C109.9 63.5 109.9 60.4 108 58.5L69.2 19.7C67.3 17.8 64.2 17.8 62.3 19.7Z"
        fill="#FFC700"
      />
      <path
        d="M73.3 65.8L62.4 76.7C61.9 77.2 61.1 77.2 60.6 76.7L49.7 65.8C49.2 65.3 49.2 64.5 49.7 64L60.6 53.1C61.1 52.6 61.9 52.6 62.4 53.1L73.3 64C73.8 64.5 73.8 65.3 73.3 65.8Z"
        fill="#FFDD6C"
      />
      <path
        d="M73.3 65.8L62.4 76.7C61.9 77.2 61.1 77.2 60.6 76.7L49.7 65.8C49.2 65.3 49.2 64.5 49.7 64L60.6 53.1C61.1 52.6 61.9 52.6 62.4 53.1L73.3 64C73.8 64.5 73.8 65.3 73.3 65.8Z"
        fill="white"
      />
    </svg>
  )
}
