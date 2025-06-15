"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Coins, TrendingUp, Wallet } from "lucide-react"

interface RevenuePanelProps {
  earnings: {
    total: string
    tokenSymbol: string
    canWithdraw: boolean
  }
}

export function RevenuePanel({ earnings }: RevenuePanelProps) {
  const { toast } = useToast()
  const [isWithdrawing, setIsWithdrawing] = useState(false)

  const handleWithdraw = async () => {
    setIsWithdrawing(true)

    // Simulate blockchain transaction
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsWithdrawing(false)
    toast({
      title: "Withdrawal Successful! 💰",
      description: `${earnings.total} ${earnings.tokenSymbol} has been sent to your wallet.`,
      duration: 5000,
    })
  }

  return (
    <div className="bg-gradient-to-r from-[#1DB954]/20 to-[#1DB954]/10 rounded-2xl p-6 border border-[#1DB954]/30">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-[#1DB954]" />
        <h3 className="text-xl font-semibold">Revenue Dashboard</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <p className="text-gray-400 text-sm mb-1">Total Earnings</p>
            <div className="flex items-center gap-2">
              <Coins className="w-6 h-6 text-[#1DB954]" />
              <span className="text-3xl font-bold text-[#1DB954]">{earnings.total}</span>
              <span className="text-lg text-gray-400">{earnings.tokenSymbol}</span>
            </div>
          </div>

          <div className="text-sm text-gray-400 space-y-1">
            <p>• Earnings from plays, likes, and tips</p>
            <p>• Updated in real-time on the blockchain</p>
            <p>• Withdraw anytime to your connected wallet</p>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <Button
            onClick={handleWithdraw}
            disabled={!earnings.canWithdraw || isWithdrawing}
            className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold py-3 text-base"
          >
            {isWithdrawing ? (
              "Processing..."
            ) : (
              <>
                <Wallet className="w-4 h-4 mr-2" />
                Withdraw Earnings
              </>
            )}
          </Button>
          {!earnings.canWithdraw && (
            <p className="text-xs text-gray-500 mt-2 text-center">Minimum withdrawal: 100 {earnings.tokenSymbol}</p>
          )}
        </div>
      </div>
    </div>
  )
}
