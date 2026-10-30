'use client'

import { PanelLeft } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"

export function SidebarMobileTrigger() {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      aria-label="Toggle sidebar"
      className="md:hidden fixed bottom-10 right-5 z-50 flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg active:scale-95 transition-transform"
    >
      <PanelLeft className="size-5" />
    </button>
  )
}