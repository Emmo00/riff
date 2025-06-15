"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Play, Heart, MessageCircle, TrendingUp, MoreHorizontal, Calendar, Clock } from "lucide-react"
import { useState } from "react"
import { usePlayback } from "@/contexts/playback-context"

interface Track {
  id: string
  title: string
  coverArt: string
  uploadDate: string
  playCount: number
  likeCount: number
  commentCount: number
  bangerCount: number
  duration: string
}

interface TrackListItemProps {
  track: Track
  index: number
  isOwnProfile: boolean
}

export function TrackListItem({ track, index, isOwnProfile }: TrackListItemProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const { dispatch } = usePlayback()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handlePlay = () => {
    const trackForContext = {
      id: track.id,
      title: track.title,
      artist: { id: "artist-1", name: "Unknown Artist", avatar: "/placeholder.svg" },
      coverArt: track.coverArt,
      duration: 222, // You'd get this from actual track data
    }

    dispatch({ type: "PLAY_TRACK", track: trackForContext })
  }

  return (
    <div
      className="group flex items-center gap-4 p-3 rounded-lg hover:bg-[#1a1a1a] transition-colors cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Track Number / Play Button */}
      <div className="w-8 flex items-center justify-center">
        {isHovered ? (
          <Button
            size="icon"
            className="w-8 h-8 bg-transparent hover:bg-[#1DB954] text-white hover:text-black rounded-full"
            onClick={handlePlay}
          >
            <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
          </Button>
        ) : (
          <span className="text-gray-400 text-sm font-medium">{index}</span>
        )}
      </div>

      {/* Cover Art & Track Info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Image
          src={track.coverArt || "/placeholder.svg"}
          alt={`${track.title} cover`}
          width={60}
          height={60}
          className="w-12 h-12 rounded object-cover"
        />
        <div className="min-w-0 flex-1">
          <Link href={`/track/${track.id}`}>
            <h3 className="font-medium text-white hover:text-[#1DB954] transition-colors truncate">{track.title}</h3>
          </Link>
          <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(track.uploadDate)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{track.duration}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
        <div className="flex items-center gap-1">
          <Play className="w-4 h-4" />
          <span>{track.playCount.toLocaleString()}</span>
        </div>
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="flex items-center gap-1 hover:text-[#1DB954] transition-colors"
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-[#1DB954] text-[#1DB954]" : ""}`} />
          <span>{track.likeCount.toLocaleString()}</span>
        </button>
        <div className="flex items-center gap-1">
          <MessageCircle className="w-4 h-4" />
          <span>{track.commentCount}</span>
        </div>
        <div className="flex items-center gap-1 text-[#1DB954]">
          <TrendingUp className="w-4 h-4" />
          <span>{track.bangerCount}</span>
        </div>
      </div>

      {/* More Options */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <Button size="icon" className="w-8 h-8 bg-transparent hover:bg-[#1a1a1a] text-gray-400 hover:text-white">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
