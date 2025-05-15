"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useWallet } from '@/components/wallet-provider'
import { useEscrowProgram } from '@/hooks/use-escrow-program'

export default function EscrowTest() {
  const { connected, connect, disconnect, address, escrowClient } = useWallet()
  const { createEscrow, loading, error } = useEscrowProgram()
  const [amount, setAmount] = useState(0.1)
  const [result, setResult] = useState('')
  const [solflareStatus, setSolflareStatus] = useState<string>('Checking...')
  
  // Check Solflare status
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const status = {
        exists: !!window.solflare,
        publicKey: window.solflare ? !!window.solflare.publicKey : false,
        publicKeyValue: window.solflare && window.solflare.publicKey ? 
          window.solflare.publicKey.toString() : 'none',
        signTransaction: window.solflare ? !!window.solflare.signTransaction : false
      }
      
      setSolflareStatus(JSON.stringify(status, null, 2))
      console.log("Solflare status:", status)
    }
  }, [connected])
  
  async function handleCreateEscrow() {
    try {
      console.log("Creating escrow with amount:", amount)
      
      // Check Solflare status before proceeding
      if (!window.solflare || !window.solflare.publicKey) {
        console.error("Solflare or publicKey not available")
        setResult("Error: Solflare or publicKey not available. Try reconnecting your wallet.")
        return
      }
      
      const res = await createEscrow(amount)
      console.log("Result from createEscrow:", res)
      
      if (res) {
        setResult(JSON.stringify(res, null, 2))
      }
    } catch (err) {
      console.error("Error in handleCreateEscrow:", err)
      setResult(`Error: ${err instanceof Error ? err.message : String(err)}`)
    }
  }
  
  async function handleReconnect() {
    try {
      // Disconnect first
      await disconnect()
      
      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Connect again
      await connect()
      
      // Check status
      if (window.solflare && window.solflare.publicKey) {
        console.log("Reconnected successfully, publicKey:", window.solflare.publicKey.toString())
      } else {
        console.error("Reconnection didn't provide publicKey")
      }
    } catch (err) {
      console.error("Error reconnecting:", err)
    }
  }
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Escrow Test</h1>
      
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <h2 className="font-bold mb-2">Wallet Status:</h2>
        <p>Connected: {connected ? "Yes ✅" : "No ❌"}</p>
        {address && <p>Address: {address}</p>}
        <p>Escrow Client: {escrowClient ? "Initialized ✅" : "Not Initialized ❌"}</p>
        
        <div className="mt-2 space-x-2">
          {!connected && (
            <Button onClick={connect}>
              Connect Wallet
            </Button>
          )}
          
          {connected && (
            <>
              <Button onClick={disconnect} variant="outline">
                Disconnect
              </Button>
              <Button onClick={handleReconnect}>
                Reconnect
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <h2 className="font-bold mb-2">Solflare Status:</h2>
        <pre className="whitespace-pre-wrap text-xs">{solflareStatus}</pre>
      </div>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 rounded">
          <h2 className="font-bold mb-2">Error:</h2>
          <p>{error}</p>
        </div>
      )}
      
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
          <pre className="whitespace-pre-wrap overflow-auto">{result}</pre>
          
          {result.includes("signature") && !result.includes("Error") && (
            <div className="mt-2">
              <a 
                href={`https://explorer.solana.com/tx/${JSON.parse(result).signature}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                View on Solana Explorer
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}