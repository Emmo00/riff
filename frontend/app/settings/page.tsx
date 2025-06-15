import { SettingsPage } from "@/components/settings-page"
import { BottomNavigation } from "@/components/bottom-navigation"

export default function Settings() {
  return (
    <div className="min-h-screen bg-[#121212] text-white pb-20">
      <SettingsPage />
      <BottomNavigation activeTab="settings" />
    </div>
  )
}
