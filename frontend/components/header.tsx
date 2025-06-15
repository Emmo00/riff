"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#121212]/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#1DB954] rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-lg">R</span>
            </div>
            <span className="text-xl font-bold">Riff</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-400 hover:text-[#1DB954] transition-colors font-medium">
              Home
            </Link>
            <Link href="/upload" className="text-gray-400 hover:text-[#1DB954] transition-colors font-medium">
              Upload
            </Link>
            <Link href="/dashboard" className="text-gray-400 hover:text-[#1DB954] transition-colors font-medium">
              Dashboard
            </Link>
            <Link href="/profile/me" className="text-white hover:text-[#1DB954] transition-colors font-medium">
              My Profile
            </Link>
          </nav>

          {/* Connect Wallet Button */}
          <Button className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold px-6">
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet
          </Button>
        </div>
      </div>
    </header>
  )
}
