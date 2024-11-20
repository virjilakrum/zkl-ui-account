{`'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FileIcon, Download, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

interface ReceivedFile {
  id: string;
  ipfsHash: string;
  transactionSignature: string;
  createdAt: string;
  sender: {
    accountId: string;
  };
}

interface ReceivedFilesProps {
  userId: string;
}

export function ReceivedFiles({ userId }: ReceivedFilesProps) {
  const { data: files, isLoading } = useQuery({
    queryKey: ['received-files', userId],
    queryFn: async () => {
      const response = await axios.get(\`/api/files/received/\${userId}\`);
      return response.data as ReceivedFile[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!files?.length) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No files received yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {files.map((file) => (
        <Card key={file.id}>
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileIcon className="h-5 w-5" />
                  File from {file.sender.accountId}
                </CardTitle>
                <CardDescription>
                  {formatDistanceToNow(new Date(file.createdAt), { addSuffix: true })}
                </CardDescription>
              </div>
              <Button
                size="sm"
                className="gap-2"
                onClick={() => window.open(\`https://ipfs.io/ipfs/\${file.ipfsHash}\`)}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground break-all">
              <div>IPFS: {file.ipfsHash}</div>
              <div>
                Transaction:{' '}
                <a
                  href={\`https://explorer.solana.com/tx/\${file.transactionSignature}?cluster=devnet\`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {file.transactionSignature}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}`}</content>