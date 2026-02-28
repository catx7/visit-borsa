'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect, type ReactNode } from 'react';
import { AuthProvider } from '@/lib/auth-context';
import i18n from '@/lib/i18n';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      }),
  );

  // Restore stored language preference after hydration to avoid mismatch
  useEffect(() => {
    const stored = localStorage.getItem('i18nextLng');
    if (stored && stored !== i18n.language && (stored === 'ro' || stored === 'en')) {
      i18n.changeLanguage(stored);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}
