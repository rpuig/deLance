import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { Buffer } from 'buffer';

const CreateContractButton = ({ amount, freelancerPubkey, serviceName }) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Replace with your deployed program ID
  const programId = new PublicKey('YOUR_ESCROW_PROGRAM_ID');

  const handleCreateContract = async () => {
    if (!publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    try {
      // Create an account to store the escrow data
      const escrowAccount = new Uint8Array(32);
      window.crypto.getRandomValues(escrowAccount);
      const escrowPubkey = new PublicKey(escrowAccount);

      // Calculate the rent exemption amount
      const rentExemptionAmount = await connection.getMinimumBalanceForRentExemption(100); // Adjust size as needed

      // Create transaction
      const transaction = new Transaction().add(
        // Create the escrow account
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: escrowPubkey,
          lamports: rentExemptionAmount,
          space: 100, // Adjust based on your Escrow struct size
          programId: programId,
        }),
        // Transfer SOL to the escrow
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: escrowPubkey,
          lamports: amount * 1_000_000_000, // Convert SOL to lamports
        })
      );

      // Send the transaction
      const signature = await sendTransaction(transaction, connection);
      
      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed');
      
      // Generate a reference number for the contract
      const contractRef = `CONTRACT-${Date.now().toString(36).toUpperCase()}`;
      
      // Redirect to the contract page with the reference
      router.push(`/contracts/${contractRef}?escrow=${escrowPubkey.toString()}`);
      
    } catch (error) {
      console.error('Error creating contract:', error);
      alert(`Failed to create contract: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCreateContract}
      disabled={isLoading || !publicKey}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
    >
      {isLoading ? 'Processing...' : 'Create Contract & Lock Funds'}
    </button>
  );
};

export default CreateContractButton;