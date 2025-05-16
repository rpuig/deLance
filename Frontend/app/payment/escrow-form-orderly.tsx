"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useWallet } from '@/components/wallet-provider'
import { useEscrow } from '@/hooks/use-escrow'
import { useToast } from '@/hooks/use-toast'

export function EscrowForm({ freelancerAddress, projectTitle, amount }: { 
  freelancerAddress: string;
  projectTitle: string;
  amount: number;
}) {
  const router = useRouter()
  const { toast } = useToast()
  const { connected, address } = useWallet()
  const { createEscrow, fundEscrow, loading, error } = useEscrow()
  const [isCreating, setIsCreating] = useState(false)
  const [paymentToken, setPaymentToken] = useState("SOL")
  const [availableTokens, setAvailableTokens] = useState(["SOL", "USDC", "USDT", "ETH"])
  const [freelancerPreferredToken, setFreelancerPreferredToken] = useState("")
  
  // Obtener la moneda preferida del freelancer cuando el componente se monta
  useEffect(() => {
    async function getFreelancerPreference() {
      try {
        // En un entorno real, esto sería una llamada a la API
        // Por ahora, simulamos que obtenemos la preferencia
        const response = await fetch(`/api/freelancer/preferences?address=${freelancerAddress}`);
        if (response.ok) {
          const data = await response.json();
          setFreelancerPreferredToken(data.preferredToken || "SOL");
        }
      } catch (error) {
        console.error("Error fetching freelancer preferences:", error);
        // Por defecto, asumimos SOL si hay un error
        setFreelancerPreferredToken("SOL");
      }
    }
    
    getFreelancerPreference();
  }, [freelancerAddress]);
  
  const handleCreateEscrow = async () => {
    if (!connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create an escrow",
        variant: "destructive"
      })
      return
    }
    
    setIsCreating(true)
    
    try {
      // Si la moneda de pago es diferente a la preferida por el freelancer,
      // realizamos un swap usando Orderly
      let finalAmount = amount;
      let finalToken = paymentToken;
      
      if (paymentToken !== freelancerPreferredToken) {
        // Llamar a nuestra API para realizar el swap
        const swapResponse = await fetch("/api/payment/swap", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fromToken: paymentToken,
            toToken: freelancerPreferredToken,
            amount: amount
          }),
        });
        
        if (!swapResponse.ok) {
          const errorData = await swapResponse.json();
          throw new Error(errorData.error || "Failed to swap tokens");
        }
        
        const swapResult = await swapResponse.json();
        finalAmount = swapResult.receivedAmount;
        finalToken = freelancerPreferredToken;
        
        toast({
          title: "Token swap successful",
          description: `Swapped ${amount} ${paymentToken} to ${finalAmount} ${finalToken}`,
        });
      }
      
      // Create the escrow with the swapped amount and token
      const escrowId = await createEscrow(freelancerAddress, finalAmount, finalToken);
      
      if (!escrowId) {
        toast({
          title: "Error creating escrow",
          description: error || "Failed to create escrow",
          variant: "destructive"
        })
        return
      }
      
      // Fund the escrow
      const signature = await fundEscrow(escrowId, finalAmount, finalToken);
      
      if (!signature) {
        toast({
          title: "Error funding escrow",
          description: error || "Failed to fund escrow",
          variant: "destructive"
        })
        return
      }
      
      toast({
        title: "Escrow created successfully",
        description: `Your funds (${finalAmount} ${finalToken}) have been placed in escrow`,
      })
      
      // Redirect to project page or confirmation page
      router.push(`/service/confirmation?escrowId=${escrowId}`)
    } catch (err) {
      console.error("Escrow creation error:", err)
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive"
      })
    } finally {
      setIsCreating(false)
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Escrow Payment</CardTitle>
        <CardDescription>
          Secure your payment for "{projectTitle}" with {freelancerAddress.slice(0, 6)}...{freelancerAddress.slice(-4)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Amount</label>
              <div className="mt-1 font-bold text-lg">{amount} {paymentToken}</div>
            </div>
            <div>
              <label className="text-sm font-medium">Recipient</label>
              <div className="mt-1 text-sm truncate">{freelancerAddress}</div>
            </div>
          </div>
          
          {/* Selector de moneda de pago */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Token</label>
            <Select value={paymentToken} onValueChange={setPaymentToken}>
              <SelectTrigger>
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                {availableTokens.map(token => (
                  <SelectItem key={token} value={token}>
                    {token}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Información sobre la moneda preferida del freelancer */}
          {freelancerPreferredToken && paymentToken !== freelancerPreferredToken && (
            <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded-md">
              Note: The freelancer prefers to receive payments in {freelancerPreferredToken}. 
              Your payment will be automatically converted from {paymentToken} to {freelancerPreferredToken}.
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleCreateEscrow} 
          disabled={isCreating || !connected}
          className="w-full"
        >
          {isCreating ? "Creating Escrow..." : "Create Escrow Payment"}
        </Button>
      </CardFooter>
    </Card>
  )
}