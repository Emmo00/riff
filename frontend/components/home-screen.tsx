"use client"

import { useState } from "react"
import { AIDiscoveryCard } from "@/components/ai-discovery-card"
import { RecentlyPlayed } from "@/components/recently-played"
import { RecommendedArtists } from "@/components/recommended-artists"
import { TrendingTracks } from "@/components/trending-tracks"
import { SearchResults } from "@/components/search-results"

export function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchResults, setShowSearchResults] = useState(false)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setShowSearchResults(query.length > 0)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setShowSearchResults(false)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#121212]/95 backdrop-blur-sm border-b border-gray-800">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#1DB954] rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-lg">R</span>
              </div>
              <h1 className="text-2xl font-bold">Riff</h1>
            </div>
            <div className="text-sm text-gray-400">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 space-y-8 pb-8">
        {/* AI Discovery Card - Top Priority */}
        <AIDiscoveryCard onSearch={handleSearch} />

        {/* Search Results (when active) */}
        {showSearchResults && <SearchResults query={searchQuery} onClear={handleClearSearch} />}

        {/* Main Content (hidden when searching) */}
        {!showSearchResults && (
          <>
            {/* Recently Played */}
            <RecentlyPlayed />

            {/* Recommended Artists */}
            <RecommendedArtists />

            {/* Trending This Week */}
            <TrendingTracks />
          </>
        )}
      </div>
    </div>
  )
}
