"use client"
import { Users, Percent } from "lucide-react"

interface Contributor {
  id: string
  name: string
  address: string
  share: number
}

interface ContributorPanelProps {
  contributors: Contributor[]
}

export function ContributorPanel({ contributors }: ContributorPanelProps) {
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="bg-[#181818] rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-[#1DB954]" />
        <h3 className="text-xl font-semibold">Contributors</h3>
      </div>

      <div className="space-y-3">
        {contributors.map((contributor) => (
          <div key={contributor.id} className="flex items-center justify-between p-3 bg-[#2a2a2a] rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1DB954]/20 rounded-full flex items-center justify-center">
                <span className="text-[#1DB954] font-semibold text-sm">{contributor.name.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <p className="font-medium text-white">{contributor.name}</p>
                <p className="text-xs text-gray-500 font-mono">{truncateAddress(contributor.address)}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[#1DB954] font-semibold">
              <Percent className="w-4 h-4" />
              <span>{contributor.share}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-[#2a2a2a] rounded-lg">
        <p className="text-xs text-gray-400">
          Revenue is automatically distributed to contributors based on their share percentage when earnings are
          generated.
        </p>
      </div>
    </div>
  )
}
