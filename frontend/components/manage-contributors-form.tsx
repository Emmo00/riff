"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  Music,
  Users,
  Edit,
  Trash2,
  Plus,
  Info,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Percent,
  Copy,
} from "lucide-react"

interface Track {
  id: string
  title: string
  artist: string
  coverArt: string
  cid: string
  duration: string
  uploadDate: string
}

interface Contributor {
  id: string
  address: string
  name: string
  percentage: number
  role: string
  isOwner: boolean
}

interface ManageContributorsFormProps {
  track: Track
  initialContributors: Contributor[]
}

export function ManageContributorsForm({ track, initialContributors }: ManageContributorsFormProps) {
  const { toast } = useToast()
  const [contributors, setContributors] = useState<Contributor[]>(initialContributors)
  const [isLoading, setIsLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editPercentage, setEditPercentage] = useState("")

  // Add new contributor form state
  const [newContributor, setNewContributor] = useState({
    address: "",
    percentage: "",
  })
  const [formErrors, setFormErrors] = useState({
    address: "",
    percentage: "",
  })

  const totalAllocated = contributors.reduce((sum, contributor) => sum + contributor.percentage, 0)
  const remainingPercentage = 100 - totalAllocated

  const validateAddress = (address: string): boolean => {
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/
    return ethAddressRegex.test(address)
  }

  const validatePercentage = (percentage: string, excludeId?: string): boolean => {
    const numPercentage = Number.parseFloat(percentage)
    if (isNaN(numPercentage) || numPercentage <= 0 || numPercentage > 100) {
      return false
    }

    // Check if total would exceed 100%
    const currentTotal = contributors
      .filter((c) => c.id !== excludeId)
      .reduce((sum, contributor) => sum + contributor.percentage, 0)

    return currentTotal + numPercentage <= 100
  }

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "Address has been copied to your clipboard",
    })
  }

  const handleAddContributor = async () => {
    // Reset errors
    setFormErrors({ address: "", percentage: "" })

    // Validate inputs
    let hasErrors = false
    const errors = { address: "", percentage: "" }

    if (!newContributor.address) {
      errors.address = "Address is required"
      hasErrors = true
    } else if (!validateAddress(newContributor.address)) {
      errors.address = "Please enter a valid Ethereum address"
      hasErrors = true
    } else if (contributors.some((c) => c.address.toLowerCase() === newContributor.address.toLowerCase())) {
      errors.address = "This address is already a contributor"
      hasErrors = true
    }

    if (!newContributor.percentage) {
      errors.percentage = "Percentage is required"
      hasErrors = true
    } else if (!validatePercentage(newContributor.percentage)) {
      const numPercentage = Number.parseFloat(newContributor.percentage)
      if (isNaN(numPercentage) || numPercentage <= 0) {
        errors.percentage = "Please enter a valid percentage (1-100)"
      } else if (numPercentage > remainingPercentage) {
        errors.percentage = `Cannot exceed remaining ${remainingPercentage}%`
      } else {
        errors.percentage = "Invalid percentage"
      }
      hasErrors = true
    }

    if (hasErrors) {
      setFormErrors(errors)
      return
    }

    setIsLoading(true)

    try {
      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const contributor: Contributor = {
        id: Date.now().toString(),
        address: newContributor.address,
        name: `Contributor ${contributors.length + 1}`,
        percentage: Number.parseFloat(newContributor.percentage),
        role: "Contributor",
        isOwner: false,
      }

      setContributors([...contributors, contributor])
      setNewContributor({ address: "", percentage: "" })

      toast({
        title: "Contributor Added! 🎉",
        description: `${truncateAddress(contributor.address)} has been added with ${contributor.percentage}% share.`,
      })
    } catch (error) {
      toast({
        title: "Failed to Add Contributor",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditPercentage = async (contributorId: string) => {
    if (!validatePercentage(editPercentage, contributorId)) {
      toast({
        title: "Invalid Percentage",
        description: "Please enter a valid percentage that doesn't exceed 100% total.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setContributors(
        contributors.map((c) => (c.id === contributorId ? { ...c, percentage: Number.parseFloat(editPercentage) } : c)),
      )

      setEditingId(null)
      setEditPercentage("")

      toast({
        title: "Percentage Updated",
        description: "Contributor's share has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveContributor = async (contributorId: string) => {
    const contributor = contributors.find((c) => c.id === contributorId)
    if (!contributor || contributor.isOwner) return

    setIsLoading(true)

    try {
      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setContributors(contributors.filter((c) => c.id !== contributorId))

      toast({
        title: "Contributor Removed",
        description: `${truncateAddress(contributor.address)} has been removed from contributors.`,
      })
    } catch (error) {
      toast({
        title: "Removal Failed",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Track Info */}
      <Card className="bg-[#181818] border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-5 h-5 text-[#1DB954]" />
            Track Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Image
              src={track.coverArt || "/placeholder.svg"}
              alt={`${track.title} cover`}
              width={80}
              height={80}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-1">{track.title}</h3>
              <p className="text-gray-400 mb-2">by {track.artist}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{track.duration}</span>
                <span>•</span>
                <span>CID: {truncateAddress(track.cid)}</span>
                <Button
                  
                  onClick={() => copyToClipboard(track.cid)}
                  className="w-6 h-6 bg-transparent hover:bg-white/10 text-gray-400 hover:text-white"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Allocation Overview */}
      <Card className="bg-[#181818] border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Percent className="w-5 h-5 text-[#1DB954]" />
              Revenue Allocation
            </div>
            <Badge
              className={remainingPercentage === 0 ? "bg-[#1DB954] text-black" : "bg-yellow-500/20 text-yellow-400"}
            >
              {remainingPercentage}% remaining
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Allocated</span>
              <span className="font-semibold">{totalAllocated}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${
                  totalAllocated > 100 ? "bg-red-500" : "bg-[#1DB954]"
                }`}
                style={{ width: `${Math.min(totalAllocated, 100)}%` }}
              />
            </div>
            {totalAllocated > 100 && (
              <Alert className="border-red-500/30 bg-red-500/10">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-400">
                  Total allocation exceeds 100%. Please adjust contributor percentages.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Info Box */}
      <Alert className="border-[#1DB954]/30 bg-[#1DB954]/10">
        <Info className="h-4 w-4 text-[#1DB954]" />
        <AlertDescription className="text-gray-300">
          <strong>Revenue Sharing:</strong> You can split earnings with collaborators, producers, or managers. Revenue
          is automatically distributed based on these percentages when fans interact with your track. Make sure total
          allocation stays within 100%.
        </AlertDescription>
      </Alert>

      {/* Existing Contributors */}
      <Card className="bg-[#181818] border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#1DB954]" />
            Current Contributors ({contributors.length})
          </CardTitle>
          <CardDescription>Manage revenue sharing for track contributors</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {contributors.map((contributor) => (
            <div key={contributor.id} className="flex items-center justify-between p-4 bg-[#2a2a2a] rounded-lg">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 bg-[#1DB954]/20 rounded-full flex items-center justify-center">
                  <span className="text-[#1DB954] font-semibold text-sm">
                    {contributor.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-white">{contributor.name}</p>
                    {contributor.isOwner && <Badge className="bg-[#1DB954]/20 text-[#1DB954] text-xs">Owner</Badge>}
                    <Badge  className="text-xs">
                      {contributor.role}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-500 font-mono">{truncateAddress(contributor.address)}</p>
                    <Button
                      
                      onClick={() => copyToClipboard(contributor.address)}
                      className="w-4 h-4 bg-transparent hover:bg-white/10 text-gray-400 hover:text-white"
                    >
                      <Copy className="w-2 h-2" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {editingId === contributor.id ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      value={editPercentage}
                      onChange={(e) => setEditPercentage(e.target.value.replace(/[^0-9.]/g, ""))}
                      className="w-20 h-8 text-center bg-[#121212] border-gray-600 text-white"
                      placeholder="0"
                    />
                    <span className="text-sm text-gray-400">%</span>
                    <Button
                      
                      onClick={() => handleEditPercentage(contributor.id)}
                      disabled={isLoading}
                      className="w-8 h-8 bg-[#1DB954] hover:bg-[#1ed760] text-black"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                    <Button
                      
                      onClick={() => {
                        setEditingId(null)
                        setEditPercentage("")
                      }}
                      className="w-8 h-8 bg-transparent hover:bg-white/10 text-gray-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-semibold text-[#1DB954]">{contributor.percentage}%</p>
                    </div>
                    {!contributor.isOwner && (
                      <div className="flex gap-1">
                        <Button
                          
                          onClick={() => {
                            setEditingId(contributor.id)
                            setEditPercentage(contributor.percentage.toString())
                          }}
                          disabled={isLoading}
                          className="w-8 h-8 bg-transparent hover:bg-white/10 text-gray-400 hover:text-white"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          
                          onClick={() => handleRemoveContributor(contributor.id)}
                          disabled={isLoading}
                          className="w-8 h-8 bg-transparent hover:bg-red-500/20 text-gray-400 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Add New Contributor */}
      <Card className="bg-[#181818] border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-[#1DB954]" />
            Add New Contributor
          </CardTitle>
          <CardDescription>Add a collaborator and set their revenue share</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">Contributor Address</Label>
              <Input
                id="address"
                type="text"
                placeholder="0x742d35Cc6634C0532925a3b8D404d3aABF5f1681"
                value={newContributor.address}
                onChange={(e) => setNewContributor({ ...newContributor, address: e.target.value })}
                className={`bg-[#2a2a2a] border-gray-600 text-white placeholder-gray-400 focus:border-[#1DB954] focus:ring-[#1DB954] ${
                  formErrors.address ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                }`}
              />
              {formErrors.address && <p className="text-red-400 text-sm">{formErrors.address}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="percentage">Revenue Share (%)</Label>
              <div className="relative">
                <Input
                  id="percentage"
                  type="text"
                  placeholder="25"
                  value={newContributor.percentage}
                  onChange={(e) =>
                    setNewContributor({ ...newContributor, percentage: e.target.value.replace(/[^0-9.]/g, "") })
                  }
                  className={`bg-[#2a2a2a] border-gray-600 text-white placeholder-gray-400 focus:border-[#1DB954] focus:ring-[#1DB954] pr-8 ${
                    formErrors.percentage ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                  }`}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400">%</span>
              </div>
              {formErrors.percentage && <p className="text-red-400 text-sm">{formErrors.percentage}</p>}
            </div>
          </div>

          <Button
            onClick={handleAddContributor}
            disabled={isLoading || !newContributor.address || !newContributor.percentage || remainingPercentage <= 0}
            className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding Contributor...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add Contributor
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
