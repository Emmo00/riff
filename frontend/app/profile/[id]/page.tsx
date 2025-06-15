import { use } from "react"
import { Header } from "@/components/header"
import { ProfileHeader } from "@/components/profile-header"
import { UserTracks } from "@/components/user-tracks"

// Mock user data - in a real app, this would come from your API/blockchain
const getUserData = async  (id: string) => ({
  id,
  username: "CryptoBeats",
  bio: "Creating beats on the blockchain since 2021. Web3 music producer exploring the intersection of sound and decentralization.",
  profileId: "0x742d35Cc6634C0532925a3b8D404d3aABF5f1681",
  avatar: "/placeholder.svg?height=200&width=200",
  totalEarnings: "1,247.5",
  tokenSymbol: "RIFF",
  followerCount: 12847,
  followingCount: 234,
  trackCount: 28,
  isOwnProfile: true, // This would be determined by comparing with current user
})

interface ProfilePageProps {
  params: {
    id: string
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const user = await getUserData((await params).id)

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <Header />
      <main className="pt-16">
        <ProfileHeader user={user} />
        <div className="px-4 md:px-6 lg:px-8 pb-8">
          <div className="max-w-7xl mx-auto">
            <UserTracks userId={user.id} isOwnProfile={user.isOwnProfile} />
          </div>
        </div>
      </main>
    </div>
  )
}
