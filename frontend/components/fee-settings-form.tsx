"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import {
  Play,
  Heart,
  MessageCircle,
  TrendingUp,
  Info,
  Loader2,
  CheckCircle,
  DollarSign,
  Settings,
  Zap,
} from "lucide-react"

interface FeeData {
  playFee: string
  likeFee: string
  commentFee: string
  bangerFee: string
}

interface FeeErrors {
  playFee?: string
  likeFee?: string
  commentFee?: string
  bangerFee?: string
}

export function FeeSettingsForm() {
  const { toast } = useToast()

  // Current fees (would come from blockchain/API)
  const [currentFees, setCurrentFees] = useState<FeeData>({
    playFee: "0.1",
    likeFee: "0.5",
    commentFee: "1.0",
    bangerFee: "2.0",
  })

  const [formData, setFormData] = useState<FeeData>(currentFees)
  const [errors, setErrors] = useState<FeeErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [txStatus, setTxStatus] = useState<"idle" | "saving" | "sent" | "confirmed">("idle")
  const [useUniformFee, setUseUniformFee] = useState(false)
  const [uniformFee, setUniformFee] = useState("1.0")

  const validateForm = (): boolean => {
    const newErrors: FeeErrors = {}

    // Validate each fee
    Object.entries(formData).forEach(([key, value]) => {
      const numValue = Number.parseFloat(value)
      if (isNaN(numValue)) {
        newErrors[key as keyof FeeErrors] = "Please enter a valid number"
      } else if (numValue < 0) {
        newErrors[key as keyof FeeErrors] = "Fee cannot be negative"
      } else if (numValue > 1000) {
        newErrors[key as keyof FeeErrors] = "Fee cannot exceed 1000 tokens"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FeeData, value: string) => {
    // Allow only numbers and decimal points
    const sanitizedValue = value.replace(/[^0-9.]/g, "")

    setFormData((prev) => ({ ...prev, [field]: sanitizedValue }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleUniformFeeToggle = (enabled: boolean) => {
    setUseUniformFee(enabled)
    if (enabled) {
      // Apply uniform fee to all fields
      const fee = uniformFee
      setFormData({
        playFee: fee,
        likeFee: fee,
        commentFee: fee,
        bangerFee: fee,
      })
    }
  }

  const handleUniformFeeChange = (value: string) => {
    const sanitizedValue = value.replace(/[^0-9.]/g, "")
    setUniformFee(sanitizedValue)

    if (useUniformFee) {
      setFormData({
        playFee: sanitizedValue,
        likeFee: sanitizedValue,
        commentFee: sanitizedValue,
        bangerFee: sanitizedValue,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setTxStatus("saving")

    try {
      // Simulate smart contract interaction
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setTxStatus("sent")

      // Simulate transaction confirmation
      await new Promise((resolve) => setTimeout(resolve, 3000))
      setTxStatus("confirmed")

      // Update current fees
      setCurrentFees({ ...formData })

      toast({
        title: "Fees Updated Successfully! 🎉",
        description: "Your interaction fees have been saved to the blockchain.",
        duration: 5000,
      })

      // Reset status after success
      setTimeout(() => {
        setTxStatus("idle")
      }, 2000)
    } catch (error) {
      setTxStatus("idle")
      toast({
        title: "Transaction Failed",
        description: "Failed to update fees. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(currentFees)

  const getStatusMessage = () => {
    switch (txStatus) {
      case "saving":
        return "Preparing transaction..."
      case "sent":
        return "Transaction sent to blockchain..."
      case "confirmed":
        return "Fees updated successfully!"
      default:
        return ""
    }
  }

  const getStatusIcon = () => {
    switch (txStatus) {
      case "saving":
      case "sent":
        return <Loader2 className="w-4 h-4 animate-spin" />
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-[#1DB954]" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Info Box */}
      <Alert className="border-[#1DB954]/30 bg-[#1DB954]/10">
        <Info className="h-4 w-4 text-[#1DB954]" />
        <AlertDescription className="text-gray-300">
          <strong>How interaction fees work:</strong> Fans pay these token amounts every time they interact with your
          music. These fees are automatically transferred to your wallet and help monetize your content directly from
          fan engagement.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Uniform Fee Section */}
        <Card className="bg-[#181818] border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#1DB954]" />
              Quick Setup
            </CardTitle>
            <CardDescription>Set the same fee for all interactions, or configure each one individually</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">Apply same fee to all interactions</Label>
                <p className="text-sm text-gray-400">Use one fee amount for all fan actions</p>
              </div>
              <Switch
                checked={useUniformFee}
                onCheckedChange={handleUniformFeeToggle}
                className="data-[state=checked]:bg-[#1DB954]"
              />
            </div>

            {useUniformFee && (
              <div className="space-y-2">
                <Label htmlFor="uniformFee">Uniform Fee Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="uniformFee"
                    type="text"
                    placeholder="1.0"
                    value={uniformFee}
                    onChange={(e) => handleUniformFeeChange(e.target.value)}
                    className="pl-10 bg-[#2a2a2a] border-gray-600 text-white placeholder-gray-400 focus:border-[#1DB954] focus:ring-[#1DB954]"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400">
                    RIFF
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Individual Fee Settings */}
        <Card className="bg-[#181818] border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#1DB954]" />
              Interaction Fees
            </CardTitle>
            <CardDescription>Configure how much fans pay for each type of interaction</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Play Fee */}
            <div className="space-y-2">
              <Label htmlFor="playFee" className="flex items-center gap-2 text-base font-medium">
                <Play className="w-4 h-4 text-[#1DB954]" />
                Fee Per Play
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="playFee"
                  type="text"
                  placeholder="0.1"
                  value={formData.playFee}
                  onChange={(e) => handleInputChange("playFee", e.target.value)}
                  disabled={useUniformFee}
                  className={`pl-10 bg-[#2a2a2a] border-gray-600 text-white placeholder-gray-400 focus:border-[#1DB954] focus:ring-[#1DB954] ${
                    errors.playFee ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                  } ${useUniformFee ? "opacity-50" : ""}`}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400">RIFF</span>
              </div>
              {errors.playFee && <p className="text-red-400 text-sm">{errors.playFee}</p>}
              <p className="text-xs text-gray-500">Amount fans pay each time they play your track</p>
            </div>

            {/* Like Fee */}
            <div className="space-y-2">
              <Label htmlFor="likeFee" className="flex items-center gap-2 text-base font-medium">
                <Heart className="w-4 h-4 text-red-400" />
                Fee Per Like
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="likeFee"
                  type="text"
                  placeholder="0.5"
                  value={formData.likeFee}
                  onChange={(e) => handleInputChange("likeFee", e.target.value)}
                  disabled={useUniformFee}
                  className={`pl-10 bg-[#2a2a2a] border-gray-600 text-white placeholder-gray-400 focus:border-[#1DB954] focus:ring-[#1DB954] ${
                    errors.likeFee ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                  } ${useUniformFee ? "opacity-50" : ""}`}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400">RIFF</span>
              </div>
              {errors.likeFee && <p className="text-red-400 text-sm">{errors.likeFee}</p>}
              <p className="text-xs text-gray-500">Amount fans pay when they like your track</p>
            </div>

            {/* Comment Fee */}
            <div className="space-y-2">
              <Label htmlFor="commentFee" className="flex items-center gap-2 text-base font-medium">
                <MessageCircle className="w-4 h-4 text-blue-400" />
                Fee Per Comment
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="commentFee"
                  type="text"
                  placeholder="1.0"
                  value={formData.commentFee}
                  onChange={(e) => handleInputChange("commentFee", e.target.value)}
                  disabled={useUniformFee}
                  className={`pl-10 bg-[#2a2a2a] border-gray-600 text-white placeholder-gray-400 focus:border-[#1DB954] focus:ring-[#1DB954] ${
                    errors.commentFee ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                  } ${useUniformFee ? "opacity-50" : ""}`}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400">RIFF</span>
              </div>
              {errors.commentFee && <p className="text-red-400 text-sm">{errors.commentFee}</p>}
              <p className="text-xs text-gray-500">Amount fans pay when they comment on your track</p>
            </div>

            {/* Banger Fee */}
            <div className="space-y-2">
              <Label htmlFor="bangerFee" className="flex items-center gap-2 text-base font-medium">
                <TrendingUp className="w-4 h-4 text-orange-400" />
                Fee For Banger
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="bangerFee"
                  type="text"
                  placeholder="2.0"
                  value={formData.bangerFee}
                  onChange={(e) => handleInputChange("bangerFee", e.target.value)}
                  disabled={useUniformFee}
                  className={`pl-10 bg-[#2a2a2a] border-gray-600 text-white placeholder-gray-400 focus:border-[#1DB954] focus:ring-[#1DB954] ${
                    errors.bangerFee ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                  } ${useUniformFee ? "opacity-50" : ""}`}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400">RIFF</span>
              </div>
              {errors.bangerFee && <p className="text-red-400 text-sm">{errors.bangerFee}</p>}
              <p className="text-xs text-gray-500">Amount fans pay when they mark your track as a banger</p>
            </div>
          </CardContent>
        </Card>

        {/* Status Message */}
        {txStatus !== "idle" && (
          <Alert className="border-[#1DB954]/30 bg-[#1DB954]/10">
            {getStatusIcon()}
            <AlertDescription className="text-gray-300 ml-2">{getStatusMessage()}</AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="submit"
            disabled={!hasChanges || isLoading}
            className="flex-1 bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold py-3 text-base disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating Fees...
              </>
            ) : (
              "Save Configuration"
            )}
          </Button>

          <Button
            type="button"
            onClick={() => setFormData(currentFees)}
            disabled={!hasChanges || isLoading}
            className="flex-1 bg-transparent border border-gray-600 hover:border-white text-white hover:bg-white/10 font-semibold py-3 text-base transition-all duration-200"
          >
            Reset Changes
          </Button>
        </div>

        {/* Changes Indicator */}
        {hasChanges && txStatus === "idle" && (
          <div className="text-center">
            <p className="text-sm text-yellow-400 flex items-center justify-center gap-1">
              <Info className="w-3 h-3" />
              You have unsaved changes
            </p>
          </div>
        )}

        {/* Fee Preview */}
        <Card className="bg-[#2a2a2a] border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg">Fee Preview</CardTitle>
            <CardDescription>Current fee structure for fan interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-1">
                <Play className="w-6 h-6 text-[#1DB954] mx-auto" />
                <p className="text-sm text-gray-400">Play</p>
                <p className="font-semibold">{formData.playFee} RIFF</p>
              </div>
              <div className="space-y-1">
                <Heart className="w-6 h-6 text-red-400 mx-auto" />
                <p className="text-sm text-gray-400">Like</p>
                <p className="font-semibold">{formData.likeFee} RIFF</p>
              </div>
              <div className="space-y-1">
                <MessageCircle className="w-6 h-6 text-blue-400 mx-auto" />
                <p className="text-sm text-gray-400">Comment</p>
                <p className="font-semibold">{formData.commentFee} RIFF</p>
              </div>
              <div className="space-y-1">
                <TrendingUp className="w-6 h-6 text-orange-400 mx-auto" />
                <p className="text-sm text-gray-400">Banger</p>
                <p className="font-semibold">{formData.bangerFee} RIFF</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
