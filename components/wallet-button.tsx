'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWalletAccount } from '@/lib/hooks/use-wallet-account';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function WalletButton() {
  const { connected } = useWallet();
  const { account, connect, isConnecting } = useWalletAccount();
  const router = useRouter();

  useEffect(() => {
    if (connected && !account && !isConnecting) {
      connect();
    }
  }, [connected, account, connect, isConnecting]);

  useEffect(() => {
    if (account) {
      router.push('/profile');
    }
  }, [account, router]);

  return (
    <WalletMultiButton className="!bg-primary !text-primary-foreground hover:!bg-primary/90" />
  );
}