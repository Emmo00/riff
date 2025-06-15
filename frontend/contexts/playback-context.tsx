"use client"

import type React from "react"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"

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
}

interface PlaybackState {
  currentTrack: Track | null
  isPlaying: boolean
  currentTime: number
  queue: Track[]
  currentIndex: number
  volume: number
}

type PlaybackAction =
  | { type: "PLAY_TRACK"; track: Track; queue?: Track[] }
  | { type: "TOGGLE_PLAY" }
  | { type: "SET_CURRENT_TIME"; time: number }
  | { type: "NEXT_TRACK" }
  | { type: "PREVIOUS_TRACK" }
  | { type: "SET_VOLUME"; volume: number }
  | { type: "CLEAR_PLAYBACK" }

const initialState: PlaybackState = {
  currentTrack: null,
  isPlaying: false,
  currentTime: 0,
  queue: [],
  currentIndex: 0,
  volume: 1,
}

function playbackReducer(state: PlaybackState, action: PlaybackAction): PlaybackState {
  switch (action.type) {
    case "PLAY_TRACK":
      const queue = action.queue || [action.track]
      const currentIndex = queue.findIndex((t) => t.id === action.track.id)
      return {
        ...state,
        currentTrack: action.track,
        isPlaying: true,
        currentTime: 0,
        queue,
        currentIndex: currentIndex >= 0 ? currentIndex : 0,
      }

    case "TOGGLE_PLAY":
      return {
        ...state,
        isPlaying: !state.isPlaying,
      }

    case "SET_CURRENT_TIME":
      return {
        ...state,
        currentTime: action.time,
      }

    case "NEXT_TRACK":
      if (state.currentIndex < state.queue.length - 1) {
        const nextIndex = state.currentIndex + 1
        const nextTrack = state.queue[nextIndex]
        return {
          ...state,
          currentTrack: nextTrack,
          currentIndex: nextIndex,
          currentTime: 0,
          isPlaying: true,
        }
      }
      return state

    case "PREVIOUS_TRACK":
      if (state.currentIndex > 0) {
        const prevIndex = state.currentIndex - 1
        const prevTrack = state.queue[prevIndex]
        return {
          ...state,
          currentTrack: prevTrack,
          currentIndex: prevIndex,
          currentTime: 0,
          isPlaying: true,
        }
      }
      return state

    case "SET_VOLUME":
      return {
        ...state,
        volume: action.volume,
      }

    case "CLEAR_PLAYBACK":
      return initialState

    default:
      return state
  }
}

const PlaybackContext = createContext<{
  state: PlaybackState
  dispatch: React.Dispatch<PlaybackAction>
} | null>(null)

export function PlaybackProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(playbackReducer, initialState)

  // Simulate playback progress
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (state.isPlaying && state.currentTrack) {
      interval = setInterval(() => {
        dispatch({
          type: "SET_CURRENT_TIME",
          time: Math.min(state.currentTime + 1, state.currentTrack!.duration),
        })

        // Auto-advance to next track when current track ends
        if (state.currentTime >= state.currentTrack.duration) {
          dispatch({ type: "NEXT_TRACK" })
        }
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [state.isPlaying, state.currentTime, state.currentTrack])

  return <PlaybackContext.Provider value={{ state, dispatch }}>{children}</PlaybackContext.Provider>
}

export function usePlayback() {
  const context = useContext(PlaybackContext)
  if (!context) {
    throw new Error("usePlayback must be used within a PlaybackProvider")
  }
  return context
}
