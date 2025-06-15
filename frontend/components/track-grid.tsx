"use client"

import { TrackCard } from "@/components/track-card"

// Mock data for tracks
const tracks = [
  {
    id: "1",
    title: "Midnight Vibes",
    artist: "CryptoBeats",
    coverArt: "/placeholder.svg?height=200&width=200",
    likeCount: 1247,
    uploadTime: "2 hours ago",
  },
  {
    id: "2",
    title: "Digital Dreams",
    artist: "Web3Producer",
    coverArt: "/placeholder.svg?height=200&width=200",
    likeCount: 892,
    uploadTime: "5 hours ago",
  },
  {
    id: "3",
    title: "Blockchain Beats",
    artist: "DecentralizedDJ",
    coverArt: "/placeholder.svg?height=200&width=200",
    likeCount: 2156,
    uploadTime: "8 hours ago",
  },
  {
    id: "4",
    title: "NFT Anthem",
    artist: "TokenTunes",
    coverArt: "/placeholder.svg?height=200&width=200",
    likeCount: 3421,
    uploadTime: "12 hours ago",
  },
  {
    id: "5",
    title: "Metaverse Melody",
    artist: "VirtualVibes",
    coverArt: "/placeholder.svg?height=200&width=200",
    likeCount: 756,
    uploadTime: "1 day ago",
  },
  {
    id: "6",
    title: "Smart Contract Symphony",
    artist: "EthereumEcho",
    coverArt: "/placeholder.svg?height=200&width=200",
    likeCount: 1834,
    uploadTime: "1 day ago",
  },
  {
    id: "7",
    title: "DeFi Disco",
    artist: "YieldFarmer",
    coverArt: "/placeholder.svg?height=200&width=200",
    likeCount: 967,
    uploadTime: "2 days ago",
  },
  {
    id: "8",
    title: "Crypto Chill",
    artist: "HODLHarmonics",
    coverArt: "/placeholder.svg?height=200&width=200",
    likeCount: 1523,
    uploadTime: "2 days ago",
  },
]

export function TrackGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tracks.map((track) => (
        <TrackCard key={track.id} track={track} />
      ))}
    </div>
  )
}
