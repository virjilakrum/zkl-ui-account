import { WalletButton } from '@/components/wallet-button';
import { FileText } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-4">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 p-3">
            <FileText className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Web3 File Share</h1>
          <p className="text-lg text-muted-foreground">
            Secure file sharing powered by Solana and IPFS
          </p>
        </div>
        
        <div className="flex justify-center">
          <WalletButton />
        </div>
      </div>
    </main>
  );
}