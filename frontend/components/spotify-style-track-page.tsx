"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { CommentSection } from "@/components/comment-section"
import { RevenuePanel } from "@/components/revenue-panel"
import { ContributorPanel } from "@/components/contributor-panel"
import { useToast } from "@/hooks/use-toast"
import { usePlayback } from "@/contexts/playback-context"
import {
  ArrowLeft,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Heart,
  MessageCircle,
  TrendingUp,
  DollarSign,
  Share,
  ChevronDown,
  ChevronUp,
  BarChart3,
} from "lucide-react"

interface Track {
  id: string
  title: string
  artist: {
    id: string
    name: string
    avatar: string
  }
  coverArt: string
  duration: number // in seconds
  currentTime: number // in seconds
  isPlaying: boolean
  uploadDate: string
  description: string
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

interface QueueTrack {
  id: string
  title: string
  artist: string
  coverArt: string
  duration: string
  isCurrentTrack: boolean
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

interface SpotifyStyleTrackPageProps {
  track: Track
  queue: QueueTrack[]
  comments: Comment[]
}

export function SpotifyStyleTrackPage({ track, queue, comments }: SpotifyStyleTrackPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { state: playbackState, dispatch } = usePlayback()

  // Use global playback state instead of local state
  const isPlaying = playbackState.currentTrack?.id === track.id && playbackState.isPlaying
  const currentTime = playbackState.currentTrack?.id === track.id ? playbackState.currentTime : 0

  // Remove local state declarations for isPlaying and currentTime
  const [isLiked, setIsLiked] = useState(false)
  const [isBanger, setIsBanger] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [showComments, setShowComments] = useState(false)

  // Remove the useEffect for playback simulation since it's handled globally

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handlePlayPause = () => {
    if (playbackState.currentTrack?.id === track.id) {
      dispatch({ type: "TOGGLE_PLAY" })
    } else {
      // Convert queue data to the format expected by context
      const contextQueue = queue.map((q) => ({
        id: q.id,
        title: q.title,
        artist: { id: "artist-1", name: q.artist, avatar: "/placeholder.svg" },
        coverArt: q.coverArt,
        duration: 222, // You'd get this from actual track data
      }))

      const trackForContext = {
        id: track.id,
        title: track.title,
        artist: track.artist,
        coverArt: track.coverArt,
        duration: track.duration,
      }

      dispatch({ type: "PLAY_TRACK", track: trackForContext, queue: contextQueue })
    }

    toast({
      title: isPlaying ? "Paused" : "Now Playing",
      description: `${track.title} by ${track.artist.name}`,
    })
  }

  const handlePrevious = () => {
    dispatch({ type: "PREVIOUS_TRACK" })
    toast({
      title: "Previous Track",
      description: "Playing previous track in queue",
    })
  }

  const handleNext = () => {
    dispatch({ type: "NEXT_TRACK" })
    toast({
      title: "Next Track",
      description: "Playing next track in queue",
    })
  }

  const handleSeek = (value: number[]) => {
    dispatch({ type: "SET_CURRENT_TIME", time: value[0] })
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

  const handleTip = () => {
    toast({
      title: "Tip Artist",
      description: "Opening tip modal...",
    })
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link Copied!",
      description: "Track link has been copied to clipboard",
    })
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#121212]/95 backdrop-blur-sm border-b border-gray-800">
        <div className="flex items-center justify-between p-4">
          <Button onClick={handleBack} size="icon" className="bg-transparent hover:bg-white/10 text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Button onClick={handleShare} size="icon" className="bg-transparent hover:bg-white/10 text-white">
            <Share className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Track Header */}
        <div className="text-center space-y-4">
          <Image
            src={track.coverArt || "/placeholder.svg"}
            alt={`${track.title} cover art`}
            width={300}
            height={300}
            className="w-64 h-64 md:w-80 md:h-80 mx-auto rounded-2xl shadow-2xl object-cover"
          />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{track.title}</h1>
            <Link
              href={`/profile/${track.artist.id}`}
              className="text-lg text-gray-300 hover:text-[#1DB954] transition-colors inline-flex items-center gap-2"
            >
              <Image
                src={track.artist.avatar || "/placeholder.svg"}
                alt={track.artist.name}
                width={24}
                height={24}
                className="w-6 h-6 rounded-full"
              />
              {track.artist.name}
            </Link>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="space-y-4">
          {/* Control Buttons */}
          <div className="flex items-center justify-center gap-6">
            <Button
              onClick={handlePrevious}
              size="icon"
              className="w-12 h-12 bg-transparent hover:bg-white/10 text-white"
            >
              <SkipBack className="w-6 h-6" />
            </Button>

            <Button
              onClick={handlePlayPause}
              size="icon"
              className="w-16 h-16 bg-[#1DB954] hover:bg-[#1ed760] text-black"
            >
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" fill="currentColor" />}
            </Button>

            <Button onClick={handleNext} size="icon" className="w-12 h-12 bg-transparent hover:bg-white/10 text-white">
              <SkipForward className="w-6 h-6" />
            </Button>
          </div>

          {/* Seek Bar */}
          <div className="space-y-2">
            <Slider value={[currentTime]} max={track.duration} step={1} onValueChange={handleSeek} className="w-full" />
            <div className="flex justify-between text-sm text-gray-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(track.duration)}</span>
            </div>
          </div>
        </div>

        {/* Now Playing Queue */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Now Playing from Playlist</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {queue.map((queueTrack) => (
              <Link key={queueTrack.id} href={`/track/${queueTrack.id}`}>
                <Card
                  className={`min-w-[200px] transition-all ${
                    queueTrack.isCurrentTrack
                      ? "bg-[#1DB954]/20 border-[#1DB954]"
                      : "bg-[#181818] border-gray-800 hover:bg-[#282828]"
                  }`}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={queueTrack.coverArt || "/placeholder.svg"}
                        alt={`${queueTrack.title} cover`}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4
                          className={`font-medium text-sm truncate ${
                            queueTrack.isCurrentTrack ? "text-[#1DB954]" : "text-white"
                          }`}
                        >
                          {queueTrack.title}
                        </h4>
                        <p className="text-xs text-gray-400 truncate">{queueTrack.artist}</p>
                        <p className="text-xs text-gray-500">{queueTrack.duration}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-3">
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

          <Button
            onClick={handleTip}
            variant="outline"
            className="border-gray-600 hover:border-yellow-500 text-white hover:text-yellow-500"
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Tip
          </Button>
        </div>

        {/* Collapsible Track Statistics */}
        <Card className="bg-[#181818] border-gray-800">
          <CardContent className="p-0">
            <button
              onClick={() => setShowStats(!showStats)}
              className="w-full flex items-center justify-between p-4 hover:bg-[#282828] transition-colors"
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#1DB954]" />
                <h3 className="text-lg font-semibold">Track Statistics</h3>
              </div>
              {showStats ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            {showStats && (
              <div className="px-4 pb-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-[#2a2a2a] rounded-lg">
                    <div className="text-2xl font-bold text-[#1DB954]">{track.stats.playCount.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">Plays</div>
                  </div>
                  <div className="text-center p-3 bg-[#2a2a2a] rounded-lg">
                    <div className="text-2xl font-bold text-red-400">{track.stats.likeCount.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">Likes</div>
                  </div>
                  <div className="text-center p-3 bg-[#2a2a2a] rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">{track.stats.commentCount}</div>
                    <div className="text-sm text-gray-400">Comments</div>
                  </div>
                  <div className="text-center p-3 bg-[#2a2a2a] rounded-lg">
                    <div className="text-2xl font-bold text-orange-400">{track.stats.bangerCount}</div>
                    <div className="text-sm text-gray-400">Bangers</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Description */}
        {track.description && (
          <Card className="bg-[#181818] border-gray-800">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-2">About this track</h3>
              <p className="text-gray-300 leading-relaxed">{track.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Revenue Panel (Artist Only) */}
        {track.isOwnTrack && <RevenuePanel earnings={track.earnings} />}

        {/* Contributors Panel */}
        <ContributorPanel contributors={track.contributors} />

        {/* Comments Section */}
        <CommentSection comments={comments} isVisible={showComments} onToggle={() => setShowComments(!showComments)} />
      </div>
    </div>
  )
}
