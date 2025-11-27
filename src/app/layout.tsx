import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { QueryProvider } from '@/components/providers'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Composition - Deconstruct Anything',
  description:
    'AI-powered composition analysis. Deconstruct any product, substance, or entity into its constituent parts with interactive 3D visualization.',
  keywords: ['composition', 'analysis', 'ingredients', 'materials', 'elements', '3D visualization'],
  authors: [{ name: 'Composition' }],
  openGraph: {
    title: 'Composition - Deconstruct Anything',
    description: 'AI-powered composition analysis with interactive 3D visualization.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
