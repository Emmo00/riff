import { UploadTrackForm } from "@/components/upload-track-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function UploadPage() {
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
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="w-full max-w-2xl">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Upload a New Track</h1>
            <p className="text-gray-400">Share your music with the decentralized world</p>
          </div>

          {/* Form Card */}
          <div className="bg-[#181818] rounded-2xl p-6 md:p-8 shadow-2xl border border-gray-800">
            <UploadTrackForm />
          </div>
        </div>
      </div>
    </div>
  )
}
