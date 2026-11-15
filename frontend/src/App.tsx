import { Providers } from '@/app/Providers'

/**
 * App root.
 * Routing (Phase 1) will replace the placeholder content below.
 */
function App() {
  return (
    <Providers>
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white p-8 dark:bg-gray-950">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          AI Notes
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Phase 0 scaffold complete. Build continues in Phase 1 (Auth &amp; App Shell).
        </p>
      </main>
    </Providers>
  )
}

export default App
