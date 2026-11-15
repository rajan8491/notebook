import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is fresh for 60 seconds; avoids redundant refetches on tab focus
      staleTime: 60_000,
      // Retry failed requests twice (default 3 is too aggressive for 4xx)
      retry: (failureCount, error) => {
        // Don't retry on auth or client errors
        if (error instanceof Error && 'status' in error) {
          const status = (error as { status: number }).status
          if (status >= 400 && status < 500) return false
        }
        return failureCount < 2
      },
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: false,
    },
  },
})
