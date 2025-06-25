"use client"

import dayjs from "dayjs"
import { Calendar, Clock, Tag, Repeat, Sparkles, MapPin, Users, Bell, Edit, Trash2, TrendingUp } from "lucide-react"

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

const EventSidePanel = ({ selectedDate, events, updateEvent, deleteEvent, currentTime }) => {
  if (!selectedDate) {
    return (
      <div className="backdrop-blur-xl bg-white/90 rounded-2xl sm:rounded-3xl shadow-2xl shadow-rose-100/30 border border-white/30 p-4 sm:p-6 h-fit">
        <div className="text-center py-6 sm:py-12">
          <div className="relative mb-6">
            <Calendar className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto" />
            <TrendingUp className="w-6 h-6 text-rose-400 absolute -top-2 -right-2 animate-bounce" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-600 mb-2">Select a Date</h3>
          <p className="text-sm text-gray-400 mb-6">Click on any date to view events and details</p>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-gradient-to-r from-rose-50 to-orange-50 rounded-xl p-3 sm:p-4">
              <div className="text-lg sm:text-xl font-bold text-rose-600">{Object.keys(events).length}</div>
              <div className="text-xs sm:text-sm text-gray-600">Days with events</div>
            </div>
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-3 sm:p-4">
              <div className="text-lg sm:text-xl font-bold text-emerald-600">
                {Object.values(events).reduce((acc, dayEvents) => acc + dayEvents.length, 0)}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Total events</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const key = dayjs(selectedDate).format("YYYY-MM-DD")
  const dailyEvents = events[key] || []
  const festival = FESTIVALS[key]
  const isToday = dayjs(selectedDate).isSame(dayjs(), "day")

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "from-red-100 to-rose-100 border-red-200"
      case "Medium":
        return "from-orange-100 to-amber-100 border-orange-200"
      case "Low":
        return "from-emerald-100 to-teal-100 border-emerald-200"
      default:
        return "from-gray-100 to-slate-100 border-gray-200"
    }
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Work":
        return "💼"
      case "Personal":
        return "👤"
      case "Meeting":
        return "🤝"
      case "Holiday":
        return "🏖️"
      default:
        return "📝"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "text-emerald-600 bg-emerald-100"
      case "Cancelled":
        return "text-red-600 bg-red-100"
      case "Pending":
        return "text-orange-600 bg-orange-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const handleEventAction = (action, event, index) => {
    if (action === "edit") {
      updateEvent(key, index, event)
    } else if (action === "delete") {
      if (window.confirm("Are you sure you want to delete this event?")) {
        deleteEvent(key, index)
      }
    }
  }

  return (
    <div className="backdrop-blur-xl bg-white/90 rounded-2xl sm:rounded-3xl shadow-2xl shadow-rose-100/30 border border-white/30 p-4 sm:p-6 h-fit max-h-[70vh] sm:max-h-[80vh] overflow-y-auto transition-all duration-500">
      {/* Enhanced Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-gradient-to-r from-rose-100 to-orange-100 rounded-xl">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-bold text-gray-800">Events</h3>
            {isToday && (
              <span className="text-xs text-rose-600 font-medium bg-rose-100 px-2 py-1 rounded-full">
                Today • {currentTime.format("HH:mm")}
              </span>
            )}
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">
              {dailyEvents.length} event{dailyEvents.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 font-medium">
          {dayjs(selectedDate).format("dddd, MMMM D, YYYY")}
        </p>
      </div>

      {/* Festival */}
      {festival && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl sm:rounded-2xl border border-amber-200 animate-in slide-in-from-top duration-500">
          <div className="flex items-center gap-3">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
            <div>
              <h4 className="font-semibold text-orange-800 text-sm sm:text-base">🎉 {festival}</h4>
              <p className="text-xs text-orange-600">Festival</p>
            </div>
          </div>
        </div>
      )}

      {/* Events */}
      {dailyEvents.length > 0 ? (
        <div className="space-y-3 sm:space-y-4">
          {dailyEvents.map((event, index) => (
            <div
              key={event.id || index}
              className={`p-3 sm:p-4 bg-gradient-to-r ${getPriorityColor(event.priority)} rounded-xl sm:rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg animate-in slide-in-from-left duration-500`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-base sm:text-lg flex-shrink-0">{getCategoryIcon(event.category)}</span>
                  <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{event.title}</h4>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(event.status)}`}>
                    {event.status}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEventAction("edit", event, index)}
                      className="p-1 hover:bg-white/50 rounded-lg transition-colors duration-200"
                      title="Edit Event"
                    >
                      <Edit className="w-3 h-3 text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleEventAction("delete", event, index)}
                      className="p-1 hover:bg-red-100 rounded-lg transition-colors duration-200"
                      title="Delete Event"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Priority Badge */}
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium
                  ${event.priority === "High" ? "bg-red-200 text-red-800" : ""}
                  ${event.priority === "Medium" ? "bg-orange-200 text-orange-800" : ""}
                  ${event.priority === "Low" ? "bg-emerald-200 text-emerald-800" : ""}
                `}
                >
                  {event.priority} Priority
                </span>
              </div>

              {/* Event Details */}
              <div className="space-y-2">
                {event.startTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-600">
                      {event.startTime} {event.endTime && `- ${event.endTime}`}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Tag className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-600">{event.category}</span>
                </div>

                {event.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-600 truncate">{event.location}</span>
                  </div>
                )}

                {event.attendees && (
                  <div className="flex items-center gap-2">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-600">
                      {event.attendees.split(",").length} attendee(s)
                    </span>
                  </div>
                )}

                {event.reminder > 0 && (
                  <div className="flex items-center gap-2">
                    <Bell className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-600">Reminder: {event.reminder} min before</span>
                  </div>
                )}

                {event.occurrence !== "One-time" && (
                  <div className="flex items-center gap-2">
                    <Repeat className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-600">{event.occurrence}</span>
                  </div>
                )}
              </div>

              {event.description && (
                <p className="text-xs sm:text-sm text-gray-600 mt-2 p-2 bg-white/50 rounded-lg break-words">
                  {event.description}
                </p>
              )}

              {event.notes && (
                <p className="text-xs sm:text-sm text-gray-500 mt-2 p-2 bg-gray-50/50 rounded-lg italic break-words">
                  Notes: {event.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 sm:py-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium text-sm sm:text-base">No events scheduled</p>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">Double-click on the date to add an event</p>
        </div>
      )}
    </div>
  )
}

export default EventSidePanel
