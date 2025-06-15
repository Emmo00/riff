import { FeeSettingsForm } from "@/components/fee-settings-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function FeeSettingsPage() {
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#121212]/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Configure Fan Action Fees</h1>
          <p className="text-gray-400 text-lg">Set the token amounts fans pay when they interact with your music</p>
        </div>

        <FeeSettingsForm />
      </div>
    </div>
  )
}
