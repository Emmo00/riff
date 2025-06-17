"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Play, Users, Music } from "lucide-react"

// Mock search results
const getSearchResults = (query: string) => ({
  tracks: [
    {
      id: "1",
      title: "Afrobeat Vibes",
      artist: "AfroKing",
      coverArt: "/placeholder.svg?height=60&width=60",
      duration: "3:45",
    },
    {
      id: "2",
      title: "Hype Energy",
      artist: "BeatMaster",
      coverArt: "/placeholder.svg?height=60&width=60",
      duration: "4:12",
    },
  ],
  artists: [
    {
      id: "1",
      name: "Burna Boy Style",
      avatar: "/placeholder.svg?height=60&width=60",
      followers: "25.3K",
    },
    {
      id: "2",
      name: "AfroVibes",
      avatar: "/placeholder.svg?height=60&width=60",
      followers: "18.7K",
    },
  ],
})

interface SearchResultsProps {
  query: string
  onClear: () => void
}

export function SearchResults({ query, onClear }: SearchResultsProps) {
  const results = getSearchResults(query)

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Results for "{query}"</h2>
        <Button
          onClick={onClear}
          
          className="bg-transparent hover:bg-white/10 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Tracks Results */}
      {results.tracks.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Music className="w-5 h-5 text-[#1DB954]" />
            Tracks
          </h3>
          <div className="space-y-2">
            {results.tracks.map((track) => (
              <Link key={track.id} href={`/track/${track.id}`}>
                <Card className="bg-[#181818] border-gray-800 hover:bg-[#282828] transition-colors">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={track.coverArt || "/placeholder.svg"}
                        alt={`${track.title} cover`}
                        width={60}
                        height={60}
                        className="w-15 h-15 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white truncate">{track.title}</h4>
                        <p className="text-sm text-gray-400 truncate">{track.artist}</p>
                        <p className="text-xs text-gray-500">{track.duration}</p>
                      </div>
                      <Button  className="w-10 h-10 bg-[#1DB954] hover:bg-[#1ed760] text-black">
                        <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Artists Results */}
      {results.artists.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-[#1DB954]" />
            Artists
          </h3>
          <div className="space-y-2">
            {results.artists.map((artist) => (
              <Link key={artist.id} href={`/profile/${artist.id}`}>
                <Card className="bg-[#181818] border-gray-800 hover:bg-[#282828] transition-colors">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={artist.avatar || "/placeholder.svg"}
                        alt={`${artist.name} avatar`}
                        width={60}
                        height={60}
                        className="w-15 h-15 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white truncate">{artist.name}</h4>
                        <p className="text-sm text-gray-400">{artist.followers} followers</p>
                        <p className="text-xs text-gray-500">Artist</p>
                      </div>
                      <Button
                        
                        className="border-gray-600 hover:border-[#1DB954] text-white hover:bg-[#1DB954]/20"
                      >
                        Follow
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
