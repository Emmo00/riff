import { RegisterForm } from "@/components/register-form"
// import Link from "next/link"
// import { ArrowLeft } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Main Card */}
        <div className="bg-[#181818] rounded-2xl p-8 shadow-2xl border border-gray-800">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#1DB954] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-black font-bold text-2xl">R</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Create Your Artist Profile</h1>
            <p className="text-gray-400">Join the decentralized music revolution</p>
          </div>

          {/* Form */}
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
