"use client"

import { TrackListItem } from "@/components/track-list-item"

// Mock tracks data
const getUserTracks = (userId: string) => [
  {
    id: "1",
    title: "Midnight Vibes",
    coverArt: "/placeholder.svg?height=60&width=60",
    uploadDate: "2024-01-15",
    playCount: 15420,
    likeCount: 1247,
    commentCount: 89,
    bangerCount: 234,
    duration: "3:42",
  },
  {
    id: "2",
    title: "Digital Dreams",
    coverArt: "/placeholder.svg?height=60&width=60",
    uploadDate: "2024-01-10",
    playCount: 8930,
    likeCount: 892,
    commentCount: 45,
    bangerCount: 156,
    duration: "4:15",
  },
  {
    id: "3",
    title: "Blockchain Beats",
    coverArt: "/placeholder.svg?height=60&width=60",
    uploadDate: "2024-01-05",
    playCount: 22150,
    likeCount: 2156,
    commentCount: 178,
    bangerCount: 445,
    duration: "2:58",
  },
  {
    id: "4",
    title: "NFT Anthem",
    coverArt: "/placeholder.svg?height=60&width=60",
    uploadDate: "2023-12-28",
    playCount: 34210,
    likeCount: 3421,
    commentCount: 267,
    bangerCount: 678,
    duration: "3:28",
  },
  {
    id: "5",
    title: "Metaverse Melody",
    coverArt: "/placeholder.svg?height=60&width=60",
    uploadDate: "2023-12-20",
    playCount: 7560,
    likeCount: 756,
    commentCount: 34,
    bangerCount: 89,
    duration: "5:12",
  },
]

interface UserTracksProps {
  userId: string
  isOwnProfile: boolean
}

export function UserTracks({ userId, isOwnProfile }: UserTracksProps) {
  const tracks = getUserTracks(userId)

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{isOwnProfile ? "My Tracks" : "Tracks"}</h2>
        <p className="text-gray-400 text-sm">
          {tracks.length} {tracks.length === 1 ? "track" : "tracks"}
        </p>
      </div>

      <div className="space-y-2">
        {tracks.map((track, index) => (
          <TrackListItem key={track.id} track={track} index={index + 1} isOwnProfile={isOwnProfile} />
        ))}
      </div>
    </div>
  )
}
