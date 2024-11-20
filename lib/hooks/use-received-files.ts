'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { File } from '@/lib/db/schema';

export function useReceivedFiles(userId: string) {
  return useQuery({
    queryKey: ['received-files', userId],
    queryFn: async () => {
      const response = await axios.get(`/api/files/received/${userId}`);
      return response.data as File[];
    },
    enabled: !!userId,
  });
}