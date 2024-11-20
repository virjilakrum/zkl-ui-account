'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import { FileShareProgram } from '@/lib/program/file-share';

export function useSolanaProgram() {
  const { connection } = useConnection();
  const wallet = useWallet();

  return useQuery({
    queryKey: ['solana-program', wallet.publicKey?.toBase58()],
    queryFn: async () => {
      if (!wallet.publicKey || !wallet.signTransaction) {
        throw new Error('Wallet not connected');
      }
      return FileShareProgram.init(connection, wallet);
    },
    enabled: !!wallet.publicKey && !!wallet.signTransaction,
  });
}