import { TrackDetailModal } from "@/components/track-detail-modal"

// Mock track data - in a real app, this would come from your API/blockchain
const getTrackData = (id: string) => ({
  id,
  title: "Midnight Vibes",
  artist: {
    id: "artist-1",
    name: "CryptoBeats",
    avatar: "/placeholder.svg?height=60&width=60",
  },
  coverArt: "/placeholder.svg?height=400&width=400",
  uploadDate: "2024-01-15",
  description:
    "A chill electronic track perfect for late night coding sessions. Created with analog synthesizers and digital processing to capture that nostalgic yet futuristic vibe.",
  duration: "3:42",
  stats: {
    playCount: 15420,
    likeCount: 1247,
    commentCount: 89,
    bangerCount: 234,
  },
  earnings: {
    total: "2,847.5",
    tokenSymbol: "RIFF",
    canWithdraw: true,
  },
  contributors: [
    { id: "1", name: "CryptoBeats", address: "0x742d35Cc...1681", share: 70 },
    { id: "2", name: "BeatMaker", address: "0x8f3a21Dd...9234", share: 20 },
    { id: "3", name: "MixMaster", address: "0x1b4c56Ef...7890", share: 10 },
  ],
  isOwnTrack: true, // This would be determined by comparing with current user
})

const getComments = () => [
  {
    id: "1",
    author: {
      name: "MusicLover",
      address: "0x9a8b7c6d...5432",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    message: "This track is absolutely incredible! The production quality is top-notch 🔥",
    timestamp: "2024-01-16T10:30:00Z",
    isOwn: false,
  },
  {
    id: "2",
    author: {
      name: "VibeChecker",
      address: "0x1f2e3d4c...8765",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    message: "Perfect for my late night playlist. Keep up the amazing work!",
    timestamp: "2024-01-16T08:15:00Z",
    isOwn: true,
  },
  {
    id: "3",
    author: {
      name: "ElectroFan",
      address: "0x5a6b7c8d...9876",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    message: "The synth work around 2:30 is pure magic ✨",
    timestamp: "2024-01-15T22:45:00Z",
    isOwn: false,
  },
]

interface TrackPageProps {
  params: {
    id: string
  }
}

export default function TrackPage({ params }: TrackPageProps) {
  const track = getTrackData(params.id)
  const comments = getComments()

  return <TrackDetailModal track={track} comments={comments} />
}
