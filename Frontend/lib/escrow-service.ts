import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  LAMPORTS_PER_SOL,
  TransactionInstruction,
  Keypair,
  sendAndConfirmTransaction
} from '@solana/web3.js';

// This would be your deployed escrow program ID
const ESCROW_PROGRAM_ID = new PublicKey('YOUR_ESCROW_PROGRAM_ID_HERE');

export interface EscrowAccount {
  id: string;
  clientAddress: string;
  freelancerAddress: string;
  amount: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  createdAt: number;
  completedAt?: number;
}

export class EscrowService {
  private connection: Connection;
  
  constructor(endpoint = 'https://api.devnet.solana.com') {
    this.connection = new Connection(endpoint, 'confirmed');
  }
  
  // Create a new escrow account
  async createEscrow(
    clientPublicKey: PublicKey,
    freelancerPublicKey: PublicKey,
    amount: number
  ): Promise<string> {
    try {
      // For now, we'll simulate the escrow creation
      // In a real implementation, you would call your deployed Solana program
      
      const escrowId = Math.random().toString(36).substring(2, 15);
      
      // Store escrow details in localStorage for demo purposes
      // In production, this would be stored on-chain
      const escrow: EscrowAccount = {
        id: escrowId,
        clientAddress: clientPublicKey.toString(),
        freelancerAddress: freelancerPublicKey.toString(),
        amount,
        status: 'pending',
        createdAt: Date.now(),
      };
      
      // Save to localStorage
      const escrows = this.getEscrows();
      escrows.push(escrow);
      localStorage.setItem('escrows', JSON.stringify(escrows));
      
      return escrowId;
    } catch (error) {
      console.error('Error creating escrow:', error);
      throw error;
    }
  }
  
  // Fund an escrow account
  async fundEscrow(
    escrowId: string,
    clientPublicKey: PublicKey,
    amount: number,
    signTransaction: (transaction: Transaction) => Promise<Transaction>
  ): Promise<string> {
    try {
      // Get the escrow account
      const escrows = this.getEscrows();
      const escrowIndex = escrows.findIndex(e => e.id === escrowId);
      
      if (escrowIndex === -1) {
        throw new Error('Escrow not found');
      }
      
      // Create a transaction to transfer SOL to the escrow account
      // In a real implementation, this would transfer to a PDA owned by your program
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: clientPublicKey,
          toPubkey: new PublicKey(escrows[escrowIndex].freelancerAddress),
          lamports: amount * LAMPORTS_PER_SOL
        })
      );
      
      // Get the latest blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = clientPublicKey;
      
      // Sign and send the transaction
      const signedTx = await signTransaction(transaction);
      const signature = await this.connection.sendRawTransaction(signedTx.serialize());
      await this.connection.confirmTransaction(signature);
      
      // Update escrow status
      escrows[escrowIndex].status = 'active';
      localStorage.setItem('escrows', JSON.stringify(escrows));
      
      return signature;
    } catch (error) {
      console.error('Error funding escrow:', error);
      throw error;
    }
  }
  
  // Release funds to the freelancer
  async releaseEscrow(
    escrowId: string,
    clientPublicKey: PublicKey,
    signTransaction: (transaction: Transaction) => Promise<Transaction>
  ): Promise<string> {
    try {
      // Get the escrow account
      const escrows = this.getEscrows();
      const escrowIndex = escrows.findIndex(e => e.id === escrowId);
      
      if (escrowIndex === -1) {
        throw new Error('Escrow not found');
      }
      
      if (escrows[escrowIndex].status !== 'active') {
        throw new Error('Escrow is not active');
      }
      
      if (escrows[escrowIndex].clientAddress !== clientPublicKey.toString()) {
        throw new Error('Only the client can release funds');
      }
      
      // In a real implementation, you would call your escrow program to release funds
      // For now, we'll just update the status
      escrows[escrowIndex].status = 'completed';
      escrows[escrowIndex].completedAt = Date.now();
      localStorage.setItem('escrows', JSON.stringify(escrows));
      
      return 'simulated-signature';
    } catch (error) {
      console.error('Error releasing escrow:', error);
      throw error;
    }
  }
  
  // Cancel an escrow and return funds to the client
  async cancelEscrow(
    escrowId: string,
    clientPublicKey: PublicKey,
    signTransaction: (transaction: Transaction) => Promise<Transaction>
  ): Promise<string> {
    try {
      // Get the escrow account
      const escrows = this.getEscrows();
      const escrowIndex = escrows.findIndex(e => e.id === escrowId);
      
      if (escrowIndex === -1) {
        throw new Error('Escrow not found');
      }
      
      if (escrows[escrowIndex].status !== 'active') {
        throw new Error('Escrow is not active');
      }
      
      if (escrows[escrowIndex].clientAddress !== clientPublicKey.toString()) {
        throw new Error('Only the client can cancel the escrow');
      }
      
      // In a real implementation, you would call your escrow program to cancel
      // For now, we'll just update the status
      escrows[escrowIndex].status = 'cancelled';
      localStorage.setItem('escrows', JSON.stringify(escrows));
      
      return 'simulated-signature';
    } catch (error) {
      console.error('Error cancelling escrow:', error);
      throw error;
    }
  }
  
  // Get all escrows for a user (client or freelancer)
  getEscrowsByUser(userAddress: string): EscrowAccount[] {
    const escrows = this.getEscrows();
    return escrows.filter(
      e => e.clientAddress === userAddress || e.freelancerAddress === userAddress
    );
  }
  
  // Get a specific escrow by ID
  getEscrowById(escrowId: string): EscrowAccount | null {
    const escrows = this.getEscrows();
    return escrows.find(e => e.id === escrowId) || null;
  }
  
  // Helper to get all escrows from localStorage
  private getEscrows(): EscrowAccount[] {
    const escrowsJson = localStorage.getItem('escrows');
    return escrowsJson ? JSON.parse(escrowsJson) : [];
  }
}

// Create a singleton instance
export const escrowService = new EscrowService();