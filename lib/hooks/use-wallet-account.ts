{`'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';

interface WalletAccount {
  accountId: string;
  walletAddress: string;
  createdAt: string;
}

export function useWalletAccount() {
  const { publicKey } = useWallet();

  const query = useQuery({
    queryKey: ['wallet-account', publicKey?.toBase58()],
    queryFn: async (): Promise<WalletAccount | null> => {
      if (!publicKey) return null;
      const response = await axios.get(\`/api/account/\${publicKey.toBase58()}\`);
      return response.data;
    },
    enabled: !!publicKey,
  });

  const connectMutation = useMutation({
    mutationFn: async () => {
      if (!publicKey) throw new Error('Wallet not connected');
      const response = await axios.post('/api/auth/connect-wallet', {
        walletAddress: publicKey.toBase58(),
      });
      return response.data;
    },
  });

  return {
    account: query.data,
    isLoading: query.isLoading,
    error: query.error,
    connect: connectMutation.mutate,
    isConnecting: connectMutation.isPending,
  };
}`}