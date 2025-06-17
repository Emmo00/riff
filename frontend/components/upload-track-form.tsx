"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { FileUpload } from "@/components/file-upload"
import { TagInput } from "@/components/tag-input"
import { Loader2, Upload, CheckCircle, Hash } from "lucide-react"

interface FormData {
  audioFile: File | null
  title: string
  description: string
  genre: string
  tags: string[]
}

interface FormErrors {
  audioFile?: string
  title?: string
  genre?: string
  tags?: string
}

const genres = [
  "Electronic",
  "Hip Hop",
  "Pop",
  "Rock",
  "Jazz",
  "Classical",
  "R&B",
  "Country",
  "Folk",
  "Reggae",
  "Blues",
  "Funk",
  "House",
  "Techno",
  "Dubstep",
  "Ambient",
  "Experimental",
  "Lo-fi",
]

// Predefined popular tags for suggestions
const popularTags = [
  "chill",
  "upbeat",
  "emotional",
  "energetic",
  "relaxing",
  "party",
  "workout",
  "study",
  "driving",
  "romantic",
  "sad",
  "happy",
  "aggressive",
  "mellow",
  "atmospheric",
  "danceable",
  "instrumental",
  "vocal",
  "remix",
  "original",
  "collaboration",
  "freestyle",
  "live",
  "acoustic",
  "electric",
  "synthesized",
  "organic",
  "digital",
  "analog",
  "vintage",
  "modern",
  "futuristic",
  "nostalgic",
  "dark",
  "bright",
  "heavy",
  "light",
  "fast",
  "slow",
  "melodic",
  "rhythmic",
  "harmonic",
  "experimental",
]

export function UploadTrackForm() {
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState<FormData>({
    audioFile: null,
    title: "",
    description: "",
    genre: "",
    tags: [],
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isSuccess, setIsSuccess] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Audio file validation
    if (!formData.audioFile) {
      newErrors.audioFile = "Please select an audio file"
    }

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Track title is required"
    } else if (formData.title.trim().length < 2) {
      newErrors.title = "Track title must be at least 2 characters"
    } else if (formData.title.trim().length > 100) {
      newErrors.title = "Track title must be less than 100 characters"
    }

    // Genre validation
    if (!formData.genre) {
      newErrors.genre = "Please select a genre"
    }

    // Tags validation
    if (formData.tags.length > 10) {
      newErrors.tags = "Maximum 10 tags allowed"
    }

    // Validate individual tags
    const invalidTags = formData.tags.filter((tag) => tag.length > 20 || tag.length < 2)
    if (invalidTags.length > 0) {
      newErrors.tags = "Tags must be between 2-20 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string | File | null | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when user makes changes
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleFileSelect = useCallback((file: File | null) => {
    handleInputChange("audioFile", file)
  }, [])

  const handleTagsChange = (tags: string[]) => {
    handleInputChange("tags", tags)
  }

  const simulateUploadProgress = () => {
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    simulateUploadProgress()

    try {
      // Simulate file upload and processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      setIsSuccess(true)

      toast({
        title: "Track Uploaded Successfully! 🎵",
        description: `"${formData.title}" has been uploaded to the blockchain with ${formData.tags.length} tags.`,
        duration: 5000,
      })

      // Redirect after success
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
      setUploadProgress(0)
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = formData.audioFile && formData.title.trim().length >= 2 && formData.genre

  if (isSuccess) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-20 h-20 text-[#1DB954] mx-auto mb-6" />
        <h2 className="text-2xl font-bold mb-2">Track Uploaded Successfully!</h2>
        <p className="text-gray-400 mb-4">Your track "{formData.title}" is now live on the blockchain.</p>
        {formData.tags.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">Tags added:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {formData.tags.map((tag, index) => (
                <Badge key={index}  className="bg-[#1DB954]/20 text-[#1DB954]">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
        <div className="animate-pulse text-sm text-gray-500">Redirecting to dashboard...</div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* File Upload */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Audio File <span className="text-red-400">*</span>
        </Label>
        <FileUpload onFileSelect={handleFileSelect} error={errors.audioFile} />
        {errors.audioFile && <p className="text-red-400 text-sm">{errors.audioFile}</p>}
      </div>

      {/* Track Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">
          Track Title <span className="text-red-400">*</span>
        </Label>
        <Input
          id="title"
          type="text"
          placeholder="Enter your track title"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          className={`bg-[#2a2a2a] border-gray-600 text-white placeholder-gray-400 focus:border-[#1DB954] focus:ring-[#1DB954] ${
            errors.title ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
          }`}
          maxLength={100}
        />
        {errors.title && <p className="text-red-400 text-sm">{errors.title}</p>}
        <div className="text-right text-xs text-gray-500">{formData.title.length}/100</div>
      </div>

      {/* Genre Selection */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Genre <span className="text-red-400">*</span>
        </Label>
        <Select value={formData.genre} onValueChange={(value :any) => handleInputChange("genre", value)}>
          <SelectTrigger
            className={`bg-[#2a2a2a] border-gray-600 text-white focus:border-[#1DB954] focus:ring-[#1DB954] ${
              errors.genre ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
            }`}
          >
            <SelectValue placeholder="Select a genre" />
          </SelectTrigger>
          <SelectContent className="bg-[#2a2a2a] border-gray-600">
            {genres.map((genre) => (
              <SelectItem key={genre} value={genre} className="text-white hover:bg-[#1DB954]/20">
                {genre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.genre && <p className="text-red-400 text-sm">{errors.genre}</p>}
      </div>

      {/* Tags Section */}
      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Hash className="w-4 h-4 text-[#1DB954]" />
          Tags <span className="text-gray-500">(optional)</span>
        </Label>
        <TagInput
          tags={formData.tags}
          onTagsChange={handleTagsChange}
          suggestions={popularTags}
          maxTags={10}
          placeholder="Add tags to help people discover your track..."
        />
        {errors.tags && <p className="text-red-400 text-sm">{errors.tags}</p>}
        <div className="flex justify-between text-xs text-gray-500">
          <span>Tags help listeners discover your music</span>
          <span>{formData.tags.length}/10 tags</span>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Description <span className="text-gray-500">(optional)</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Tell listeners about your track, inspiration, or story behind it..."
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          className="bg-[#2a2a2a] border-gray-600 text-white placeholder-gray-400 focus:border-[#1DB954] focus:ring-[#1DB954] min-h-[100px] resize-none"
          maxLength={500}
        />
        <div className="text-right text-xs text-gray-500">{formData.description.length}/500</div>
      </div>

      {/* Upload Progress */}
      {isLoading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Uploading to blockchain...</span>
            <span className="text-[#1DB954]">{Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-[#1DB954] h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!isFormValid || isLoading}
        className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold py-3 text-base disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-200"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Uploading Track...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            Upload Track
          </>
        )}
      </Button>

      {/* Helper Text */}
      <p className="text-xs text-gray-500 text-center">
        By uploading, you agree to our{" "}
        <a href="/terms" className="text-[#1DB954] hover:underline">
          Terms of Service
        </a>{" "}
        and confirm you own the rights to this content.
      </p>
    </form>
  )
}
