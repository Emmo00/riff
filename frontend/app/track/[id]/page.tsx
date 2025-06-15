import { SpotifyStyleTrackPage } from "@/components/spotify-style-track-page"

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
  duration: 222, // 3:42 in seconds
  currentTime: 45, // Current playback position in seconds
  isPlaying: false,
  uploadDate: "2024-01-15",
  description: "A chill electronic track perfect for late night coding sessions.",
  tags: ["chill", "electronic", "ambient", "coding", "late-night", "atmospheric"], // Add sample tags
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
  isOwnTrack: true,
})

// Mock playlist/queue data
const getPlaylistQueue = () => [
  {
    id: "1",
    title: "Midnight Vibes",
    artist: "CryptoBeats",
    coverArt: "/placeholder.svg?height=60&width=60",
    duration: "3:42",
    isCurrentTrack: true,
  },
  {
    id: "2",
    title: "Digital Dreams",
    artist: "Web3Producer",
    coverArt: "/placeholder.svg?height=60&width=60",
    duration: "4:15",
    isCurrentTrack: false,
  },
  {
    id: "3",
    title: "Blockchain Beats",
    artist: "DecentralizedDJ",
    coverArt: "/placeholder.svg?height=60&width=60",
    duration: "2:58",
    isCurrentTrack: false,
  },
  {
    id: "4",
    title: "NFT Anthem",
    artist: "TokenTunes",
    coverArt: "/placeholder.svg?height=60&width=60",
    duration: "3:28",
    isCurrentTrack: false,
  },
  {
    id: "5",
    title: "Metaverse Melody",
    artist: "VirtualVibes",
    coverArt: "/placeholder.svg?height=60&width=60",
    duration: "5:12",
    isCurrentTrack: false,
  },
]

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
]

interface TrackPageProps {
  params: {
    id: string
  }
}

export default function TrackPage({ params }: TrackPageProps) {
  const track = getTrackData(params.id)
  const queue = getPlaylistQueue()
  const comments = getComments()

  return <SpotifyStyleTrackPage track={track} queue={queue} comments={comments} />
}
