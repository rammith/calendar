"use client"

import { useState, useEffect } from "react"
import dayjs from "dayjs"
import DraggableEvent from "./DraggableEvent"
import EventFormModal from "./EventFormModal"
import { ChevronLeft, ChevronRight, Plus, Zap } from "lucide-react"

const Calendar = ({
  search,
  selectedDate,
  setSelectedDate,
  currentDate,
  setCurrentDate,
  events,
  setEvents,
  updateEvent,
  deleteEvent,
  currentTime,
}) => {
  const [showModal, setShowModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [hoveredDate, setHoveredDate] = useState(null)
  const [animatingDirection, setAnimatingDirection] = useState(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("events", JSON.stringify(events))
    }
  }, [events])

  const startOfMonth = currentDate.startOf("month").startOf("week")
  const days = []
  let day = startOfMonth
  for (let i = 0; i < 42; i++) {
    days.push(day)
    day = day.add(1, "day")
  }

  const onAddEvent = (event) => {
    const key = event.date.format("YYYY-MM-DD")
    const updated = { ...events }
    if (!updated[key]) updated[key] = []

    if (editingEvent) {
      const eventIndex = updated[key].findIndex((e) => e.id === editingEvent.id)
      if (eventIndex !== -1) {
        updated[key][eventIndex] = { ...event, id: editingEvent.id }
      }
    } else {
      updated[key].push({ ...event, id: Date.now() + Math.random() })
    }

    setEvents(updated)
    setShowModal(false)
    setEditingEvent(null)
  }

  const onEditEvent = (event, dateKey) => {
    setEditingEvent({ ...event, dateKey })
    setSelectedDate(dayjs(dateKey))
    setShowModal(true)
  }

  const onDeleteEvent = (eventId, dateKey) => {
    const updated = { ...events }
    updated[dateKey] = updated[dateKey].filter((e) => e.id !== eventId)
    if (updated[dateKey].length === 0) {
      delete updated[dateKey]
    }
    setEvents(updated)
  }

  const onDragStart = (e, event) => {
    e.dataTransfer.setData("event", JSON.stringify(event))
  }

  const onDrop = (e, date) => {
    const droppedEvent = JSON.parse(e.dataTransfer.getData("event"))
    const oldKey = droppedEvent.dateKey || droppedEvent.date.format?.("YYYY-MM-DD") || droppedEvent.date
    const newKey = dayjs(date).format("YYYY-MM-DD")

    if (oldKey === newKey) return

    const updated = { ...events }

    updated[oldKey] = updated[oldKey].filter((ev) => ev.id !== droppedEvent.id)
    if (updated[oldKey].length === 0) {
      delete updated[oldKey]
    }

    if (!updated[newKey]) updated[newKey] = []
    updated[newKey].push({ ...droppedEvent, date: dayjs(date) })

    setEvents(updated)
  }

  const navigateMonth = (direction) => {
    setAnimatingDirection(direction)
    setTimeout(() => {
      setCurrentDate(currentDate.add(direction, "month"))
      setAnimatingDirection(null)
    }, 150)
  }

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  const years = []
  for (let y = 1900; y <= 2100; y++) years.push(y)

  const FESTIVALS = {
    "2024-01-15": "Pongal",
    "2024-03-29": "Good Friday",
    "2024-04-11": "Eid-ul-Fitr",
    "2024-08-15": "Independence Day",
    "2024-10-31": "Diwali",
    "2024-12-25": "Christmas",
    "2024-06-17": "Bakrid",
    "2024-03-25": "Holi",
    "2025-01-15": "Pongal",
    "2025-03-14": "Holi",
    "2025-03-21": "Good Friday",
    "2025-03-31": "Eid-ul-Fitr",
    "2025-06-07": "Bakrid",
    "2025-10-20": "Diwali",
    "2025-12-25": "Christmas",
  }

  return (
    <div
      className={`backdrop-blur-xl bg-white/90 rounded-2xl sm:rounded-3xl shadow-2xl shadow-rose-100/30 border border-white/30 p-3 sm:p-6 transition-all duration-500 hover:shadow-3xl hover:shadow-rose-200/20 ${
        animatingDirection ? "scale-[0.98]" : ""
      }`}
    >
      {/* Enhanced Header */}
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <button
          onClick={() => navigateMonth(-1)}
          className="group p-2 sm:p-3 bg-gradient-to-r from-rose-100 to-orange-100 rounded-xl sm:rounded-2xl hover:from-rose-200 hover:to-orange-200 transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 group-hover:text-rose-700 transition-colors duration-300" />
        </button>

        <div className="flex items-center gap-2 sm:gap-4">
          <select
            className="px-2 sm:px-4 py-1 sm:py-2 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400/50 transition-all duration-300 font-medium text-gray-700 text-sm sm:text-base shadow-sm"
            value={currentDate.month()}
            onChange={(e) => setCurrentDate(currentDate.month(Number(e.target.value)))}
          >
            {months.map((m, idx) => (
              <option key={m} value={idx}>
                {m}
              </option>
            ))}
          </select>
          <select
            className="px-2 sm:px-4 py-1 sm:py-2 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400/50 transition-all duration-300 font-medium text-gray-700 text-sm sm:text-base shadow-sm"
            value={currentDate.year()}
            onChange={(e) => setCurrentDate(currentDate.year(Number(e.target.value)))}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => navigateMonth(1)}
          className="group p-2 sm:p-3 bg-gradient-to-r from-rose-100 to-orange-100 rounded-xl sm:rounded-2xl hover:from-rose-200 hover:to-orange-200 transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 group-hover:text-rose-700 transition-colors duration-300" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div
            key={d}
            className="text-center font-bold text-xs sm:text-sm text-gray-600 uppercase tracking-wider py-1 sm:py-2 bg-gradient-to-r from-rose-50 to-orange-50 rounded-lg"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid - Responsive heights */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 h-[300px] sm:h-[400px] lg:h-[500px]">
        {days.map((d, idx) => {
          const key = d.format("YYYY-MM-DD")
          const isToday = d.isSame(dayjs(), "day")
          const isCurrentMonth = d.month() === currentDate.month()
          const isWeekend = [0, 6].includes(d.day())
          const festival = FESTIVALS[key]
          const isHovered = hoveredDate === key
          const isSelected = selectedDate && d.isSame(selectedDate, "day")
          const isCurrentTime = d.isSame(currentTime, "day")

          return (
            <div
              key={idx}
              onClick={() => setSelectedDate(d)}
              onDoubleClick={() => {
                setSelectedDate(d)
                setEditingEvent(null)
                setShowModal(true)
              }}
              onDrop={(e) => onDrop(e, key)}
              onDragOver={(e) => e.preventDefault()}
              onMouseEnter={() => setHoveredDate(key)}
              onMouseLeave={() => setHoveredDate(null)}
              className={`group relative flex flex-col p-1 sm:p-2 lg:p-3 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 overflow-hidden
                ${isToday ? "bg-gradient-to-br from-rose-100 to-orange-100 ring-1 sm:ring-2 ring-rose-400 shadow-lg" : ""}
                ${isSelected ? "bg-gradient-to-br from-amber-100 to-rose-100 ring-1 sm:ring-2 ring-amber-400 shadow-lg" : ""}
                ${!isCurrentMonth ? "text-gray-300" : "text-gray-700"}
                ${isWeekend && !isToday && !isSelected ? "bg-gradient-to-br from-orange-50 to-rose-50" : ""}
                ${!isToday && !isSelected && !isWeekend ? "bg-white/70 hover:bg-gradient-to-br hover:from-rose-50 hover:to-orange-50" : ""}
                ${isHovered ? "scale-105 shadow-xl" : "shadow-md"}
                backdrop-blur-sm border border-white/40`}
            >
              <div className="flex justify-between items-start mb-1">
                <span
                  className={`text-xs sm:text-sm font-bold transition-colors duration-300
                  ${isToday ? "text-rose-700" : ""}
                  ${isSelected ? "text-amber-700" : ""}
                  ${isWeekend && !isToday && !isSelected ? "text-orange-600" : ""}`}
                >
                  {d.date()}
                </span>
                <div className="flex items-center gap-1">
                  {isCurrentTime && <Zap className="w-2 h-2 sm:w-3 sm:h-3 text-rose-500 animate-pulse" />}
                  {(events[key]?.length > 0 || festival) && (
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-rose-400 to-orange-400 rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>

              {festival && (
                <div className="mb-1 hidden sm:block">
                  <span className="text-xs bg-gradient-to-r from-amber-200 to-orange-200 text-orange-800 rounded-full px-1 sm:px-2 py-0.5 font-semibold shadow-sm">
                    🎉 {festival.length > 6 ? festival.substring(0, 6) + "..." : festival}
                  </span>
                </div>
              )}

              <div className="flex-1 space-y-0.5 sm:space-y-1 overflow-y-auto">
                {(events[key] || []).slice(0, 2).map((ev, i) => (
                  <DraggableEvent
                    key={ev.id || i}
                    event={{ ...ev, dateKey: key }}
                    onDragStart={onDragStart}
                    onEdit={() => onEditEvent(ev, key)}
                    onDelete={() => onDeleteEvent(ev.id, key)}
                  />
                ))}
                {events[key]?.length > 2 && (
                  <div className="text-xs text-gray-500 font-medium">+{events[key].length - 2} more</div>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedDate(d)
                  setEditingEvent(null)
                  setShowModal(true)
                }}
                className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-r from-rose-400 to-orange-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg"
              >
                <Plus className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
              </button>
            </div>
          )
        })}
      </div>

      {showModal && selectedDate && (
        <EventFormModal
          selectedDate={selectedDate}
          onAddEvent={onAddEvent}
          onClose={() => {
            setShowModal(false)
            setEditingEvent(null)
          }}
          editingEvent={editingEvent}
        />
      )}
    </div>
  )
}

export default Calendar
