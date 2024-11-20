{`'use client';

import { useMutation } from '@tanstack/react-query';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { uploadToIPFS } from '@/lib/ipfs';
import { FileShareProgram } from '@/lib/program/file-share';
import axios from 'axios';

export function useFileUpload(accountId: string) {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const wallet = useWallet();

  return useMutation({
    mutationFn: async ({
      file,
      recipientId,
    }: {
      file: File;
      recipientId: string;
    }) => {
      if (!publicKey || !wallet.signTransaction) {
        throw new Error('Wallet not connected');
      }

      // Upload to IPFS
      const ipfsHash = await uploadToIPFS(file);

      // Initialize program and create transaction
      const program = await FileShareProgram.init(connection, wallet);
      const transactionSignature = await program.createFileShare(
        ipfsHash,
        recipientId
      );

      // Save to database
      const response = await axios.post('/api/files/upload', {
        senderId: accountId,
        recipientId,
        ipfsHash,
        transactionSignature,
      });

      return response.data;
    },
  });
}`}