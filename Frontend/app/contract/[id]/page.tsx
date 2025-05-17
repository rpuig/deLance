"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, CheckCircle, Clock, FileText, MessageSquare, Send, Star } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useWallet } from "@/components/wallet-provider"
// Import necessary Solana web3.js libraries
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

export default function ContractDetail() {
  const params = useParams()
  const router = useRouter()
  const contractId = params.id
  const [message, setMessage] = useState("")
  const [showRating, setShowRating] = useState(false)
  const [rating, setRating] = useState(0)
  const wallet = useWallet()  // Get the wallet object
  const [isProcessing, setIsProcessing] = useState(false)
  const [transactionStatus, setTransactionStatus] = useState("")
  const [walletInfo, setWalletInfo] = useState({
    yourWallet: "Not connected",
    yourBalance: 0,
    freelancerWallet: "8Xo95kP4KoqDP7GByLgZssBf58kxMy5ndSw9LzieHMjm",
    role: "client" // You are the client in this scenario
  }) 
  const [transactionComplete, setTransactionComplete] = useState(false)
  const [transactionSignature, setTransactionSignature] = useState("")

  // Expose wallet to window for debugging - ONLY on client side
  useEffect(() => {
    // This code only runs in the browser, after component mount
    // @ts-ignore
    window._wallet = wallet;
    console.log("Wallet exposed as window._wallet");
  }, [wallet]);

  // Get your wallet address and balance
  useEffect(() => {
    const getWalletInfo = async () => {
      if (wallet && wallet.connected && wallet.address) {
        try {
          // Get your wallet address
          const yourWalletAddress = wallet.address;
          
          // Get your wallet balance (already available in wallet.balance)
          const balanceInSOL = parseFloat(wallet.balance || "0");
          
          setWalletInfo(prev => ({
            ...prev,
            yourWallet: yourWalletAddress,
            yourBalance: balanceInSOL
          }));
          
          console.log("Your wallet:", yourWalletAddress);
          console.log("Your balance:", balanceInSOL, "SOL");
        } catch (error) {
          console.error("Error getting wallet info:", error);
        }
      }
    };
    
    getWalletInfo();
  }, [wallet]);

  // Redirigir si no está conectado
  useEffect(() => {
    if (!wallet || !wallet.connected) {
      router.push("/connect")
    }
  }, [wallet, router])

  // Redirect after transaction is complete (with a delay for user to see the success message)
  useEffect(() => {
    if (transactionComplete && transactionSignature) {
      const timer = setTimeout(() => {
        // Redirect to dashboard or success page
        router.push("/client/dashboard");
      }, 3000); // 3 second delay
      
      return () => clearTimeout(timer);
    }
  }, [transactionComplete, transactionSignature, router]);

  // Datos de ejemplo - en una implementación real, estos datos vendrían de la blockchain o una API
  const contract = {
    id: contractId,
    title: "Diseño de Logo para Startup",
    description:
      "Diseño de logo profesional para una startup de tecnología, incluyendo 3 propuestas y 2 rondas de revisiones.",
    freelancer: "Freelancer A",
    freelancerWallet: walletInfo.freelancerWallet, // Freelancer's wallet address
    client: "Cliente B (Tú)",
    price: "0.01 SOL", // Reduced for testing
    priceInLamports: 0.01 * LAMPORTS_PER_SOL, // 0.01 SOL in lamports for testing
    status: "En progreso", // En progreso, Entregado, Validado, Completado
    createdAt: "01/06/2025",
    dueDate: "15/06/2025",
    progress: 60,
    messages: [
      {
        id: 1,
        sender: "Cliente B (Tú)",
        content: "Hola, necesito un logo minimalista y moderno.",
        timestamp: "01/06/2025 10:30",
      },
      {
        id: 2,
        sender: "Freelancer A",
        content: "Perfecto, trabajaré en algunas propuestas. ¿Tienes alguna preferencia de color?",
        timestamp: "01/06/2025 11:15",
      },
      {
        id: 3,
        sender: "Cliente B (Tú)",
        content: "Me gustaría usar tonos azules y verdes, representan bien nuestra marca.",
        timestamp: "01/06/2025 12:00",
      },
    ],
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      // En una implementación real, aquí enviaríamos el mensaje a la blockchain o API
      setMessage("")
    }
  }

  const handleDeliverWork = async () => {
    console.log("Starting handleDeliverWork function");
    
    if (!wallet || !wallet.connected) {
      alert("Por favor, conecta tu wallet para realizar esta acción.");
      return;
    }
    
    if (!wallet.address) {
      alert("No se pudo obtener la dirección de tu wallet.");
      console.error("Address not found in wallet object:", wallet);
      return;
    }
    
    setIsProcessing(true);
    setTransactionStatus("Preparando transacción...");

    try {
      // Connect to Solana devnet for testing
      const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
      console.log("Connected to Solana devnet");
      
      // Your wallet (client) - this is the wallet connected to Solflare
      const clientWallet = new PublicKey(wallet.address);
      console.log("Client wallet (YOU):", clientWallet.toString());
      
      // Freelancer's wallet address (hardcoded for testing)
      const freelancerWallet = new PublicKey(contract.freelancerWallet);
      console.log("Freelancer wallet:", freelancerWallet.toString());
      
      // Check balance before transaction
      const balance = parseFloat(wallet.balance || "0") * LAMPORTS_PER_SOL;
      console.log("Your wallet balance:", balance / LAMPORTS_PER_SOL, "SOL");
      
      if (balance < contract.priceInLamports) {
        throw new Error(`Saldo insuficiente. Necesitas al menos ${contract.priceInLamports / LAMPORTS_PER_SOL} SOL.`);
      }
      
      // Create a transaction to transfer SOL from client (you) to freelancer
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: clientWallet,  // Your wallet (client)
          toPubkey: freelancerWallet, // Freelancer's wallet
          lamports: contract.priceInLamports,
        })
      );
      
      console.log("Transaction created: Sending", contract.priceInLamports / LAMPORTS_PER_SOL, "SOL from", 
                  clientWallet.toString(), "to", freelancerWallet.toString());
      
      // Set recent blockhash and fee payer
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = clientWallet;
      
      setTransactionStatus("Esperando firma del usuario (tú)...");
      
      // Sign the transaction using your wallet (client)
      console.log("Requesting signature from your wallet...");
      const signedTransaction = await wallet.signTransaction(transaction);
      console.log("Transaction signed by client");
      
      setTransactionStatus("Enviando transacción a la blockchain...");
      
      // Send the transaction
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      console.log("Transaction sent with signature:", signature);
      
      // Store the transaction signature for the redirect
      setTransactionSignature(signature);
      
      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');
      console.log("Transaction confirmation:", confirmation);
      
      if (confirmation.value && confirmation.value.err) {
        throw new Error(`Error en la confirmación: ${JSON.stringify(confirmation.value.err)}`);
      }
      
      setTransactionStatus("¡Transacción completada! Fondos enviados al freelancer.");
      
      // Update wallet balance after transaction (in a real app, you'd refresh the balance)
      setWalletInfo(prev => ({
        ...prev,
        yourBalance: parseFloat(wallet.balance || "0") - (contract.priceInLamports / LAMPORTS_PER_SOL)
      }));
      
      // Mark transaction as complete to trigger redirect
      setTransactionComplete(true);
      
      // Show success message before redirect
      alert("¡Trabajo marcado como entregado y fondos enviados al freelancer! Serás redirigido en unos segundos.");
      
    } catch (error) {
      console.error("Error al procesar la transacción:", error);
      setTransactionStatus(`Error: ${error.message}`);
      alert(`Error al liberar los fondos: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  }

  const handleValidateWork = () => {
    // En una implementación real, aquí validaríamos el trabajo en la blockchain
    setShowRating(true)
  }

  const handleSubmitRating = () => {
    // En una implementación real, aquí enviaríamos la valoración a la blockchain
    alert("¡Trabajo validado y pago liberado! Gracias por tu valoración.")
    // Redirect to dashboard after rating
    router.push("/client/dashboard");
  }

  // Check if wallet is connected before rendering
  if (!wallet || !wallet.connected) {
    return (
      <div className="container py-8 px-4">
        <div className="text-center">
          <p>Por favor, conecta tu wallet para ver los detalles del contrato.</p>
          <Button 
            className="mt-4 bg-solana-purple hover:bg-solana-purple/90"
            onClick={() => router.push("/connect")}
          >
            Conectar Wallet
          </Button>
        </div>
      </div>
    )
  }

  // If transaction is complete, show a success message while redirecting
  if (transactionComplete) {
    return (
      <div className="container py-8 px-4">
        <div className="text-center">
          <div className="mb-4 text-green-500">
            <CheckCircle className="h-16 w-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold mb-2">¡Transacción Completada!</h2>
          <p className="mb-4">Los fondos han sido enviados al freelancer correctamente.</p>
          <p className="text-sm text-gray-500 mb-6">Serás redirigido en unos segundos...</p>
          <div className="text-xs text-gray-400 break-all mb-4">
            Firma de transacción: {transactionSignature}
          </div>
          <Button 
            className="bg-solana-purple hover:bg-solana-purple/90"
            onClick={() => router.push("/client/dashboard")}
          >
            Ir al Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4">
      {/* Wallet information panel */}
      <div className="mb-4 p-4 bg-gray-50 border rounded-lg">
        <h3 className="text-lg font-medium mb-2">Información de Wallets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-blue-50 rounded-md">
            <p className="font-medium">Tu Wallet (Cliente):</p>
            <p className="text-xs break-all">{walletInfo.yourWallet}</p>
            <p className="mt-1">Balance: {walletInfo.yourBalance.toFixed(4)} SOL</p>
          </div>
          <div className="p-3 bg-green-50 rounded-md">
            <p className="font-medium">Wallet del Freelancer:</p>
            <p className="text-xs break-all">{walletInfo.freelancerWallet}</p>
            <p className="mt-1 text-sm text-gray-500">
              (El pago se enviará a esta dirección)
            </p>
          </div>
        </div>
        <div className="mt-3 text-sm text-gray-500">
          <p>
            <strong>Nota:</strong> Al marcar el trabajo como entregado, se transferirán {contract.price} desde tu wallet 
            a la wallet del freelancer.
          </p>
        </div>
      </div>
      
      <div className="mb-4">
        <Button
          variant="ghost"
          className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <h1 className="text-2xl font-bold">{contract.title}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <div>
                  <CardDescription>
                    Contrato #{contract.id} • Creado el {contract.createdAt}
                  </CardDescription>
                </div>
                <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium w-fit">
                  {contract.status}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2 flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Descripción del proyecto
                </h3>
                <p className="text-gray-600">{contract.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Freelancer</p>
                  <p className="font-medium">{contract.freelancer}</p>
                </div>
                <div>
                  <p className="text-gray-500">Cliente</p>
                  <p className="font-medium">{contract.client}</p>
                </div>
                <div>
                  <p className="text-gray-500">Precio</p>
                  <p className="font-medium">{contract.price}</p>
                </div>
                <div>
                  <p className="text-gray-500">Fecha límite</p>
                  <p className="font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-yellow-600" />
                    {contract.dueDate}
                  </p>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Progreso
                  </h3>
                  <span>{contract.progress}%</span>
                </div>
                <Progress value={contract.progress} className="h-2" />
              </div>

              {isProcessing && (
                <div className="border rounded-lg p-4 bg-blue-50">
                  <h3 className="font-medium mb-2">Procesando transacción</h3>
                  <Progress value={transactionStatus.includes("Error") ? 100 : 70} className="h-2 mb-2" />
                  <p className={`text-sm ${transactionStatus.includes("Error") ? "text-red-500" : "text-blue-600"}`}>
                    {transactionStatus}
                  </p>
                </div>
              )}

              {showRating ? (
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-4">Valora el trabajo recibido</h3>
                  <div className="flex items-center justify-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-8 w-8 cursor-pointer ${
                          star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                        onClick={() => setRating(star)}
                      />
                    ))}
                  </div>
                  <Textarea placeholder="Deja un comentario sobre tu experiencia (opcional)..." className="mb-4" />
                  <Button
                    className="w-full bg-solana-purple hover:bg-solana-purple/90"
                    onClick={handleSubmitRating}
                    disabled={rating === 0}
                  >
                    Enviar valoración y liberar pago
                  </Button>
                </div>
              ) : (
                <div className="flex justify-end">
                  {contract.status === "En progreso" && (
                    <Button 
                      className="bg-solana-purple hover:bg-solana-purple/90" 
                      onClick={handleDeliverWork}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Procesando..." : "Marcar como entregado y liberar fondos"}
                    </Button>
                  )}

                  {contract.status === "Entregado" && (
                    <Button className="bg-solana-purple hover:bg-solana-purple/90" onClick={handleValidateWork}>
                      Validar entrega y liberar pago
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Mensajes
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-auto">
              <div className="space-y-4">
                {contract.messages.map((msg) => (
                  <div key={msg.id}  className="flex flex-col">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{msg.sender}</span>
                      <span className="text-xs text-gray-500">{msg.timestamp}</span>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">{msg.content}</div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="flex w-full items-center space-x-2">
                <Textarea
                  placeholder="Escribe un mensaje..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-grow"
                />
                <Button
                  size="icon"
                  className="bg-solana-purple hover:bg-solana-purple/90"
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Enviar mensaje</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
