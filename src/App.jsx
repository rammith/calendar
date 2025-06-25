"use client"

import { useState, useEffect, useCallback } from "react"
import Calendar from "./components/Calendar"
import EventSidePanel from "./components/EventSidePanel"
import Navbar from "./components/Navbar"
import NotificationSystem from "./components/NotificationSystem"
import MobileMenu from "./components/MobileMenu"
import dayjs from "dayjs"

export default function App() {
  const [search, setSearch] = useState("")
  const [selectedDate, setSelectedDate] = useState(null)
  const [currentDate, setCurrentDate] = useState(dayjs())
  const [filterCategory, setFilterCategory] = useState("All")
  const [filterPriority, setFilterPriority] = useState("All")
  const [filterStatus, setFilterStatus] = useState("All")
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [viewMode, setViewMode] = useState("calendar") // calendar, events, stats
  const [events, setEvents] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("events")
      return stored ? JSON.parse(stored) : {}
    }
    return {}
  })

  // Real-time clock
  const [currentTime, setCurrentTime] = useState(dayjs())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Enhanced search functionality
  const searchEvents = useCallback(
    (searchTerm) => {
      if (!searchTerm.trim()) return events

      const filtered = {}
      Object.keys(events).forEach((date) => {
        const dayEvents = events[date].filter((event) => {
          const searchLower = searchTerm.toLowerCase()
          return (
            event.title.toLowerCase().includes(searchLower) ||
            event.description?.toLowerCase().includes(searchLower) ||
            event.category.toLowerCase().includes(searchLower) ||
            event.location?.toLowerCase().includes(searchLower) ||
            event.attendees?.toLowerCase().includes(searchLower) ||
            event.notes?.toLowerCase().includes(searchLower)
          )
        })

        if (dayEvents.length > 0) {
          filtered[date] = dayEvents
        }
      })

      return filtered
    },
    [events],
  )

  // Check for reminders
  useEffect(() => {
    const checkReminders = () => {
      const now = dayjs()
      const newNotifications = []

      Object.keys(events).forEach((date) => {
        events[date].forEach((event) => {
          if (event.reminder && event.startTime24) {
            const eventDateTime = dayjs(`${date} ${event.startTime24}`)
            const reminderTime = eventDateTime.subtract(event.reminder, "minute")

            if (now.isAfter(reminderTime) && now.isBefore(reminderTime.add(1, "minute"))) {
              newNotifications.push({
                id: Date.now() + Math.random(),
                title: event.title,
                message: `Reminder: ${event.title} starts in ${event.reminder} minutes`,
                time: now.format("HH:mm"),
                type: "reminder",
                priority: event.priority,
                read: false,
              })
            }
          }
        })
      })

      if (newNotifications.length > 0) {
        setNotifications((prev) => [...prev, ...newNotifications])
      }
    }

    const interval = setInterval(checkReminders, 60000)
    return () => clearInterval(interval)
  }, [events])

  const goToToday = () => {
    setIsLoading(true)
    setTimeout(() => {
      const today = dayjs()
      setSelectedDate(today)
      setCurrentDate(today)
      setIsLoading(false)
    }, 300)
  }

  // Advanced filtering
  const filteredEvents = useCallback(() => {
    const result = search.trim() ? searchEvents(search) : events

    const filtered = {}
    Object.keys(result).forEach((date) => {
      const dayEvents = result[date].filter((event) => {
        const matchesCategory = filterCategory === "All" || event.category === filterCategory
        const matchesPriority = filterPriority === "All" || event.priority === filterPriority
        const matchesStatus = filterStatus === "All" || event.status === filterStatus

        return matchesCategory && matchesPriority && matchesStatus
      })

      if (dayEvents.length > 0) {
        filtered[date] = dayEvents
      }
    })

    return filtered
  }, [events, search, filterCategory, filterPriority, filterStatus, searchEvents])

  const updateEvent = (dateKey, eventIndex, updatedEvent) => {
    const updated = { ...events }
    updated[dateKey][eventIndex] = { ...updatedEvent, updatedAt: new Date().toISOString() }
    setEvents(updated)

    setNotifications((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: "Event Updated",
        message: `${updatedEvent.title} has been updated`,
        time: dayjs().format("HH:mm"),
        type: "update",
        read: false,
      },
    ])
  }

  const deleteEvent = (dateKey, eventIndex) => {
    const updated = { ...events }
    const deletedEvent = updated[dateKey][eventIndex]
    updated[dateKey].splice(eventIndex, 1)
    if (updated[dateKey].length === 0) {
      delete updated[dateKey]
    }
    setEvents(updated)

    setNotifications((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: "Event Deleted",
        message: `${deletedEvent.title} has been deleted`,
        time: dayjs().format("HH:mm"),
        type: "delete",
        read: false,
      },
    ])
  }

  // Get statistics
  const getStats = () => {
    const totalEvents = Object.values(events).reduce((acc, dayEvents) => acc + dayEvents.length, 0)
    const completedEvents = Object.values(events)
      .flat()
      .filter((event) => event.status === "Completed").length
    const upcomingEvents = Object.values(events)
      .flat()
      .filter((event) => event.status === "Pending").length
    const highPriorityEvents = Object.values(events)
      .flat()
      .filter((event) => event.priority === "High").length

    return { totalEvents, completedEvents, upcomingEvents, highPriorityEvents }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50 to-orange-50 relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-rose-200/20 to-orange-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-amber-200/15 to-rose-200/15 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-rose-300/40 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-orange-300/40 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-emerald-300/40 rounded-full animate-bounce delay-1000"></div>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-700 font-medium">Loading...</span>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10">
        <Navbar
          goToToday={goToToday}
          search={search}
          setSearch={setSearch}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          filterPriority={filterPriority}
          setFilterPriority={setFilterPriority}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          currentTime={currentTime}
          eventCount={Object.keys(filteredEvents()).length}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          viewMode={viewMode}
          setViewMode={setViewMode}
          stats={getStats()}
        />

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          viewMode={viewMode}
          setViewMode={setViewMode}
          stats={getStats()}
        />

        {/* Main Content */}
        <div className="px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
          <div className="max-w-7xl mx-auto">
            {/* Desktop Layout */}
            <div className="hidden lg:flex gap-6">
              <div className="flex-1 min-w-0">
                <Calendar
                  search={search}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  currentDate={currentDate}
                  setCurrentDate={setCurrentDate}
                  events={filteredEvents()}
                  setEvents={setEvents}
                  updateEvent={updateEvent}
                  deleteEvent={deleteEvent}
                  currentTime={currentTime}
                />
              </div>
              <div className="w-80">
                <EventSidePanel
                  selectedDate={selectedDate}
                  events={events}
                  updateEvent={updateEvent}
                  deleteEvent={deleteEvent}
                  currentTime={currentTime}
                />
              </div>
            </div>

            {/* Mobile/Tablet Layout */}
            <div className="lg:hidden">
              {viewMode === "calendar" && (
                <div className="space-y-4">
                  <Calendar
                    search={search}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    currentDate={currentDate}
                    setCurrentDate={setCurrentDate}
                    events={filteredEvents()}
                    setEvents={setEvents}
                    updateEvent={updateEvent}
                    deleteEvent={deleteEvent}
                    currentTime={currentTime}
                  />
                  {selectedDate && (
                    <EventSidePanel
                      selectedDate={selectedDate}
                      events={events}
                      updateEvent={updateEvent}
                      deleteEvent={deleteEvent}
                      currentTime={currentTime}
                    />
                  )}
                </div>
              )}

              {viewMode === "events" && (
                <EventSidePanel
                  selectedDate={selectedDate}
                  events={events}
                  updateEvent={updateEvent}
                  deleteEvent={deleteEvent}
                  currentTime={currentTime}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <NotificationSystem notifications={notifications} setNotifications={setNotifications} />
    </div>
  )
}
