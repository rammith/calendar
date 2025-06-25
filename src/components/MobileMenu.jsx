"use client"

import { X, Calendar, List, Download } from "lucide-react"

const MobileMenu = ({ isOpen, onClose, viewMode, setViewMode, stats }) => {
  if (!isOpen) return null

  const exportEvents = () => {
    const events = JSON.parse(localStorage.getItem("events") || "{}")
    const dataStr = JSON.stringify(events, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `calendar-events-${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-white/95 backdrop-blur-xl shadow-2xl transform animate-in slide-in-from-right duration-300">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
            <h2 className="text-lg font-bold text-gray-800">Menu</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 space-y-6">
            {/* View Mode */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">View Mode</h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setViewMode("calendar")
                    onClose()
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    viewMode === "calendar"
                      ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-rose-50 hover:text-rose-600"
                  }`}
                >
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">Calendar View</span>
                </button>
                <button
                  onClick={() => {
                    setViewMode("events")
                    onClose()
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    viewMode === "events"
                      ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-rose-50 hover:text-rose-600"
                  }`}
                >
                  <List className="w-5 h-5" />
                  <span className="font-medium">Events List</span>
                </button>
              </div>
            </div>

            {/* Statistics */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Statistics</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-r from-rose-100 to-orange-100 rounded-xl p-4">
                  <div className="text-2xl font-bold text-rose-600">{stats.totalEvents}</div>
                  <div className="text-xs text-gray-600">Total Events</div>
                </div>
                <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl p-4">
                  <div className="text-2xl font-bold text-emerald-600">{stats.completedEvents}</div>
                  <div className="text-xs text-gray-600">Completed</div>
                </div>
                <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl p-4">
                  <div className="text-2xl font-bold text-amber-600">{stats.upcomingEvents}</div>
                  <div className="text-xs text-gray-600">Upcoming</div>
                </div>
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4">
                  <div className="text-2xl font-bold text-purple-600">{stats.highPriorityEvents}</div>
                  <div className="text-xs text-gray-600">High Priority</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={exportEvents}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-orange-50 hover:text-orange-600 transition-all duration-200"
                >
                  <Download className="w-5 h-5" />
                  <span className="font-medium">Export Events</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileMenu
