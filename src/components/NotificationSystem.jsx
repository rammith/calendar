"use client"

import { useState, useEffect } from "react"
import { X, Bell, Clock, CheckCircle, AlertTriangle, Info } from "lucide-react"

const NotificationSystem = ({ notifications, setNotifications }) => {
  const [visibleNotifications, setVisibleNotifications] = useState([])

  useEffect(() => {
    setVisibleNotifications(notifications.slice(-3)) // Show only last 3 notifications
  }, [notifications])

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case "reminder":
        return <Bell className="w-4 h-4 text-rose-600" />
      case "upcoming":
        return <Clock className="w-4 h-4 text-orange-600" />
      case "update":
        return <Info className="w-4 h-4 text-emerald-600" />
      case "delete":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      default:
        return <Bell className="w-4 h-4 text-rose-600" />
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case "reminder":
        return "from-rose-100 to-pink-100 border-rose-200"
      case "upcoming":
        return "from-orange-100 to-amber-100 border-orange-200"
      case "update":
        return "from-emerald-100 to-teal-100 border-emerald-200"
      case "delete":
        return "from-red-100 to-rose-100 border-red-200"
      default:
        return "from-rose-100 to-pink-100 border-rose-200"
    }
  }

  if (visibleNotifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {visibleNotifications.map((notification, index) => (
        <div
          key={notification.id}
          className={`bg-gradient-to-r ${getNotificationColor(notification.type)} backdrop-blur-xl rounded-2xl shadow-2xl border p-4 transform transition-all duration-500 animate-in slide-in-from-right ${
            notification.read ? "opacity-75" : ""
          }`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white/50 rounded-xl flex-shrink-0">{getNotificationIcon(notification.type)}</div>

            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-800 text-sm truncate">{notification.title}</h4>
              <p className="text-xs text-gray-600 mt-1 break-words">{notification.message}</p>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-xs text-gray-400">{notification.time}</p>
                {notification.priority && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium
                    ${notification.priority === "High" ? "bg-red-200 text-red-800" : ""}
                    ${notification.priority === "Medium" ? "bg-orange-200 text-orange-800" : ""}
                    ${notification.priority === "Low" ? "bg-emerald-200 text-emerald-800" : ""}
                  `}
                  >
                    {notification.priority}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-1 flex-shrink-0">
              {!notification.read && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="p-1 hover:bg-white/50 rounded-lg transition-colors duration-200"
                  title="Mark as read"
                >
                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                </button>
              )}
              <button
                onClick={() => removeNotification(notification.id)}
                className="p-1 hover:bg-white/50 rounded-lg transition-colors duration-200"
                title="Dismiss"
              >
                <X className="w-3 h-3 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default NotificationSystem
