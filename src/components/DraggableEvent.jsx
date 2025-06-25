"use client"

import { useState } from "react"
import { Edit, Trash2, MoreVertical, Clock } from "lucide-react"

function DraggableEvent({ event, onDragStart, onEdit, onDelete }) {
  const [showMenu, setShowMenu] = useState(false)

  const categoryColors = {
    Work: "from-emerald-400 to-teal-400",
    Personal: "from-rose-400 to-pink-400",
    Meeting: "from-orange-400 to-amber-400",
    Holiday: "from-purple-400 to-violet-400",
    Other: "from-gray-400 to-slate-400",
  }

  const statusIndicators = {
    Pending: "🔄",
    Completed: "✅",
    Cancelled: "❌",
  }

  const priorityBorders = {
    High: "ring-2 ring-red-300 shadow-red-100",
    Medium: "ring-1 ring-orange-300 shadow-orange-100",
    Low: "ring-1 ring-emerald-300 shadow-emerald-100",
  }

  const colorClass = categoryColors[event.category] || "from-gray-400 to-slate-400"
  const statusIcon = statusIndicators[event.status] || "🔄"
  const priorityClass = priorityBorders[event.priority] || ""

  return (
    <div
      className={`group relative bg-gradient-to-r ${colorClass} ${priorityClass} rounded-md sm:rounded-lg px-1.5 sm:px-2 py-1 sm:py-1.5 cursor-move text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg animate-in slide-in-from-left duration-300`}
      title={event.description || event.title}
    >
      <div draggable onDragStart={(e) => onDragStart(e, event)} className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-xs flex-shrink-0">{statusIcon}</span>
            <div className="text-xs font-semibold truncate">{event.title}</div>
          </div>
          {event.startTime && (
            <div className="flex items-center gap-1 mt-0.5 hidden sm:flex">
              <Clock className="w-2 h-2 flex-shrink-0" />
              <div className="text-[10px] opacity-90 truncate">{event.startTime}</div>
            </div>
          )}
        </div>

        <div className="relative flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
            className="p-0.5 hover:bg-white/20 rounded opacity-0 group-hover:opacity-100 transition-all duration-200"
          >
            <MoreVertical className="w-3 h-3" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 min-w-[100px] animate-in slide-in-from-top duration-200">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit()
                  setShowMenu(false)
                }}
                className="w-full px-3 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors duration-200"
              >
                <Edit className="w-3 h-3" />
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (window.confirm("Delete this event?")) {
                    onDelete()
                  }
                  setShowMenu(false)
                }}
                className="w-full px-3 py-1.5 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors duration-200"
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced drag indicator */}
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-md sm:rounded-lg flex items-center justify-center pointer-events-none">
        <div className="text-white/80 text-xs font-bold">⋮⋮</div>
      </div>

      {showMenu && <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />}
    </div>
  )
}

export default DraggableEvent
