'use client'

import { SearchBar, SearchProgress } from '@/components/search'
import { useSearchStore } from '@/stores'

export function HomeClient() {
  const { setQuery } = useSearchStore()

  const handleExampleClick = (example: string) => {
    setQuery(example)
    const input = document.querySelector('input[type="text"]') as HTMLInputElement
    if (input) {
      input.value = example
      input.dispatchEvent(new Event('input', { bubbles: true }))
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">
          Composition
        </h1>
        <nav className="flex items-center gap-4">
          <a
            href="https://github.com/Nate2/Composition"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            GitHub
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-4">
            Deconstruct <span className="text-blue-500">Anything</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            AI-powered composition analysis. Enter any product, substance, or entity to see what
            it&apos;s really made of - from ingredients to elements.
          </p>
        </div>

        <SearchBar />
        <SearchProgress />

        {/* Example queries */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 mb-3">Try searching for:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['iPhone 15', 'Coca-Cola', 'Human Blood', 'Concrete', 'Bitcoin Mining Rig'].map(
              (example) => (
                <button
                  key={example}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-full text-sm transition-colors"
                  onClick={() => handleExampleClick(example)}
                >
                  {example}
                </button>
              )
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="p-6 text-center text-gray-500 text-sm">
        <p>
          Powered by AI research. Data may be estimated or speculative.
        </p>
      </footer>
    </main>
  )
}
