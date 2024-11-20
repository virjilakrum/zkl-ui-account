'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletAccount } from '@/lib/hooks/use-wallet-account';
import { redirect } from 'next/navigation';
import { AccountCard } from '@/components/account-card';
import { FileUpload } from '@/components/file-upload';
import { ReceivedFiles } from '@/components/received-files';
import { Loading } from '@/components/ui/loading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ProfilePage() {
  const { publicKey } = useWallet();
  const { account, isLoading } = useWalletAccount();

  if (!publicKey) {
    redirect('/');
  }

  if (isLoading) {
    return <Loading />;
  }

  if (!account) {
    return (
      <div className="container max-w-4xl py-8">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Account not found. Please try reconnecting your wallet.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <AccountCard accountId={account.accountId} />

      <Tabs defaultValue="send" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="send">Send File</TabsTrigger>
          <TabsTrigger value="received">Received Files</TabsTrigger>
        </TabsList>
        <TabsContent value="send">
          <Card>
            <CardHeader>
              <CardTitle>Send File</CardTitle>
              <CardDescription>
                Upload and send a file to another user
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload accountId={account.accountId} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="received">
          <Card>
            <CardHeader>
              <CardTitle>Received Files</CardTitle>
              <CardDescription>
                Files that have been shared with you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReceivedFiles userId={account.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}