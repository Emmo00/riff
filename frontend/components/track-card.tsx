"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Heart, TrendingUp } from "lucide-react"
import { useState } from "react"

interface Track {
  id: string
  title: string
  artist: string
  coverArt: string
  likeCount: number
  uploadTime: string
}

interface TrackCardProps {
  track: Track
}

export function TrackCard({ track }: TrackCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  return (
    <Card
      className="bg-[#181818] border-gray-800 hover:bg-[#282828] transition-all duration-300 group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        boxShadow: isHovered ? "0 0 20px rgba(29, 185, 84, 0.3)" : "none",
        border: isHovered ? "1px solid rgba(29, 185, 84, 0.5)" : "1px solid rgb(55, 65, 81)",
      }}
    >
      <CardContent className="p-4">
        <Link href={`/track/${track.id}`}>
          <div className="relative mb-4">
            <Image
              src={track.coverArt || "/placeholder.svg"}
              alt={`${track.title} cover art`}
              width={200}
              height={200}
              className="w-full aspect-square object-cover rounded-lg"
            />

            {/* Play Button Overlay */}
            <div
              className={`absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <Button
                size="icon"
                className="w-12 h-12 bg-[#1DB954] hover:bg-[#1ed760] text-black rounded-full shadow-lg transform hover:scale-110 transition-transform"
                onClick={(e) => {
                  e.preventDefault()
                  // Handle play functionality
                }}
              >
                <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
              </Button>
            </div>
          </div>
        </Link>

        <div className="space-y-2">
          <Link href={`/track/${track.id}`}>
            <h3 className="font-semibold text-white hover:text-[#1DB954] transition-colors truncate">{track.title}</h3>
          </Link>

          <p className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer truncate">
            {track.artist}
          </p>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="flex items-center space-x-1 text-gray-400 hover:text-[#1DB954] transition-colors"
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-[#1DB954] text-[#1DB954]" : ""}`} />
                <span className="text-xs">{track.likeCount.toLocaleString()}</span>
              </button>

              <div className="flex items-center space-x-1 text-gray-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs">Banger</span>
              </div>
            </div>

            <span className="text-xs text-gray-500">{track.uploadTime}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
