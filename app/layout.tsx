import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Nitvon - The Crypto Quest",
  description: "Master cryptocurrency trading in the futuristic digital city of Cryptonia",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <div className="min-h-screen bg-background/95 backdrop-blur-sm relative overflow-hidden">
          <div className="fixed inset-0 z-0 opacity-10">
            <div className="crypto-market-bg h-full w-full" />
          </div>
          <div className="relative z-10">
            <Suspense>{children}</Suspense>
          </div>
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
