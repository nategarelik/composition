import { Suspense } from 'react'
import { HomeClient } from './home-client'

// Force dynamic rendering to avoid SSG issues with zustand stores
export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading...</p>
          </div>
        </main>
      }
    >
      <HomeClient />
    </Suspense>
  )
}
