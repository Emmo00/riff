import { ManageContributorsForm } from "@/components/manage-contributors-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// Mock track data - in a real app, this would come from your API/blockchain
const getTrackData = (id: string) => ({
  id,
  title: "Midnight Vibes",
  artist: "CryptoBeats",
  coverArt: "/placeholder.svg?height=200&width=200",
  cid: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
  duration: "3:42",
  uploadDate: "2024-01-15",
})

const getCurrentContributors = () => [
  {
    id: "1",
    address: "0x742d35Cc6634C0532925a3b8D404d3aABF5f1681",
    name: "CryptoBeats",
    percentage: 70,
    role: "Artist",
    isOwner: true,
  },
  {
    id: "2",
    address: "0x8f3a21Dd9234C0532925a3b8D404d3aABF5f9234",
    name: "BeatMaker",
    percentage: 20,
    role: "Producer",
    isOwner: false,
  },
  {
    id: "3",
    address: "0x1b4c56Ef7890C0532925a3b8D404d3aABF5f7890",
    name: "MixMaster",
    percentage: 10,
    role: "Engineer",
    isOwner: false,
  },
]

interface ContributorsPageProps {
  params: {
    id: string
  }
}

export default function ContributorsPage({ params }: ContributorsPageProps) {
  const track = getTrackData(params.id)
  const contributors = getCurrentContributors()

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#121212]/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href={`/track/${params.id}`}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Track
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Manage Track Contributors</h1>
          <p className="text-gray-400 text-lg">Set revenue sharing for collaborators and contributors</p>
        </div>

        <ManageContributorsForm track={track} initialContributors={contributors} />
      </div>
    </div>
  )
}
