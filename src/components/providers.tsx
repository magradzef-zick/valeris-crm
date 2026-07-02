'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,   // data considered fresh for 5 minutes
        gcTime: 10 * 60 * 1000,     // inactive cache kept for 10 minutes
        retry: 1,
        refetchOnWindowFocus: false, // CRM tabs stay open; avoid surprise refetches
      },
    },
  });
}

export function Providers({ children }: { children: ReactNode }) {
  // useState with initializer ensures one QueryClient per browser session,
  // never recreated on re-renders, never shared across server requests.
  const [queryClient] = useState(makeQueryClient);
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
