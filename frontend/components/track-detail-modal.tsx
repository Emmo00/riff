"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CommentSection } from "@/components/comment-section"
import { RevenuePanel } from "@/components/revenue-panel"
import { ContributorPanel } from "@/components/contributor-panel"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Play, Heart, MessageCircle, TrendingUp, Calendar, Clock, Share } from "lucide-react"

interface Track {
  id: string
  title: string
  artist: {
    id: string
    name: string
    avatar: string
  }
  coverArt: string
  uploadDate: string
  description: string
  duration: string
  stats: {
    playCount: number
    likeCount: number
    commentCount: number
    bangerCount: number
  }
  earnings: {
    total: string
    tokenSymbol: string
    canWithdraw: boolean
  }
  contributors: Array<{
    id: string
    name: string
    address: string
    share: number
  }>
  isOwnTrack: boolean
}

interface Comment {
  id: string
  author: {
    name: string
    address: string
    avatar: string
  }
  message: string
  timestamp: string
  isOwn: boolean
}

interface TrackDetailModalProps {
  track: Track
  comments: Comment[]
}

export function TrackDetailModal({ track, comments }: TrackDetailModalProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isVisible, setIsVisible] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isBanger, setIsBanger] = useState(false)
  const [showComments, setShowComments] = useState(false)

  useEffect(() => {
    // Trigger animation after component mounts
    setIsVisible(true)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    // Wait for animation to complete before navigating
    setTimeout(() => {
      router.back()
    }, 300)
  }

  const handlePlay = () => {
    toast({
      title: "Now Playing",
      description: `${track.title} by ${track.artist.name}`,
    })
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    toast({
      title: isLiked ? "Removed from Liked" : "Added to Liked",
      description: `${track.title} ${isLiked ? "removed from" : "added to"} your liked tracks`,
    })
  }

  const handleBanger = () => {
    setIsBanger(!isBanger)
    toast({
      title: isBanger ? "Banger Removed" : "Marked as Banger! 🔥",
      description: `${track.title} ${isBanger ? "is no longer" : "is now"} marked as a banger`,
    })
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link Copied!",
      description: "Track link has been copied to clipboard",
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#121212]">
      {/* Animated Container */}
      <div
        className={`h-full transition-transform duration-300 ease-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#121212]/95 backdrop-blur-sm border-b border-gray-800">
          <div className="flex items-center justify-between p-4">
            <Button onClick={handleClose} size="icon" className="bg-transparent hover:bg-white/10 text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold truncate mx-4">{track.title}</h1>
            <Button onClick={handleShare} size="icon" className="bg-transparent hover:bg-white/10 text-white">
              <Share className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="h-[calc(100vh-73px)] overflow-y-auto">
          <div className="max-w-4xl mx-auto p-4 space-y-8">
            {/* Track Info Section */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Cover Art */}
              <div className="flex-shrink-0">
                <Image
                  src={track.coverArt || "/placeholder.svg"}
                  alt={`${track.title} cover art`}
                  width={300}
                  height={300}
                  className="w-full md:w-80 aspect-square object-cover rounded-2xl shadow-2xl"
                />
              </div>

              {/* Track Details */}
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{track.title}</h1>
                  <Link
                    href={`/profile/${track.artist.id}`}
                    className="text-xl text-gray-300 hover:text-[#1DB954] transition-colors inline-flex items-center gap-2"
                  >
                    <Image
                      src={track.artist.avatar || "/placeholder.svg"}
                      alt={track.artist.name}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full"
                    />
                    {track.artist.name}
                  </Link>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(track.uploadDate)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{track.duration}</span>
                  </div>
                </div>

                {/* Description */}
                {track.description && <p className="text-gray-300 leading-relaxed">{track.description}</p>}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4">
                  <Button
                    onClick={handlePlay}
                    className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold px-8"
                  >
                    <Play className="w-4 h-4 mr-2" fill="currentColor" />
                    Play
                  </Button>

                  <Button
                    onClick={handleLike}
                    variant="outline"
                    className={`border-gray-600 hover:border-[#1DB954] ${
                      isLiked ? "bg-[#1DB954]/20 border-[#1DB954] text-[#1DB954]" : "text-white"
                    }`}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
                    {track.stats.likeCount + (isLiked ? 1 : 0)}
                  </Button>

                  <Button
                    onClick={() => setShowComments(!showComments)}
                    variant="outline"
                    className="border-gray-600 hover:border-[#1DB954] text-white"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {track.stats.commentCount}
                  </Button>

                  <Button
                    onClick={handleBanger}
                    variant="outline"
                    className={`border-gray-600 hover:border-orange-500 ${
                      isBanger ? "bg-orange-500/20 border-orange-500 text-orange-500" : "text-white"
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    {track.stats.bangerCount + (isBanger ? 1 : 0)}
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#181818] rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-[#1DB954]">{track.stats.playCount.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Plays</div>
              </div>
              <div className="bg-[#181818] rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-400">{track.stats.likeCount.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Likes</div>
              </div>
              <div className="bg-[#181818] rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{track.stats.commentCount}</div>
                <div className="text-sm text-gray-400">Comments</div>
              </div>
              <div className="bg-[#181818] rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-400">{track.stats.bangerCount}</div>
                <div className="text-sm text-gray-400">Bangers</div>
              </div>
            </div>

            {/* Revenue Panel (Artist Only) */}
            {track.isOwnTrack && <RevenuePanel earnings={track.earnings} />}

            {/* Contributors Panel */}
            <ContributorPanel contributors={track.contributors} />

            {/* Comments Section */}
            <CommentSection
              comments={comments}
              isVisible={showComments}
              onToggle={() => setShowComments(!showComments)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
