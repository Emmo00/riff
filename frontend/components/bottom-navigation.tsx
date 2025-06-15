"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Upload, User, Settings } from "lucide-react"

interface BottomNavigationProps {
  activeTab?: string
}

export function BottomNavigation({ activeTab }: BottomNavigationProps) {
  const pathname = usePathname()

  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      href: "/",
    },
    {
      id: "search",
      label: "Search",
      icon: Search,
      href: "/search",
    },
    {
      id: "upload",
      label: "Upload",
      icon: Upload,
      href: "/upload",
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      href: "/profile/me",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/settings",
    },
  ]

  const getIsActive = (item: any) => {
    if (activeTab) {
      return activeTab === item.id
    }
    return pathname === item.href
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#121212] border-t border-gray-800">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = getIsActive(item)

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                isActive ? "text-[#1DB954]" : "text-gray-400 hover:text-white"
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? "fill-current" : ""}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
