import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { PlaybackProvider } from "@/contexts/playback-context"
import { MiniPlayer } from "@/components/mini-player"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Riff - Decentralized Music Platform",
  description: "Discover and share music on the decentralized web",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <PlaybackProvider>
          {children}
          <MiniPlayer />
          <Toaster />
        </PlaybackProvider>
      </body>
    </html>
  )
}
