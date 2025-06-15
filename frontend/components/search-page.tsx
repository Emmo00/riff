"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { SearchResults } from "@/components/search-results"
import { Search, TrendingUp } from "lucide-react"

const trendingSearches = ["Afrobeat", "Lo-fi Hip Hop", "Electronic Dance", "Indie Rock", "Jazz Fusion", "Ambient Chill"]

export function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showResults, setShowResults] = useState(false)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setShowResults(query.length > 0)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setShowResults(false)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#121212]/95 backdrop-blur-sm border-b border-gray-800">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold mb-4">Search</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for tracks, artists, or genres..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 bg-[#2a2a2a] border-gray-600 text-white placeholder-gray-400 focus:border-[#1DB954] focus:ring-[#1DB954] h-12"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {showResults ? (
          <SearchResults query={searchQuery} onClear={handleClearSearch} />
        ) : (
          <div className="space-y-6">
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#1DB954]" />
                Trending Searches
              </h2>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(term)}
                    className="px-4 py-2 bg-[#181818] hover:bg-[#282828] border border-gray-700 hover:border-[#1DB954] rounded-full text-sm transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
