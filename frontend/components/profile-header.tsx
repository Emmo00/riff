"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Users, Music, Coins } from "lucide-react"
import { useState } from "react"

interface User {
  id: string
  username: string
  bio: string
  profileId: string
  avatar: string
  totalEarnings: string
  tokenSymbol: string
  followerCount: number
  followingCount: number
  trackCount: number
  isOwnProfile: boolean
}

interface ProfileHeaderProps {
  user: User
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(false)

  return (
    <div className="relative">
      {/* Background gradient */}
      <div className="h-80 bg-gradient-to-b from-[#1DB954]/20 to-[#121212] absolute inset-x-0 top-0" />

      <div className="relative px-4 md:px-6 lg:px-8 pt-8 pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            {/* Avatar */}
            <div className="relative">
              <Image
                src={user.avatar || "/placeholder.svg"}
                alt={`${user.username} avatar`}
                width={200}
                height={200}
                className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-4 border-[#121212] shadow-2xl"
              />
              <div className="absolute inset-0 rounded-full bg-black/20" />
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              <div className="mb-2">
                <Badge  className="bg-[#1DB954] text-black font-semibold mb-2">
                  Artist
                </Badge>
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 break-words">{user.username}</h1>

              {user.bio && (
                <p className="text-gray-300 text-sm md:text-base mb-4 max-w-2xl leading-relaxed">{user.bio}</p>
              )}

              {/* Profile ID */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 font-mono">Profile ID: {user.profileId}</p>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm mb-6">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span className="font-semibold">{user.followerCount.toLocaleString()}</span>
                  <span className="text-gray-400">followers</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold">{user.followingCount.toLocaleString()}</span>
                  <span className="text-gray-400">following</span>
                </div>
                <div className="flex items-center gap-1">
                  <Music className="w-4 h-4" />
                  <span className="font-semibold">{user.trackCount}</span>
                  <span className="text-gray-400">tracks</span>
                </div>
                <div className="flex items-center gap-1">
                  <Coins className="w-4 h-4 text-[#1DB954]" />
                  <span className="font-semibold text-[#1DB954]">{user.totalEarnings}</span>
                  <span className="text-gray-400">{user.tokenSymbol} earned</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {user.isOwnProfile ? (
                  <Button className="bg-transparent border border-gray-600 hover:border-white text-white hover:bg-white/10">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold px-8"
                      onClick={() => setIsFollowing(!isFollowing)}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </Button>
                    <Button className="bg-transparent border border-gray-600 hover:border-white text-white hover:bg-white/10">
                      Message
                    </Button>
                  </>
                )}
                <Button className="bg-transparent border border-gray-600 hover:border-white text-white hover:bg-white/10">
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
