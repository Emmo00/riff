"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { MessageCircle, Send, Trash2, ChevronDown, ChevronUp } from "lucide-react"

interface Comment {
  id: string
  author: {
    name: string
    address: string
    avatar: string
  }
  message: string
  timestamp: string
  isOwn: boolean
}

interface CommentSectionProps {
  comments: Comment[]
  isVisible: boolean
  onToggle: () => void
}

export function CommentSection({ comments, isVisible, onToggle }: CommentSectionProps) {
  const { toast } = useToast()
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [commentList, setCommentList] = useState(comments)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const comment: Comment = {
      id: Date.now().toString(),
      author: {
        name: "You",
        address: "0x742d35Cc...1681",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      message: newComment,
      timestamp: new Date().toISOString(),
      isOwn: true,
    }

    setCommentList([comment, ...commentList])
    setNewComment("")
    setIsSubmitting(false)

    toast({
      title: "Comment Posted!",
      description: "Your comment has been added to the track.",
    })
  }

  const handleDelete = (commentId: string) => {
    setCommentList(commentList.filter((c) => c.id !== commentId))
    toast({
      title: "Comment Deleted",
      description: "Your comment has been removed.",
    })
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return date.toLocaleDateString()
  }

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="bg-[#181818] rounded-2xl p-6">
      {/* Header */}
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left mb-4 hover:text-[#1DB954] transition-colors"
      >
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          <h3 className="text-xl font-semibold">Comments ({commentList.length})</h3>
        </div>
        {isVisible ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {isVisible && (
        <div className="space-y-6">
          {/* Add Comment Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
              placeholder="Share your thoughts about this track..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="bg-[#2a2a2a] border-gray-600 text-white placeholder-gray-400 focus:border-[#1DB954] focus:ring-[#1DB954] min-h-[80px] resize-none"
              maxLength={500}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{newComment.length}/500</span>
              <Button
                type="submit"
                disabled={!newComment.trim() || isSubmitting}
                className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold"
              >
                {isSubmitting ? (
                  "Posting..."
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Post Comment
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {commentList.map((comment) => (
              <div key={comment.id} className="flex gap-3 p-4 bg-[#2a2a2a] rounded-lg">
                <Image
                  src={comment.author.avatar || "/placeholder.svg"}
                  alt={comment.author.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{comment.author.name}</span>
                      <span className="text-xs text-gray-500 font-mono">{truncateAddress(comment.author.address)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{formatTimestamp(comment.timestamp)}</span>
                      {comment.isOwn && (
                        <Button
                          onClick={() => handleDelete(comment.id)}
                          size="icon"
                          className="w-6 h-6 bg-transparent hover:bg-red-500/20 text-gray-400 hover:text-red-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{comment.message}</p>
                </div>
              </div>
            ))}

            {commentList.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
