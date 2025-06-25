"use client"

import { useState, useEffect } from "react"
import dayjs from "dayjs"
import {
  X,
  Calendar,
  Clock,
  Tag,
  AlertCircle,
  Repeat,
  FileText,
  Bell,
  Save,
  Trash2,
  Copy,
  Sparkles,
} from "lucide-react"

const EventFormModal = ({ selectedDate, onAddEvent, onClose, editingEvent }) => {
  const [title, setTitle] = useState("")
  const [startTime, setStartTime] = useState("")
  const [startPeriod, setStartPeriod] = useState("AM")
  const [endTime, setEndTime] = useState("")
  const [endPeriod, setEndPeriod] = useState("AM")
  const [customStartTime, setCustomStartTime] = useState("")
  const [customEndTime, setCustomEndTime] = useState("")
  const [useCustomTime, setUseCustomTime] = useState(false)
  const [category, setCategory] = useState("Work")
  const [priority, setPriority] = useState("Medium")
  const [status, setStatus] = useState("Pending")
  const [occurrence, setOccurrence] = useState("One-time")
  const [description, setDescription] = useState("")
  const [reminder, setReminder] = useState(0)
  const [location, setLocation] = useState("")
  const [attendees, setAttendees] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const templates = [
    { name: "Meeting", title: "Team Meeting", category: "Meeting", priority: "Medium", duration: "1:00", icon: "🤝" },
    { name: "Call", title: "Client Call", category: "Work", priority: "High", duration: "0:30", icon: "📞" },
    { name: "Break", title: "Coffee Break", category: "Personal", priority: "Low", duration: "0:15", icon: "☕" },
    { name: "Lunch", title: "Lunch", category: "Personal", priority: "Medium", duration: "1:00", icon: "🍽️" },
  ]

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title || "")
      setCategory(editingEvent.category || "Work")
      setPriority(editingEvent.priority || "Medium")
      setStatus(editingEvent.status || "Pending")
      setOccurrence(editingEvent.occurrence || "One-time")
      setDescription(editingEvent.description || "")
      setReminder(editingEvent.reminder || 0)
      setLocation(editingEvent.location || "")
      setAttendees(editingEvent.attendees || "")
      setNotes(editingEvent.notes || "")

      if (editingEvent.startTime && editingEvent.startTime.includes(" ")) {
        const [time, period] = editingEvent.startTime.split(" ")
        setStartTime(time)
        setStartPeriod(period)
      }
      if (editingEvent.endTime && editingEvent.endTime.includes(" ")) {
        const [time, period] = editingEvent.endTime.split(" ")
        setEndTime(time)
        setEndPeriod(period)
      }
    }
  }, [editingEvent])

  const timeOptions = []
  for (let hour = 1; hour <= 12; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const timeString = `${hour}:${minute.toString().padStart(2, "0")}`
      timeOptions.push(timeString)
    }
  }

  const applyTemplate = (template) => {
    setTitle(template.title)
    setCategory(template.category)
    setPriority(template.priority)

    if (startTime && template.duration) {
      const [hours, minutes] = template.duration.split(":").map(Number)
      const startDateTime = dayjs(`2000-01-01 ${convertTo24Hour(startTime, startPeriod)}`)
      const endDateTime = startDateTime.add(hours, "hour").add(minutes, "minute")
      const endTime12 = endDateTime.format("h:mm")
      const endPeriod12 = endDateTime.format("A")
      setEndTime(endTime12)
      setEndPeriod(endPeriod12)
    }
  }

  const convertTo24Hour = (time, period) => {
    if (!time) return ""
    const [hour, minute] = time.split(":")
    let hour24 = Number.parseInt(hour)
    if (period === "PM" && hour24 !== 12) hour24 += 12
    if (period === "AM" && hour24 === 12) hour24 = 0
    return `${hour24.toString().padStart(2, "0")}:${minute}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 500))

    const finalStartTime = useCustomTime ? customStartTime : startTime ? `${startTime} ${startPeriod}` : ""
    const finalEndTime = useCustomTime ? customEndTime : endTime ? `${endTime} ${endPeriod}` : ""

    const newEvent = {
      title,
      date: dayjs(selectedDate),
      startTime: finalStartTime,
      endTime: finalEndTime,
      startTime24: useCustomTime ? customStartTime : convertTo24Hour(startTime, startPeriod),
      endTime24: useCustomTime ? customEndTime : convertTo24Hour(endTime, endPeriod),
      category,
      priority,
      status,
      occurrence,
      description,
      reminder: Number(reminder),
      location,
      attendees,
      notes,
      createdAt: editingEvent?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    onAddEvent(newEvent)
    setIsSubmitting(false)
  }

  const handleDelete = () => {
    if (editingEvent && window.confirm("Are you sure you want to delete this event?")) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-in fade-in duration-300">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform animate-in zoom-in-95 duration-300 border border-white/30">
        {/* Enhanced Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-rose-50/50 to-orange-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-rose-100 to-orange-100 rounded-xl">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
                {editingEvent ? "Edit Event" : "Create Event"}
                <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">{dayjs(selectedDate).format("dddd, MMM D, YYYY")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {editingEvent && (
              <>
                <button
                  onClick={() => {}}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                  title="Duplicate Event"
                >
                  <Copy className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 hover:bg-red-100 rounded-xl transition-colors duration-200"
                  title="Delete Event"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </>
            )}
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200">
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Enhanced Templates */}
          {!editingEvent && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Quick Templates</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {templates.map((template) => (
                  <button
                    key={template.name}
                    type="button"
                    onClick={() => applyTemplate(template)}
                    className="p-3 bg-gradient-to-r from-rose-50 to-orange-50 hover:from-rose-100 hover:to-orange-100 border border-rose-200/50 rounded-xl text-center transition-all duration-200 hover:scale-105"
                  >
                    <div className="text-lg mb-1">{template.icon}</div>
                    <div className="text-xs font-medium text-gray-700">{template.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FileText className="w-4 h-4" />
              Event Title *
            </label>
            <input
              type="text"
              placeholder="Enter event title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/90 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400/50 focus:border-rose-400 transition-all duration-300 text-sm sm:text-base shadow-sm focus:shadow-md"
              autoFocus
              required
            />
          </div>

          {/* Time Configuration */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Clock className="w-4 h-4" />
                Time Settings
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={useCustomTime}
                  onChange={(e) => setUseCustomTime(e.target.checked)}
                  className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                />
                Custom Time Entry
              </label>
            </div>

            {useCustomTime ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Start Time (24h)</label>
                  <input
                    type="time"
                    value={customStartTime}
                    onChange={(e) => setCustomStartTime(e.target.value)}
                    className="w-full px-3 py-2 bg-white/90 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400/50 shadow-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">End Time (24h)</label>
                  <input
                    type="time"
                    value={customEndTime}
                    onChange={(e) => setCustomEndTime(e.target.value)}
                    className="w-full px-3 py-2 bg-white/90 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400/50 shadow-sm"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Start Time</label>
                  <div className="flex gap-2">
                    <select
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-white/90 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400/50 focus:border-rose-400 transition-all duration-300 text-sm sm:text-base shadow-sm"
                    >
                      <option value="">Select time</option>
                      {timeOptions.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    <select
                      value={startPeriod}
                      onChange={(e) => setStartPeriod(e.target.value)}
                      className="px-3 sm:px-4 py-2 sm:py-3 bg-white/90 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400/50 focus:border-rose-400 transition-all duration-300 text-sm sm:text-base shadow-sm"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">End Time</label>
                  <div className="flex gap-2">
                    <select
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-white/90 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400/50 focus:border-rose-400 transition-all duration-300 text-sm sm:text-base shadow-sm"
                    >
                      <option value="">Select time</option>
                      {timeOptions.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    <select
                      value={endPeriod}
                      onChange={(e) => setEndPeriod(e.target.value)}
                      className="px-3 sm:px-4 py-2 sm:py-3 bg-white/90 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400/50 focus:border-rose-400 transition-all duration-300 text-sm sm:text-base shadow-sm"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Category, Priority, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Tag className="w-4 h-4" />
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/90 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400/50 focus:border-rose-400 transition-all duration-300 text-sm sm:text-base shadow-sm"
              >
                <option>Work</option>
                <option>Personal</option>
                <option>Meeting</option>
                <option>Holiday</option>
                <option>Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <AlertCircle className="w-4 h-4" />
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/90 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400/50 focus:border-rose-400 transition-all duration-300 text-sm sm:text-base shadow-sm"
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/90 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400/50 focus:border-rose-400 transition-all duration-300 text-sm sm:text-base shadow-sm"
              >
                <option>Pending</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
            </div>
          </div>

          {/* Reminder and Occurrence */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Bell className="w-4 h-4" />
                Reminder (minutes before)
              </label>
              <select
                value={reminder}
                onChange={(e) => setReminder(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/90 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400/50 focus:border-rose-400 transition-all duration-300 text-sm sm:text-base shadow-sm"
              >
                <option value={0}>No reminder</option>
                <option value={5}>5 minutes</option>
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
                <option value={1440}>1 day</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Repeat className="w-4 h-4" />
                Repeat
              </label>
              <select
                value={occurrence}
                onChange={(e) => setOccurrence(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/90 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400/50 focus:border-rose-400 transition-all duration-300 text-sm sm:text-base shadow-sm"
              >
                <option>One-time</option>
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Yearly</option>
              </select>
            </div>
          </div>

          {/* Location and Attendees */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                placeholder="Meeting room, address, or online link..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/90 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400/50 focus:border-rose-400 transition-all duration-300 text-sm sm:text-base shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Attendees</label>
              <input
                type="text"
                placeholder="Email addresses separated by commas..."
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/90 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400/50 focus:border-rose-400 transition-all duration-300 text-sm sm:text-base shadow-sm"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              placeholder="Event description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/90 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400/50 focus:border-rose-400 transition-all duration-300 resize-none text-sm sm:text-base shadow-sm"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Additional Notes</label>
            <textarea
              placeholder="Private notes, preparation items, etc..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/90 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400/50 focus:border-rose-400 transition-all duration-300 resize-none text-sm sm:text-base shadow-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white rounded-xl font-medium shadow-lg shadow-rose-200/50 transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-xl text-sm sm:text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {editingEvent ? "Update Event" : "Create Event"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EventFormModal
