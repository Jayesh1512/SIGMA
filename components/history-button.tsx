"use client"

import type { HistoryEntry } from "@/types/type"
import { History } from "lucide-react"

interface HistoryButtonProps {
  history: HistoryEntry[]
  onToggleHistoryPanel: () => void
}

export const HistoryButton = ({ history, onToggleHistoryPanel }: HistoryButtonProps) => {
  return (
    <button
      onClick={onToggleHistoryPanel}
      className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors"
    >
      <History className="h-5 w-5" />
      <span>History</span>
    </button>
  )
}

