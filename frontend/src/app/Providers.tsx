import type { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/api/queryClient'

interface ProvidersProps {
  children: ReactNode
}

/**
 * Root provider tree.
 * Add more providers here (RouterProvider, ThemeProvider, etc.) as phases are built.
 */
export function Providers({ children }: ProvidersProps) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
