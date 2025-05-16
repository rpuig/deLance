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
import { 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  Connection, 
  LAMPORTS_PER_SOL,
  clusterApiUrl,
  Keypair
} from "@solana/web3.js"

export default function NewPayment() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const wallet = useWallet()
  const { connected, address } = wallet
  const [title, setTitle] = useState("Diseño Gráfico Profesional")
  const [description, setDescription] = useState("")
  const [deadline, setDeadline] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

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
    price: "0.001 SOL", // Very small amount for testing
    fee: "0.0001 SOL",
    total: "0.0011 SOL",
  }

  // Convert SOL string to lamports number
  const solToLamports = (solString) => {
    const sol = parseFloat(solString.replace(" SOL", ""))
    return Math.floor(sol * LAMPORTS_PER_SOL) // 1 SOL = 1 billion lamports
  }

  const handleCreateContract = async () => {
    if (!address) {
      setErrorMessage("Wallet not connected")
      return
    }
    
    setLoading(true)
    setErrorMessage(null)
    
    try {
      console.log("Starting contract creation process...")
      
      // Convert address string to PublicKey
      const userPublicKey = new PublicKey(address)
      console.log("User public key:", userPublicKey.toString())
      
      // Create a connection to the Solana cluster
      const connection = new Connection(
        clusterApiUrl("devnet"),
        "confirmed"
      )
      console.log("Connected to Solana devnet")
      
      // Create a new keypair for the escrow account
      // This will be a regular account that we'll use to hold the funds
      const escrowAccount = Keypair.generate()
      console.log("Generated escrow account:", escrowAccount.publicKey.toString())
      
      // Calculate the rent exemption amount
      const rentExemptionAmount = await connection.getMinimumBalanceForRentExemption(0)
      console.log("Rent exemption amount:", rentExemptionAmount)
      
      // Total amount to lock in escrow (in lamports)
      const paymentAmount = solToLamports(service.total)
      console.log("Payment amount:", paymentAmount)
      
      // Create a simple transaction to transfer SOL to the escrow account
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: userPublicKey,
          toPubkey: escrowAccount.publicKey,
          lamports: rentExemptionAmount + paymentAmount
        })
      )
      
      // Get a recent blockhash - always get a fresh one
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("finalized")
      transaction.recentBlockhash = blockhash
      transaction.lastValidBlockHeight = lastValidBlockHeight
      transaction.feePayer = userPublicKey
      
      console.log("About to sign transaction with wallet")
      
      // Sign with the user's wallet
      let signedTransaction
      try {
        if (window.solflare && typeof window.solflare.signTransaction === 'function') {
          signedTransaction = await window.solflare.signTransaction(transaction)
          console.log("Transaction signed with Solflare")
        } else {
          throw new Error("Solflare wallet not available")
        }
      } catch (signError) {
        console.error("Error signing transaction:", signError)
        setErrorMessage(`Error signing transaction: ${signError.message || JSON.stringify(signError)}`)
        throw signError
      }
      
      // Send the transaction
      console.log("Sending transaction...")
      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize(),
        { 
          skipPreflight: false,
          preflightCommitment: "confirmed",
          maxRetries: 3
        }
      )
      console.log("Transaction sent, signature:", signature)
      
      // Wait for confirmation
      console.log("Waiting for confirmation...")
      const confirmation = await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature
      }, "confirmed")
      
      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`)
      }
      
      console.log("Transaction confirmed:", confirmation)
      
      // Generate a contract reference
      const contractRef = `CONTRACT-${Date.now().toString(36).toUpperCase()}`
      
      // Store contract details (in a real app, you'd store this in a database)
      const contractDetails = {
        id: contractRef,
        title: title,
        description: description,
        deadline: deadline,
        amount: service.total,
        transactionSignature: signature,
        escrowAccount: escrowAccount.publicKey.toString(),
        escrowPrivateKey: Array.from(escrowAccount.secretKey), // Save this securely in a real app!
        clientAccount: address,
        freelancerAccount: "FREELANCER_PUBKEY", // Replace with actual freelancer pubkey
        status: "active",
        createdAt: new Date().toISOString(),
      }
      
      // In a real app, you would save this to your backend
      console.log("Contract created:", contractDetails)
      
      // For demo purposes, save the escrow account's private key to localStorage
      // WARNING: This is NOT secure and should NOT be done in a production app!
      // In a real app, you would store this securely on your backend
      localStorage.setItem(`escrow_${contractRef}`, JSON.stringify({
        publicKey: escrowAccount.publicKey.toString(),
        secretKey: Array.from(escrowAccount.secretKey),
      }))
      
      // Redirect to the contract page
      router.push(`/contract/${contractRef}?escrow=${escrowAccount.publicKey.toString()}&tx=${signature}`)
      
    } catch (error) {
      console.error("Error creating contract:", error)
      
      // Create a detailed error message
      let detailedError = "Unknown error occurred";
      
      if (error instanceof Error) {
        detailedError = error.message;
      } else if (typeof error === 'string') {
        detailedError = error;
      } else {
        try {
          detailedError = JSON.stringify(error);
        } catch (e) {
          detailedError = "Error cannot be stringified";
        }
      }
      
      setErrorMessage(`Error creating contract: ${detailedError}`);
    } finally {
      setLoading(false)
    }
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

      {errorMessage && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <h4 className="font-medium mb-1">Error</h4>
          <p className="text-sm whitespace-pre-wrap">{errorMessage}</p>
        </div>
      )}

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
                <Input 
                  id="title" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción detallada</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe detalladamente lo que necesitas..." 
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <p className="text-xs text-gray-500">Sé específico sobre tus requisitos, plazos y expectativas.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Fecha límite</Label>
                <Input 
                  id="deadline" 
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
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
