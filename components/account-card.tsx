'use client';

import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface AccountCardProps {
  accountId: string;
}

export function AccountCard({ accountId }: AccountCardProps) {
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(accountId);
      toast({
        title: 'Copied to clipboard',
        description: 'Your Account ID has been copied to the clipboard.',
      });
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy Account ID to clipboard.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Account</CardTitle>
        <CardDescription>
          Share your Account ID with others to receive files
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
          <div>
            <div className="text-sm text-muted-foreground">Account ID</div>
            <div className="text-2xl font-bold font-mono">{accountId}</div>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={copyToClipboard}
            className="shrink-0"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}