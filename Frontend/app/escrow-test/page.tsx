"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useWallet } from '@/components/wallet-provider'
import { useEscrowSimple } from '@/hooks/use-escrow-simple'

export default function EscrowTest() {
  const { connected } = useWallet()
  const { createEscrow, loading, error } = useEscrowSimple()
  const [amount, setAmount] = useState(0.1)
  const [result, setResult] = useState('')
  
  async function handleCreateEscrow() {
    const res = await createEscrow(amount)
    if (res) {
      setResult(JSON.stringify(res, null, 2))
    }
  }
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Escrow Test</h1>
      
      {!connected && <p className="text-red-500">Please connect your wallet</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      
      <div className="my-4">
        <label className="block mb-2">Amount (SOL)</label>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          className="mb-2"
        />
        <Button 
          onClick={handleCreateEscrow}
          disabled={loading || !connected}
        >
          Create Escrow
        </Button>
      </div>
      
      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h2 className="font-bold mb-2">Result:</h2>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  )
}