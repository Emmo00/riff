"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Clock } from "lucide-react"

// Mock data for recently played tracks
const recentTracks = [
  {
    id: "1",
    title: "Midnight Vibes",
    artist: "CryptoBeats",
    coverArt: "/placeholder.svg?height=120&width=120",
    lastPlayed: "2 hours ago",
  },
  {
    id: "2",
    title: "Digital Dreams",
    artist: "Web3Producer",
    coverArt: "/placeholder.svg?height=120&width=120",
    lastPlayed: "5 hours ago",
  },
  {
    id: "3",
    title: "Blockchain Beats",
    artist: "DecentralizedDJ",
    coverArt: "/placeholder.svg?height=120&width=120",
    lastPlayed: "1 day ago",
  },
  {
    id: "4",
    title: "NFT Anthem",
    artist: "TokenTunes",
    coverArt: "/placeholder.svg?height=120&width=120",
    lastPlayed: "2 days ago",
  },
  {
    id: "5",
    title: "Metaverse Melody",
    artist: "VirtualVibes",
    coverArt: "/placeholder.svg?height=120&width=120",
    lastPlayed: "3 days ago",
  },
]

export function RecentlyPlayed() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#1DB954]" />
          Recently Played
        </h2>
        <Link href="/recent" className="text-sm text-gray-400 hover:text-white">
          See all
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {recentTracks.map((track) => (
          <Link key={track.id} href={`/track/${track.id}`}>
            <Card className="bg-[#181818] border-gray-800 hover:bg-[#282828] transition-colors group cursor-pointer min-w-[140px]">
              <CardContent className="p-3">
                <div className="relative mb-3">
                  <Image
                    src={track.coverArt || "/placeholder.svg"}
                    alt={`${track.title} cover`}
                    width={120}
                    height={120}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <div className="w-10 h-10 bg-[#1DB954] rounded-full flex items-center justify-center">
                      <Play className="w-4 h-4 text-black ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium text-white text-sm truncate">{track.title}</h3>
                  <p className="text-xs text-gray-400 truncate">{track.artist}</p>
                  <p className="text-xs text-gray-500">{track.lastPlayed}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
