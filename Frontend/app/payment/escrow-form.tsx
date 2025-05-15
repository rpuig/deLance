"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
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
      // Create the escrow
      const escrowId = await createEscrow(freelancerAddress, amount)
      
      if (!escrowId) {
        toast({
          title: "Error creating escrow",
          description: error || "Failed to create escrow",
          variant: "destructive"
        })
        return
      }
      
      // Fund the escrow
      const signature = await fundEscrow(escrowId, amount)
      
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
        description: "Your funds have been placed in escrow",
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
              <div className="mt-1 font-bold text-lg">{amount} SOL</div>
            </div>
            <div>
              <label className="text-sm font-medium">Recipient</label>
              <div className="mt-1 text-sm truncate">{freelancerAddress}</div>
            </div>
          </div>
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
