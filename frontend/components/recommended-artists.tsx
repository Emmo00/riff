"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Verified } from "lucide-react"

// Mock data for recommended artists
const recommendedArtists = [
  {
    id: "1",
    name: "CryptoBeats",
    avatar: "/placeholder.svg?height=100&width=100",
    followers: "12.5K",
    isVerified: true,
    genre: "Electronic",
  },
  {
    id: "2",
    name: "Web3Producer",
    avatar: "/placeholder.svg?height=100&width=100",
    followers: "8.2K",
    isVerified: false,
    genre: "Hip Hop",
  },
  {
    id: "3",
    name: "DecentralizedDJ",
    avatar: "/placeholder.svg?height=100&width=100",
    followers: "15.7K",
    isVerified: true,
    genre: "House",
  },
  {
    id: "4",
    name: "TokenTunes",
    avatar: "/placeholder.svg?height=100&width=100",
    followers: "6.9K",
    isVerified: false,
    genre: "Pop",
  },
  {
    id: "5",
    name: "VirtualVibes",
    avatar: "/placeholder.svg?height=100&width=100",
    followers: "11.3K",
    isVerified: true,
    genre: "Ambient",
  },
]

export function RecommendedArtists() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Users className="w-5 h-5 text-[#1DB954]" />
          Recommended Artists
        </h2>
        <Link href="/artists" className="text-sm text-gray-400 hover:text-white">
          See all
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {recommendedArtists.map((artist) => (
          <Link key={artist.id} href={`/profile/${artist.id}`}>
            <Card className="bg-[#181818] border-gray-800 hover:bg-[#282828] transition-colors group cursor-pointer min-w-[120px]">
              <CardContent className="p-4 text-center">
                <div className="relative mb-3">
                  <Image
                    src={artist.avatar || "/placeholder.svg"}
                    alt={`${artist.name} avatar`}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full object-cover mx-auto"
                  />
                  {artist.isVerified && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#1DB954] rounded-full flex items-center justify-center">
                      <Verified className="w-3 h-3 text-black" fill="currentColor" />
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium text-white text-sm truncate">{artist.name}</h3>
                  <p className="text-xs text-gray-400">{artist.genre}</p>
                  <p className="text-xs text-gray-500">{artist.followers} followers</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
