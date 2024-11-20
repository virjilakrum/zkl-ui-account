import { League_Spartan } from 'next/font/google';
import { Providers } from '@/components/providers';
import { cn } from '@/lib/utils';
import './globals.css';

const leagueSpartan = League_Spartan({ subsets: ['latin'] });

export const metadata = {
  title: 'Web3 File Share',
  description: 'Secure file sharing using Solana blockchain and IPFS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        leagueSpartan.className,
        'min-h-screen bg-background antialiased'
      )}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}