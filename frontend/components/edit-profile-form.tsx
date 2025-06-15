"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle, AlertCircle, User } from "lucide-react"
import Image from "next/image"

interface User {
  id: string
  username: string
  bio: string
  avatar: string
}

interface FormData {
  name: string
  bio: string
}

interface FormErrors {
  name?: string
  bio?: string
}

interface EditProfileFormProps {
  currentUser: User
}

export function EditProfileForm({ currentUser }: EditProfileFormProps) {
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState<FormData>({
    name: currentUser.username,
    bio: currentUser.bio,
  })

  const [originalData, setOriginalData] = useState<FormData>({
    name: currentUser.username,
    bio: currentUser.bio,
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Check if form has changes
  useEffect(() => {
    const changed = formData.name !== originalData.name || formData.bio !== originalData.bio
    setHasChanges(changed)
  }, [formData, originalData])

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

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }

    // Hide success message when user makes changes
    if (showSuccess) {
      setShowSuccess(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (!hasChanges) {
      toast({
        title: "No Changes Made",
        description: "Your profile is already up to date.",
        variant: "default",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update original data to reflect saved state
      setOriginalData({ ...formData })
      setShowSuccess(true)

      toast({
        title: "Profile Updated Successfully! ✨",
        description: "Your changes have been saved.",
        duration: 3000,
      })

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false)
      }, 5000)
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (hasChanges) {
      const confirmLeave = window.confirm("You have unsaved changes. Are you sure you want to leave?")
      if (!confirmLeave) return
    }
    router.push("/profile/me")
  }

  const isFormValid = formData.name.trim().length >= 2 && formData.name.trim().length <= 50

  return (
    <div className="space-y-6">
      {/* Success Alert */}
      {showSuccess && (
        <Alert className="border-[#1DB954] bg-[#1DB954]/10 text-[#1DB954]">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>Your profile has been updated successfully!</AlertDescription>
        </Alert>
      )}

      {/* Profile Preview */}
      <div className="flex items-center gap-4 p-4 bg-[#2a2a2a] rounded-lg">
        <Image
          src={currentUser.avatar || "/placeholder.svg"}
          alt="Profile avatar"
          width={60}
          height={60}
          className="w-15 h-15 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate">{formData.name || "Artist Name"}</h3>
          <p className="text-gray-400 text-sm line-clamp-2">{formData.bio || "No bio added yet"}</p>
        </div>
        <User className="w-5 h-5 text-gray-500" />
      </div>

      <form onSubmit={handleSave} className="space-y-6">
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
          {errors.name && (
            <p className="text-red-400 text-sm flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.name}
            </p>
          )}
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
            className={`bg-[#2a2a2a] border-gray-600 text-white placeholder-gray-400 focus:border-[#1DB954] focus:ring-[#1DB954] min-h-[120px] resize-none ${
              errors.bio ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
            }`}
            maxLength={500}
          />
          {errors.bio && (
            <p className="text-red-400 text-sm flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.bio}
            </p>
          )}
          <div className="text-right text-xs text-gray-500">{formData.bio.length}/500</div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="submit"
            disabled={!isFormValid || isLoading || !hasChanges}
            className="flex-1 bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold py-3 text-base disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving Changes...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>

          <Button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1 bg-transparent border border-gray-600 hover:border-white text-white hover:bg-white/10 font-semibold py-3 text-base transition-all duration-200"
          >
            Cancel
          </Button>
        </div>

        {/* Changes Indicator */}
        {hasChanges && (
          <div className="text-center">
            <p className="text-sm text-yellow-400 flex items-center justify-center gap-1">
              <AlertCircle className="w-3 h-3" />
              You have unsaved changes
            </p>
          </div>
        )}
      </form>
    </div>
  )
}
