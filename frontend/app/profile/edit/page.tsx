import { EditProfileForm } from "@/components/edit-profile-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// Mock current user data - in a real app, this would come from your API/blockchain
const getCurrentUser = () => ({
  id: "current-user",
  username: "CryptoBeats",
  bio: "Creating beats on the blockchain since 2021. Web3 music producer exploring the intersection of sound and decentralization.",
  avatar: "/placeholder.svg?height=200&width=200",
})

export default function EditProfilePage() {
  const currentUser = getCurrentUser()

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#121212]/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/profile/me"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Profile
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="w-full max-w-2xl">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Edit Profile</h1>
            <p className="text-gray-400">Update your artist information</p>
          </div>

          {/* Form Card */}
          <div className="bg-[#181818] rounded-2xl p-6 md:p-8 shadow-2xl border border-gray-800">
            <EditProfileForm currentUser={currentUser} />
          </div>
        </div>
      </div>
    </div>
  )
}
