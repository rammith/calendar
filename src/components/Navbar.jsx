"use client"

import { useState, useEffect } from "react"
import { Search, Calendar, Sparkles, Filter, Download, Clock, BarChart3, Menu, Grid3X3, List } from "lucide-react"

const Navbar = ({
  goToToday,
  search,
  setSearch,
  filterCategory,
  setFilterCategory,
  filterPriority,
  setFilterPriority,
  filterStatus,
  setFilterStatus,
  currentTime,
  eventCount,
  setIsMobileMenuOpen,
  viewMode,
  setViewMode,
  stats,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [searchResults, setSearchResults] = useState(0)

  useEffect(() => {
    if (search.trim()) {
      setSearchResults(eventCount)
    } else {
      setSearchResults(0)
    }
  }, [search, eventCount])

  const exportEvents = () => {
    const events = JSON.parse(localStorage.getItem("events") || "{}")
    const dataStr = JSON.stringify(events, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `calendar-events-${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const clearAllFilters = () => {
    setSearch("")
    setFilterCategory("All")
    setFilterPriority("All")
    setFilterStatus("All")
  }

  return (
    <>
      <nav className="backdrop-blur-xl bg-white/80 border-b border-white/30 shadow-lg shadow-rose-100/30 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col gap-3">
            {/* Top Row */}
            <div className="flex justify-between items-center">
              {/* Logo & Real-time Clock */}
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-3 group">
                  <div className="relative">
                    <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-rose-600 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400 absolute -top-1 -right-1 animate-pulse" />
                  </div>
                  <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                    Calendar
                  </span>
                </div>

                {/* Real-time clock - Hidden on mobile */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-rose-100/50 to-orange-100/50 rounded-xl border border-white/30">
                  <Clock className="w-4 h-4 text-rose-600" />
                  <span className="text-sm font-mono text-gray-700">{currentTime.format("HH:mm:ss")}</span>
                </div>
              </div>

              {/* Desktop Actions */}
              <div className="hidden sm:flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-100/50 to-teal-100/50 rounded-xl border border-white/30">
                  <BarChart3 className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium text-gray-700">{stats.totalEvents} events</span>
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`relative p-2 sm:p-2.5 rounded-xl transition-all duration-300 hover:scale-105 ${
                    showFilters
                      ? "bg-gradient-to-r from-rose-100 to-orange-100 text-rose-600 shadow-lg"
                      : "bg-white/80 text-gray-600 hover:bg-rose-50 hover:text-rose-600"
                  }`}
                >
                  <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                  {(filterCategory !== "All" || filterPriority !== "All" || filterStatus !== "All") && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full animate-pulse"></div>
                  )}
                </button>

                <button
                  onClick={exportEvents}
                  className="p-2 sm:p-2.5 bg-white/80 text-gray-600 rounded-xl hover:bg-orange-50 hover:text-orange-600 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md"
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <button
                  onClick={goToToday}
                  className="group relative px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-xl font-medium shadow-lg shadow-rose-200/50 hover:shadow-xl hover:shadow-rose-300/50 transition-all duration-300 hover:scale-105 active:scale-95 text-sm sm:text-base whitespace-nowrap"
                >
                  <span className="relative z-10 flex items-center gap-1 sm:gap-2">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:rotate-12" />
                    Today
                  </span>
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="sm:hidden p-2 bg-white/80 text-gray-600 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all duration-300"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

            {/* Search Row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className={`relative transition-all duration-300 flex-1 ${isSearchFocused ? "scale-[1.02]" : ""}`}>
                <Search
                  className={`w-4 h-4 sm:w-5 sm:h-5 absolute left-3 top-1/2 transform -translate-y-1/2 transition-all duration-200 ${
                    isSearchFocused ? "text-rose-500" : "text-gray-400"
                  }`}
                />
                <input
                  type="text"
                  className="pl-8 sm:pl-10 pr-4 py-2 sm:py-2.5 w-full bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400/50 focus:border-rose-400 transition-all duration-300 placeholder-gray-400 text-sm sm:text-base shadow-sm focus:shadow-md"
                  placeholder="Search events, categories, descriptions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                {search && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {searchResults} found
                    </span>
                    <button
                      onClick={() => setSearch("")}
                      className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile View Toggle */}
              <div className="sm:hidden flex bg-white/80 rounded-xl p-1 border border-gray-200/50">
                <button
                  onClick={() => setViewMode("calendar")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    viewMode === "calendar"
                      ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-md"
                      : "text-gray-600 hover:text-rose-600"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                  Calendar
                </button>
                <button
                  onClick={() => setViewMode("events")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    viewMode === "events"
                      ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-md"
                      : "text-gray-600 hover:text-rose-600"
                  }`}
                >
                  <List className="w-4 h-4" />
                  Events
                </button>
              </div>
            </div>

            {/* Enhanced Filters Row */}
            {showFilters && (
              <div className="p-4 bg-gradient-to-r from-white/70 to-rose-50/70 backdrop-blur-sm rounded-xl border border-white/40 animate-in slide-in-from-top duration-300 shadow-sm">
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="px-3 py-2 bg-white/90 border border-gray-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400/50 text-sm shadow-sm"
                    >
                      <option value="All">All Categories</option>
                      <option value="Work">Work</option>
                      <option value="Personal">Personal</option>
                      <option value="Meeting">Meeting</option>
                      <option value="Holiday">Holiday</option>
                      <option value="Other">Other</option>
                    </select>

                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                      className="px-3 py-2 bg-white/90 border border-gray-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400/50 text-sm shadow-sm"
                    >
                      <option value="All">All Priorities</option>
                      <option value="High">High Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="Low">Low Priority</option>
                    </select>

                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 bg-white/90 border border-gray-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400/50 text-sm shadow-sm"
                    >
                      <option value="All">All Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">Showing {eventCount} events with current filters</div>
                    <button
                      onClick={clearAllFilters}
                      className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg hover:from-rose-100 hover:to-orange-100 hover:text-rose-700 transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar
