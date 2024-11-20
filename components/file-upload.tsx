{`'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useFileUpload } from '@/lib/hooks/use-file-upload';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  accountId: string;
}

export function FileUpload({ accountId }: FileUploadProps) {
  const [recipientId, setRecipientId] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  
  const { mutate: uploadFile, isPending: isUploading } = useFileUpload(accountId);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    setSelectedFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: isUploading,
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/zip': ['.zip'],
    },
  });

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: 'No file selected',
        description: 'Please select a file to upload',
        variant: 'destructive',
      });
      return;
    }

    if (!recipientId) {
      toast({
        title: 'Missing recipient',
        description: 'Please enter a recipient Account ID',
        variant: 'destructive',
      });
      return;
    }

    try {
      await uploadFile(
        { file: selectedFile, recipientId },
        {
          onSuccess: () => {
            toast({
              title: 'File uploaded successfully',
              description: 'The file has been shared with the recipient',
            });
            setSelectedFile(null);
            setRecipientId('');
          },
          onError: (error) => {
            toast({
              title: 'Upload failed',
              description: error instanceof Error ? error.message : 'Failed to upload file',
              variant: 'destructive',
            });
          },
        }
      );
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="recipientId">Recipient Account ID</Label>
        <Input
          id="recipientId"
          placeholder="Enter 10-digit account ID"
          value={recipientId}
          onChange={(e) => setRecipientId(e.target.value.toUpperCase())}
          maxLength={10}
          className="font-mono"
          disabled={isUploading}
        />
      </div>

      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
          isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25',
          (isUploading || selectedFile) && 'pointer-events-none opacity-75'
        )}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            {isUploading ? (
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
            ) : (
              <Upload className="h-6 w-6 text-primary" />
            )}
          </div>
          <div>
            {isUploading ? (
              <p>Uploading...</p>
            ) : selectedFile ? (
              <p className="text-sm">
                Selected: <span className="font-medium">{selectedFile.name}</span>
                <br />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                  className="text-primary hover:underline mt-2"
                >
                  Remove
                </button>
              </p>
            ) : isDragActive ? (
              <p>Drop the file here</p>
            ) : (
              <p>
                Drag and drop a file here, or click to select
                <br />
                <span className="text-sm text-muted-foreground">
                  Supported formats: PDF, Images, ZIP (max 10MB)
                </span>
              </p>
            )}
          </div>
        </div>
      </div>

      <Button
        onClick={handleUpload}
        disabled={!selectedFile || !recipientId || isUploading}
        className="w-full"
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          'Upload and Share'
        )}
      </Button>
    </div>
  );
}`}