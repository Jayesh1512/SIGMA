"use client"

import type { HistoryEntry } from "@/types/type"
import { X } from "lucide-react"

interface HistoryPanelProps {
  history: HistoryEntry[]
  onClose: () => void
  onRestoreState: (entry: HistoryEntry) => void
}

export const HistoryPanel = ({ history, onClose, onRestoreState }: HistoryPanelProps) => {
  // Function to format timestamp to a more readable format
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  // Function to get a human-readable description of the action
  const getActionDescription = (entry: HistoryEntry) => {
    switch (entry.action) {
      case "canvas_initialized":
        return "Canvas created"
      case "shape_created":
        return `Created ${entry.details?.type || "shape"}`
      case "object_modified":
        return `Modified ${entry.details?.type || "object"}`
      case "selection_created":
        return "Selected object(s)"
      case "path_created":
        return "Drew freeform path"
      case "shape_synced":
        return `Updated ${entry.details?.type || "shape"}`
      case "all_shapes_deleted":
        return `Cleared canvas (${entry.details?.count || 0} objects)`
      case "shape_deleted":
        return "Deleted shape"
      case "active_element_changed":
        return `Changed tool to ${entry.details?.to || ""}`
      case "image_uploaded":
        return `Uploaded image: ${entry.details?.filename || "image"}`
      case "undo_performed":
        return "Undo"
      case "redo_performed":
        return "Redo"
      case "state_restored":
        return "Restored previous state"
      default:
        return entry.action.replace(/_/g, " ")
    }
  }

  return (
    <div className="absolute right-0 top-16 z-10 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg border border-gray-200 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between border-b p-3">
        <h3 className="font-medium">History</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {history.length === 0 ? (
          <p className="text-center text-gray-500 p-4">No history yet</p>
        ) : (
          <ul className="space-y-1">
            {history.map((entry, index) => (
              <li
                key={index}
                onClick={() => entry.canvasState && onRestoreState(entry)}
                className={`
                  p-2 text-sm rounded-md
                  ${entry.canvasState ? "cursor-pointer hover:bg-gray-100" : "cursor-default"}
                  ${entry.canvasState ? "border-l-2 border-blue-500" : ""}
                `}
              >
                <div className="font-medium">{getActionDescription(entry)}</div>
                <div className="text-xs text-gray-500">{formatTimestamp(entry.timestamp)}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

