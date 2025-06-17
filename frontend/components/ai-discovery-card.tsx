"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Sparkles, Send, Loader2, Music, Mic, TrendingUp } from "lucide-react"

interface AIDiscoveryCardProps {
  onSearch: (query: string) => void
}

const suggestionPrompts = [
  "Give me hype Afrobeat",
  "Show artists like Burna Boy",
  "Chill lo-fi for studying",
  "Underground hip-hop gems",
  "Electronic dance bangers",
  "Soulful R&B vibes",
]

export function AIDiscoveryCard({ onSearch }: AIDiscoveryCardProps) {
  const { toast } = useToast()
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Enter a prompt",
        description: "Tell Riff AI what kind of music you're looking for",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      // Simulate AI processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Trigger search with the AI prompt
      onSearch(prompt)

      toast({
        title: "AI Recommendations Generated! 🎵",
        description: `Found tracks matching "${prompt}"`,
      })
    } catch (error) {
      toast({
        title: "AI Generation Failed",
        description: "Please try again with a different prompt",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleGenerate()
    }
  }

  return (
    <Card className="bg-gradient-to-br from-[#1DB954]/20 to-[#1DB954]/5 border-[#1DB954]/30 shadow-lg">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 text-[#1DB954]" />
              <h2 className="text-2xl font-bold">What do you want to listen to today?</h2>
            </div>
            <p className="text-gray-400">Ask Riff AI for a vibe or an artist suggestion</p>
          </div>

          {/* AI Prompt Input */}
          <div className="space-y-3">
            <div className="relative">
              <Input
                type="text"
                placeholder="e.g., 'Give me hype Afrobeat' or 'Show artists like Burna Boy'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-[#2a2a2a] border-gray-600 text-white placeholder-gray-400 focus:border-[#1DB954] focus:ring-[#1DB954] pr-12 h-12 text-base"
                disabled={isGenerating}
              />
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                
                className="absolute right-1 top-1 h-10 w-10 bg-[#1DB954] hover:bg-[#1ed760] text-black"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>

            {/* Quick Suggestions */}
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Try these suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestionPrompts.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-1.5 bg-[#2a2a2a] hover:bg-[#1DB954]/20 border border-gray-600 hover:border-[#1DB954] rounded-full text-sm text-gray-300 hover:text-white transition-all duration-200"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Features Preview */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
            <div className="text-center space-y-1">
              <Music className="w-5 h-5 text-[#1DB954] mx-auto" />
              <p className="text-xs text-gray-400">Smart Discovery</p>
            </div>
            <div className="text-center space-y-1">
              <Mic className="w-5 h-5 text-[#1DB954] mx-auto" />
              <p className="text-xs text-gray-400">Artist Matching</p>
            </div>
            <div className="text-center space-y-1">
              <TrendingUp className="w-5 h-5 text-[#1DB954] mx-auto" />
              <p className="text-xs text-gray-400">Trend Analysis</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
