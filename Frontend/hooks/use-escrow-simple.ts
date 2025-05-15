import { useState } from 'react'

export function useEscrowSimple() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  async function createEscrow(amount: number) {
    setLoading(true)
    try {
      // Just a mock implementation for testing
      console.log(`Creating escrow with amount: ${amount} SOL`)
      return {
        escrowAccount: "mock-escrow-account",
        signature: "mock-signature"
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    } finally {
      setLoading(false)
    }
  }
  
  return {
    createEscrow,
    loading,
    error
  }
}