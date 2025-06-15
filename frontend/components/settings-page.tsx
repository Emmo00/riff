"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Settings, User, Wallet, Bell, Palette, HelpCircle, ChevronRight, DollarSign } from "lucide-react"

export function SettingsPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#121212]/95 backdrop-blur-sm border-b border-gray-800">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Settings
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Account Settings */}
        <Card className="bg-[#181818] border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-[#1DB954]" />
              Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link
              href="/profile/edit"
              className="flex items-center justify-between p-3 hover:bg-[#2a2a2a] rounded-lg transition-colors"
            >
              <span>Edit Profile</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
            <Link
              href="/settings/fees"
              className="flex items-center justify-between p-3 hover:bg-[#2a2a2a] rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#1DB954]" />
                <span>Fee Settings</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
          </CardContent>
        </Card>

        {/* Web3 Settings */}
        <Card className="bg-[#181818] border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-[#1DB954]" />
              Web3 & Wallet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3">
              <span>Connected Wallet</span>
              <span className="text-sm text-gray-400 font-mono">0x742d...1681</span>
            </div>
            <div className="flex items-center justify-between p-3">
              <span>Auto-approve transactions</span>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-[#181818] border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#1DB954]" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3">
              <span>New followers</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3">
              <span>Track interactions</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3">
              <span>Revenue updates</span>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* App Settings */}
        <Card className="bg-[#181818] border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-[#1DB954]" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3">
              <span>Dark mode</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3">
              <span>High contrast</span>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <Card className="bg-[#181818] border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#1DB954]" />
              Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link
              href="/help"
              className="flex items-center justify-between p-3 hover:bg-[#2a2a2a] rounded-lg transition-colors"
            >
              <span>Help Center</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
            <Link
              href="/contact"
              className="flex items-center justify-between p-3 hover:bg-[#2a2a2a] rounded-lg transition-colors"
            >
              <span>Contact Support</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
