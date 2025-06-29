import { HomeScreen } from "@/components/home-screen"
import { BottomNavigation } from "@/components/bottom-navigation"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#121212] text-white pb-20">
      <HomeScreen />
      <BottomNavigation activeTab="home" />
    </div>
  )
}
