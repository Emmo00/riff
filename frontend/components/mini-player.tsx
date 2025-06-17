"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { usePlayback } from "@/contexts/playback-context"
import { Play, Pause, SkipForward, X } from "lucide-react"

export function MiniPlayer() {
  const router = useRouter()
  const { state, dispatch } = usePlayback()
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Show/hide mini-player based on playback state
  useEffect(() => {
    if (state.currentTrack && !isVisible) {
      setIsVisible(true)
      setIsAnimating(true)
      // Remove animation class after animation completes
      setTimeout(() => setIsAnimating(false), 300)
    } else if (!state.currentTrack && isVisible) {
      setIsAnimating(true)
      setTimeout(() => {
        setIsVisible(false)
        setIsAnimating(false)
      }, 300)
    }
  }, [state.currentTrack, isVisible])

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch({ type: "TOGGLE_PLAY" })
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch({ type: "NEXT_TRACK" })
  }

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch({ type: "CLEAR_PLAYBACK" })
  }

  const handleClick = () => {
    if (state.currentTrack) {
      router.push(`/track/${state.currentTrack.id}`)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const progressPercentage = state.currentTrack ? (state.currentTime / state.currentTrack.duration) * 100 : 0

  if (!isVisible || !state.currentTrack) {
    return null
  }

  return (
    <>
      {/* Backdrop for mobile to prevent bottom nav overlap */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-transparent pointer-events-none z-40 md:hidden" />

      {/* Mini Player */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-[#181818] border-t border-gray-700 cursor-pointer transition-all duration-300 ease-out ${
          isAnimating
            ? state.currentTrack
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0"
            : "translate-y-0 opacity-100"
        } ${!state.currentTrack ? "translate-y-full opacity-0" : ""}`}
        onClick={handleClick}
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-600">
          <div
            className="h-full bg-[#1DB954] transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Mini Player Content */}
        <div className="flex items-center gap-3 p-3 pb-4 md:pb-3">
          {/* Track Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="relative">
              <Image
                src={state.currentTrack.coverArt || "/placeholder.svg"}
                alt={`${state.currentTrack.title} cover`}
                width={48}
                height={48}
                className="w-12 h-12 rounded object-cover"
              />
              {/* Animated playing indicator */}
              {state.isPlaying && (
                <div className="absolute inset-0 bg-black/40 rounded flex items-center justify-center">
                  <div className="flex gap-0.5">
                    <div className="w-0.5 h-3 bg-[#1DB954] animate-pulse" style={{ animationDelay: "0ms" }} />
                    <div className="w-0.5 h-4 bg-[#1DB954] animate-pulse" style={{ animationDelay: "150ms" }} />
                    <div className="w-0.5 h-2 bg-[#1DB954] animate-pulse" style={{ animationDelay: "300ms" }} />
                    <div className="w-0.5 h-3 bg-[#1DB954] animate-pulse" style={{ animationDelay: "450ms" }} />
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-white text-sm truncate">{state.currentTrack.title}</h4>
              <p className="text-xs text-gray-400 truncate">{state.currentTrack.artist.name}</p>
              <p className="text-xs text-gray-500">
                {formatTime(state.currentTime)} / {formatTime(state.currentTrack.duration)}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              onClick={handlePlayPause}
              
              className="w-10 h-10 bg-transparent hover:bg-white/10 text-white"
            >
              {state.isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
              )}
            </Button>

            <Button
              onClick={handleNext}
              
              className="w-10 h-10 bg-transparent hover:bg-white/10 text-white"
              disabled={state.currentIndex >= state.queue.length - 1}
            >
              <SkipForward className="w-4 h-4" />
            </Button>

            <Button
              onClick={handleClose}
              
              className="w-8 h-8 bg-transparent hover:bg-white/10 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
