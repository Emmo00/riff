"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle } from "lucide-react"

interface FormData {
  name: string
  bio: string
  profilePic: File | null // Change to File for file input
}

interface FormErrors {
  name?: string
  bio?: string
}

export function RegisterForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    bio: "",
    profilePic: null
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Artist name is required"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Artist name must be at least 2 characters"
    } else if (formData.name.trim().length > 50) {
      newErrors.name = "Artist name must be less than 50 characters"
    }

    // Bio validation (optional but with limits)
    if (formData.bio.length > 500) {
      newErrors.bio = "Bio must be less than 500 characters"
    }

    // Add validation for profilePic if needed (optional, e.g., required or file type/size)

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Success state
      setIsSuccess(true)

      toast({
        title: "Profile Created Successfully! 🎉",
        description: `Welcome to Riff, ${formData.name}! Your artist profile is now live.`,
        duration: 5000,
      })

      // Redirect after success (in real app)
      setTimeout(() => {
        // router.push('/dashboard')
        console.log("Redirecting to dashboard...")
      }, 2000)
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = formData.name.trim().length >= 2 && formData.name.trim().length <= 50

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-[#1DB954] mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Welcome to Riff!</h2>
        <p className="text-gray-400 mb-4">Your artist profile has been created successfully.</p>
        <div className="animate-pulse text-sm text-gray-500">Redirecting to your dashboard...</div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          Artist Name <span className="text-red-400">*</span>
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter your artist name"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className={`bg-[#2a2a2a] border-gray-600 text-white placeholder-gray-400 focus:border-[#1DB954] focus:ring-[#1DB954] ${
            errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
          }`}
          maxLength={50}
        />
        {errors.name && <p className="text-red-400 text-sm flex items-center gap-1">{errors.name}</p>}
        <div className="text-right text-xs text-gray-500">{formData.name.length}/50</div>
      </div>

      {/* Bio Field */}
      <div className="space-y-2">
        <Label htmlFor="bio" className="text-sm font-medium">
          Bio <span className="text-gray-500">(optional)</span>
        </Label>
        <Textarea
          id="bio"
          placeholder="Tell your fans about yourself, your music style, and your journey..."
          value={formData.bio}
          onChange={(e) => handleInputChange("bio", e.target.value)}
          className={`bg-[#2a2a2a] border-gray-600 text-white placeholder-gray-400 focus:border-[#1DB954] focus:ring-[#1DB954] min-h-[100px] resize-none ${
            errors.bio ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
          }`}
          maxLength={500}
        />
        {errors.bio && <p className="text-red-400 text-sm flex items-center gap-1">{errors.bio}</p>}
        <div className="text-right text-xs text-gray-500">{formData.bio.length}/500</div>
      </div>

      {/* Profile Picture Field */}
      <div className="space-y-2">
        <Label htmlFor="profilePic" className="text-sm font-medium">
          Profile Picture <span className="text-gray-500">(Image file, IPFS upload recommended)</span>
        </Label>
        <Input
          id="profilePic"
          type="file"
          accept="image/*"
          onChange={(e) => handleInputChange("profilePic", e.target.files ? e.target.files[0] : null)}
          className="bg-[#2a2a2a] border-gray-600 text-white focus:border-[#1DB954] focus:ring-[#1DB954]"
        />
        {formData.profilePic && (
          <div className="text-xs text-gray-500">Selected: {formData.profilePic.name}</div>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!isFormValid || isLoading}
        className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold py-3 text-base disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-200"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Creating Profile...
          </>
        ) : (
          "Register"
        )}
      </Button>

      {/* Helper Text */}
      <p className="text-xs text-gray-500 text-center">
        By registering, you agree to our{" "}
        <a href="/terms" className="text-[#1DB954] hover:underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/privacy" className="text-[#1DB954] hover:underline">
          Privacy Policy
        </a>
      </p>
    </form>
  )
}
