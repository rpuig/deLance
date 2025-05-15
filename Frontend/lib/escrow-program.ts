import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Keypair,
} from '@solana/web3.js';

// This is a placeholder program ID for testing
// Replace with your actual program ID when you have it
const ESCROW_PROGRAM_ID = new PublicKey('11111111111111111111111111111111');

export class EscrowProgramClient {
  connection: Connection;
  programId: PublicKey;

  constructor(connection: Connection, programId: PublicKey = ESCROW_PROGRAM_ID) {
    this.connection = connection;
    this.programId = programId;
    console.log("EscrowProgramClient initialized with program ID:", programId.toString());
  }

  async createEscrow(
    payer: PublicKey,
    amount: number,
    signTransaction: (transaction: Transaction) => Promise<Transaction>
  ) {
    console.log("Creating escrow with amount:", amount, "SOL");
    
    // Create a new keypair for the escrow account
    const escrowAccount = Keypair.generate();
    console.log("Generated escrow account:", escrowAccount.publicKey.toString());
    
    // Calculate space needed for the escrow account data
    // This should match your Rust struct size
    const space = 1 + 32 + 8; // is_initialized (1) + pubkey (32) + amount (8)
    
    // Calculate rent exemption amount
    const rentExemptBalance = await this.connection.getMinimumBalanceForRentExemption(space);
    console.log("Rent exempt balance:", rentExemptBalance / LAMPORTS_PER_SOL, "SOL");
    
    // Create transaction
    const transaction = new Transaction();
    
    // Add instruction to create account
    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: payer,
        newAccountPubkey: escrowAccount.publicKey,
        lamports: rentExemptBalance,
        space,
        programId: this.programId,
      })
    );
    
    // Add instruction to initialize the escrow
    // This should match your program's instruction format
    const amountInLamports = Math.floor(amount * LAMPORTS_PER_SOL);
    const data = Buffer.alloc(9); // 1 byte for instruction index + 8 bytes for amount
    data.writeUInt8(0, 0); // Instruction index 0 for initialize
    data.writeBigUInt64LE(BigInt(amountInLamports), 1); // Amount in lamports
    
    transaction.add(
      new TransactionInstruction({
        keys: [
          { pubkey: escrowAccount.publicKey, isSigner: false, isWritable: true },
          { pubkey: payer, isSigner: true, isWritable: false },
        ],
        programId: this.programId,
        data,
      })
    );
    
    // Get recent blockhash
    const { blockhash } = await this.connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = payer;
    
    // Sign with the escrow account
    transaction.partialSign(escrowAccount);
    
    try {
      // Sign with the payer (via wallet)
      console.log("Requesting wallet signature...");
      const signedTx = await signTransaction(transaction);
      
      // Send transaction
      console.log("Sending transaction...");
      const signature = await this.connection.sendRawTransaction(signedTx.serialize());
      console.log("Transaction sent, signature:", signature);
      
      // Confirm transaction
      console.log("Confirming transaction...");
      await this.connection.confirmTransaction(signature);
      console.log("Transaction confirmed!");
      
      return {
        escrowAccount: escrowAccount.publicKey,
        signature,
      };
    } catch (error) {
      console.error("Error in createEscrow:", error);
      throw error;
    }
  }

  async fundEscrow(
    payer: PublicKey,
    escrowAccount: PublicKey,
    amount: number,
    signTransaction: (transaction: Transaction) => Promise<Transaction>
  ) {
    console.log("Funding escrow with amount:", amount, "SOL");
    
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
    
    try {
      // Sign with the payer (via wallet)
      console.log("Requesting wallet signature...");
      const signedTx = await signTransaction(transaction);
      
      // Send transaction
      console.log("Sending transaction...");
      const signature = await this.connection.sendRawTransaction(signedTx.serialize());
      console.log("Transaction sent, signature:", signature);
      
      // Confirm transaction
      console.log("Confirming transaction...");
      await this.connection.confirmTransaction(signature);
      console.log("Transaction confirmed!");
      
      return signature;
    } catch (error) {
      console.error("Error in fundEscrow:", error);
      throw error;
    }
  }

  async releaseFunds(
    payer: PublicKey,
    escrowAccount: PublicKey,
    recipient: PublicKey,
    signTransaction: (transaction: Transaction) => Promise<Transaction>
  ) {
    console.log("Releasing funds from escrow to recipient:", recipient.toString());
    
    // Create transaction
    const transaction = new Transaction();
    
    // Add instruction to release funds
    const data = Buffer.from([1]); // Instruction index 1 for release funds
    
    transaction.add(
      new TransactionInstruction({
        keys: [
          { pubkey: escrowAccount, isSigner: false, isWritable: true },
          { pubkey: recipient, isSigner: false, isWritable: true },
          { pubkey: payer, isSigner: true, isWritable: false },
        ],
        programId: this.programId,
        data,
      })
    );
    
    // Get recent blockhash
    const { blockhash } = await this.connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = payer;
    
    try {
      // Sign with the payer (via wallet)
      console.log("Requesting wallet signature...");
      const signedTx = await signTransaction(transaction);
      
      // Send transaction
      console.log("Sending transaction...");
      const signature = await this.connection.sendRawTransaction(signedTx.serialize());
      console.log("Transaction sent, signature:", signature);
      
      // Confirm transaction
      console.log("Confirming transaction...");
      await this.connection.confirmTransaction(signature);
      console.log("Transaction confirmed!");
      
      return signature;
    } catch (error) {
      console.error("Error in releaseFunds:", error);
      throw error;
    }
  }

  async getEscrowData(escrowAccount: PublicKey) {
    try {
      const accountInfo = await this.connection.getAccountInfo(escrowAccount);
      
      if (!accountInfo) {
        console.log("Escrow account not found");
        return null;
      }
      
      console.log("Escrow account data:", accountInfo.data);
      
      // For now, just return a simple representation
      // In a real implementation, you would deserialize the data according to your program's format
      return {
        accountExists: true,
        owner: accountInfo.owner.toString(),
        lamports: accountInfo.lamports,
        dataLength: accountInfo.data.length,
        executable: accountInfo.executable,
      };
    } catch (error) {
      console.error("Error in getEscrowData:", error);
      throw error;
    }
  }
}