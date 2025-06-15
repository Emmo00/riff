"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Play, Heart, TrendingDown } from "lucide-react"

// Mock data for trending tracks
const trendingTracks = [
  {
    id: "1",
    title: "Blockchain Beats",
    artist: "DecentralizedDJ",
    coverArt: "/placeholder.svg?height=120&width=120",
    plays: "45.2K",
    likes: "3.1K",
    trend: "up",
    position: 1,
  },
  {
    id: "2",
    title: "NFT Anthem",
    artist: "TokenTunes",
    coverArt: "/placeholder.svg?height=120&width=120",
    plays: "38.7K",
    likes: "2.8K",
    trend: "up",
    position: 2,
  },
  {
    id: "3",
    title: "Digital Dreams",
    artist: "Web3Producer",
    coverArt: "/placeholder.svg?height=120&width=120",
    plays: "32.1K",
    likes: "2.2K",
    trend: "same",
    position: 3,
  },
  {
    id: "4",
    title: "Metaverse Melody",
    artist: "VirtualVibes",
    coverArt: "/placeholder.svg?height=120&width=120",
    plays: "28.9K",
    likes: "1.9K",
    trend: "down",
    position: 4,
  },
  {
    id: "5",
    title: "Crypto Chill",
    artist: "HODLHarmonics",
    coverArt: "/placeholder.svg?height=120&width=120",
    plays: "25.4K",
    likes: "1.7K",
    trend: "up",
    position: 5,
  },
]

export function TrendingTracks() {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-3 h-3 text-green-400" />
      case "down":
        return <TrendingDown className="w-3 h-3 text-red-400" />
      default:
        return <div className="w-3 h-3 bg-gray-400 rounded-full" />
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#1DB954]" />
          Trending This Week
        </h2>
        <Link href="/trending" className="text-sm text-gray-400 hover:text-white">
          See all
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {trendingTracks.map((track) => (
          <Link key={track.id} href={`/track/${track.id}`}>
            <Card className="bg-[#181818] border-gray-800 hover:bg-[#282828] transition-colors group cursor-pointer min-w-[160px]">
              <CardContent className="p-3">
                <div className="relative mb-3">
                  <Image
                    src={track.coverArt || "/placeholder.svg"}
                    alt={`${track.title} cover`}
                    width={120}
                    height={120}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-[#1DB954] text-black text-xs font-bold">#{track.position}</Badge>
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <div className="w-10 h-10 bg-[#1DB954] rounded-full flex items-center justify-center">
                      <Play className="w-4 h-4 text-black ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium text-white text-sm truncate">{track.title}</h3>
                  <p className="text-xs text-gray-400 truncate">{track.artist}</p>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">{track.plays} plays</span>
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-red-400" />
                        <span className="text-gray-500">{track.likes}</span>
                      </div>
                    </div>
                    {getTrendIcon(track.trend)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
