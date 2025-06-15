import { SearchPage } from "@/components/search-page"
import { BottomNavigation } from "@/components/bottom-navigation"

export default function Search() {
  return (
    <div className="min-h-screen bg-[#121212] text-white pb-20">
      <SearchPage />
      <BottomNavigation activeTab="search" />
    </div>
  )
}
