import type { Metadata } from 'next'
import { Playfair_Display, Open_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PageWrapper } from '@/components/page-wrapper'

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-serif',
  display: 'swap',
});

const openSans = Open_Sans({ 
  subsets: ["latin"],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Fallen Timber - Warsaw Indiana Tree Removal Services',
    template: '%s | Fallen Timber',
  },
  description: 'Your trusted local partner for all tree-related needs in Warsaw, Indiana. Professional tree removal, tree topping, tree trimming, and stump grinding services.',
  keywords: ['tree removal', 'tree service', 'Warsaw Indiana', 'stump grinding', 'tree topping', 'tree trimming'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${openSans.variable} font-sans antialiased`}>
        <Header />
        <PageWrapper>{children}</PageWrapper>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
