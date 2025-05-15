import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  LAMPORTS_PER_SOL,
  Keypair,
} from '@solana/web3.js';
import * as borsh from 'borsh';

// Replace with your deployed program ID from the deployment step
const ESCROW_PROGRAM_ID = new PublicKey('YOUR_DEPLOYED_PROGRAM_ID');

// Define the escrow data structure (matching your Rust struct)
class Escrow {
  is_initialized: boolean;
  initializer_pubkey: Uint8Array;
  amount: bigint;

  constructor(fields: { is_initialized: boolean; initializer_pubkey: Uint8Array; amount: bigint }) {
    this.is_initialized = fields.is_initialized;
    this.initializer_pubkey = fields.initializer_pubkey;
    this.amount = fields.amount;
  }
}

// Define the schema for Borsh serialization/deserialization
const EscrowSchema = new Map([
  [
    Escrow,
    {
      kind: 'struct',
      fields: [
        ['is_initialized', 'u8'], // boolean as u8
        ['initializer_pubkey', [32]], // Pubkey as 32 bytes
        ['amount', 'u64'], // u64 for amount
      ],
    },
  ],
]);

export class EscrowProgramClient {
  connection: Connection;
  programId: PublicKey;

  constructor(connection: Connection, programId: PublicKey = ESCROW_PROGRAM_ID) {
    this.connection = connection;
    this.programId = programId;
  }

  // Create a new escrow
  async createEscrow(
    payer: PublicKey,
    amount: number,
    signTransaction: (transaction: Transaction) => Promise<Transaction>
  ): Promise<{ escrowAccount: PublicKey; signature: string }> {
    // Create a new account for the escrow
    const escrowAccount = Keypair.generate();
    
    // Calculate the rent-exempt balance
    const space = 1 + 32 + 8; // is_initialized (1) + pubkey (32) + amount (8)
    const rentExemptBalance = await this.connection.getMinimumBalanceForRentExemption(space);

    // Create transaction to create account
    const transaction = new Transaction();
    
    // Add instruction to create account
    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: payer,
        newAccountPubkey: escrowAccount.publicKey,
        lamports: rentExemptBalance,
        space: space,
        programId: this.programId,
      })
    );
    
    // Get recent blockhash
    const { blockhash } = await this.connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = payer;
    
    // Partially sign with the escrow account
    transaction.partialSign(escrowAccount);
    
    // Sign with the payer (via wallet)
    const signedTx = await signTransaction(transaction);
    
    // Send and confirm transaction
    const signature = await this.connection.sendRawTransaction(signedTx.serialize());
    await this.connection.confirmTransaction(signature);
    
    return {
      escrowAccount: escrowAccount.publicKey,
      signature,
    };
  }
  
  // Get escrow data
  async getEscrowData(escrowAccount: PublicKey): Promise<Escrow | null> {
    try {
      const accountInfo = await this.connection.getAccountInfo(escrowAccount);
      
      if (!accountInfo) {
        return null;
      }
      
      // Deserialize the account data
      const escrowData = borsh.deserialize(
        EscrowSchema,
        Escrow,
        accountInfo.data
      );
      
      return escrowData;
    } catch (error) {
      console.error('Error fetching escrow data:', error);
      return null;
    }
  }
  
  // Fund an escrow
  async fundEscrow(
    payer: PublicKey,
    escrowAccount: PublicKey,
    amount: number,
    signTransaction: (transaction: Transaction) => Promise<Transaction>
  ): Promise<string> {
    // Create transaction
    const transaction = new Transaction();
    
    // Add instruction to transfer SOL to escrow account
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: payer,
        toPubkey: escrowAccount,
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );
    
    // Get recent blockhash
    const { blockhash } = await this.connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = payer;
    
    // Sign with the payer (via wallet)
    const signedTx = await signTransaction(transaction);
    
    // Send and confirm transaction
    const signature = await this.connection.sendRawTransaction(signedTx.serialize());
    await this.connection.confirmTransaction(signature);
    
    return signature;
  }
  
  // Release funds from escrow to recipient
  async releaseFunds(
    payer: PublicKey,
    escrowAccount: PublicKey,
    recipient: PublicKey,
    signTransaction: (transaction: Transaction) => Promise<Transaction>
  ): Promise<string> {
    // Create transaction
    const transaction = new Transaction();
    
    // Add instruction to release funds
    transaction.add(
      new TransactionInstruction({
        keys: [
          { pubkey: escrowAccount, isSigner: false, isWritable: true },
          { pubkey: recipient, isSigner: false, isWritable: true },
          { pubkey: payer, isSigner: true, isWritable: false },
        ],
        programId: this.programId,
        data: Buffer.from([1]), // Instruction index for releasing funds
      })
    );
    
    // Get recent blockhash
    const { blockhash } = await this.connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = payer;
    
    // Sign with the payer (via wallet)
    const signedTx = await signTransaction(transaction);
    
    // Send and confirm transaction
    const signature = await this.connection.sendRawTransaction(signedTx.serialize());
    await this.connection.confirmTransaction(signature);
    
    return signature;
  }
}