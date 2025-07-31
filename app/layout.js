import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ForexBot Pro - Trading Bot Forex Terdepan',
  description: 'Platform trading bot forex terdepan di Indonesia dengan strategi canggih dan analisis real-time',
  keywords: 'forex, trading bot, trading, forex bot, indonesia',
  authors: [{ name: 'ForexBot Pro Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'ForexBot Pro - Trading Bot Forex Terdepan',
    description: 'Platform trading bot forex terdepan di Indonesia',
    type: 'website',
    locale: 'id_ID',
  },
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
          card: 'bg-white shadow-lg border border-gray-200',
          headerTitle: 'text-gray-900 font-bold',
          headerSubtitle: 'text-gray-600',
          socialButtonsBlockButton: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
          socialButtonsBlockButtonText: 'text-gray-900 font-medium',
          formFieldLabel: 'text-gray-700 font-medium',
          formFieldInput: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
          footerActionLink: 'text-blue-600 hover:text-blue-700',
        },
        variables: {
          colorPrimary: '#2563eb',
          colorBackground: '#ffffff',
          colorText: '#1f2937',
          colorTextSecondary: '#6b7280',
        },
      }}
    >
      <html lang="id">
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
