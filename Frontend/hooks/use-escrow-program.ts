import { useState } from 'react'
import { PublicKey, Transaction } from '@solana/web3.js'
import { useWallet } from '@/components/wallet-provider'

export function useEscrowProgram() {
  const { connected, address, escrowClient } = useWallet()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Create a new escrow
  async function createEscrow(amount: number) {
    console.log("createEscrow called with amount:", amount)
    
    if (!connected || !address) {
      setError('Wallet not connected or address not available')
      return null
    }
    
    if (!escrowClient) {
      setError('Escrow client not initialized')
      return null
    }
    
    setLoading(true)
    setError(null)
    
    try {
      // Create a PublicKey from the address string
      const publicKey = new PublicKey(address)
      console.log("Using publicKey:", publicKey.toString())
      
      const result = await escrowClient.createEscrow(
        publicKey,
        amount,
        async (transaction: Transaction) => {
          if (!window.solflare || !window.solflare.signTransaction) {
            throw new Error('Solflare wallet not available for signing')
          }
          
          console.log("Signing transaction")
          const signed = await window.solflare.signTransaction(transaction)
          console.log("Transaction signed successfully")
          return signed
        }
      )
      
      console.log("Escrow created successfully:", result)
      return result
    } catch (err) {
      console.error("Error creating escrow:", err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    } finally {
      setLoading(false)
    }
  }
  
  // Fund an escrow
  async function fundEscrow(escrowAccount: string, amount: number) {
    if (!connected || !address || !window.solflare || !escrowClient) {
      setError('Wallet not connected or escrow client not initialized')
      return null
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const escrowPubkey = new PublicKey(escrowAccount)
      
      const signature = await escrowClient.fundEscrow(
        window.solflare.publicKey,
        escrowPubkey,
        amount,
        async (transaction: Transaction) => {
          return await window.solflare.signTransaction(transaction)
        }
      )
      
      return signature
    } catch (err) {
      console.error('Error funding escrow:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    } finally {
      setLoading(false)
    }
  }
  
  // Release funds from escrow
  async function releaseFunds(escrowAccount: string, recipientAddress: string) {
    if (!connected || !address || !window.solflare || !escrowClient) {
      setError('Wallet not connected or escrow client not initialized')
      return null
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const escrowPubkey = new PublicKey(escrowAccount)
      const recipientPubkey = new PublicKey(recipientAddress)
      
      const signature = await escrowClient.releaseFunds(
        window.solflare.publicKey,
        escrowPubkey,
        recipientPubkey,
        async (transaction: Transaction) => {
          return await window.solflare.signTransaction(transaction)
        }
      )
      
      return signature
    } catch (err) {
      console.error('Error releasing funds:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    } finally {
      setLoading(false)
    }
  }
  
  // Get escrow data
  async function getEscrowData(escrowAccount: string) {
    if (!escrowClient) {
      setError('Escrow client not initialized')
      return null
    }
    
    try {
      const escrowPubkey = new PublicKey(escrowAccount)
      return await escrowClient.getEscrowData(escrowPubkey)
    } catch (err) {
      console.error('Error getting escrow data:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    }
  }
  
  return {
    createEscrow,
    fundEscrow,
    releaseFunds,
    getEscrowData,
    loading,
    error,
  }
}