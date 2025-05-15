import { useState, useCallback } from 'react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { escrowService, EscrowAccount } from '@/lib/escrow-service';
import { useWallet } from '@/components/wallet-provider';

export function useEscrow() {
  const { connected, address } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Create a new escrow
  const createEscrow = useCallback(async (
    freelancerAddress: string,
    amount: number
  ) => {
    if (!connected || !address || !window.solflare) {
      setError('Wallet not connected');
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const clientPublicKey = window.solflare.publicKey;
      const freelancerPublicKey = new PublicKey(freelancerAddress);
      
      const escrowId = await escrowService.createEscrow(
        clientPublicKey,
        freelancerPublicKey,
        amount
      );
      
      return escrowId;
    } catch (err) {
      console.error('Error creating escrow:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  }, [connected, address]);
  
  // Fund an escrow
  const fundEscrow = useCallback(async (
    escrowId: string,
    amount: number
  ) => {
    if (!connected || !address || !window.solflare) {
      setError('Wallet not connected');
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const clientPublicKey = window.solflare.publicKey;
      
      const signature = await escrowService.fundEscrow(
        escrowId,
        clientPublicKey,
        amount,
        async (transaction: Transaction) => {
          return await window.solflare.signTransaction(transaction);
        }
      );
      
      return signature;
    } catch (err) {
      console.error('Error funding escrow:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  }, [connected, address]);
  
  // Release escrow funds
  const releaseEscrow = useCallback(async (escrowId: string) => {
    if (!connected || !address || !window.solflare) {
      setError('Wallet not connected');
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const clientPublicKey = window.solflare.publicKey;
      
      const signature = await escrowService.releaseEscrow(
        escrowId,
        clientPublicKey,
        async (transaction: Transaction) => {
          return await window.solflare.signTransaction(transaction);
        }
      );
      
      return signature;
    } catch (err) {
      console.error('Error releasing escrow:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  }, [connected, address]);
  
  // Cancel escrow
  const cancelEscrow = useCallback(async (escrowId: string) => {
    if (!connected || !address || !window.solflare) {
      setError('Wallet not connected');
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const clientPublicKey = window.solflare.publicKey;
      
      const signature = await escrowService.cancelEscrow(
        escrowId,
        clientPublicKey,
        async (transaction: Transaction) => {
          return await window.solflare.signTransaction(transaction);
        }
      );
      
      return signature;
    } catch (err) {
      console.error('Error cancelling escrow:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  }, [connected, address]);
  
  // Get user's escrows
  const getUserEscrows = useCallback(() => {
    if (!address) return [];
    return escrowService.getEscrowsByUser(address);
  }, [address]);
  
  // Get escrow by ID
  const getEscrowById = useCallback((escrowId: string) => {
    return escrowService.getEscrowById(escrowId);
  }, []);
  
  return {
    createEscrow,
    fundEscrow,
    releaseEscrow,
    cancelEscrow,
    getUserEscrows,
    getEscrowById,
    loading,
    error
  };
}