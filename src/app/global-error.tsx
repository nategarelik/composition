'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className="bg-gray-950">
        <main className="min-h-screen flex flex-col items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-red-500 mb-4">Error</h1>
            <h2 className="text-2xl text-white mb-4">Something went wrong</h2>
            <p className="text-gray-400 mb-8 max-w-md">
              {error.message || 'An unexpected error occurred. Please try again.'}
            </p>
            <button
              onClick={reset}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  )
}
