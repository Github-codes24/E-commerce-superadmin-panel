import React, { useState } from 'react'
import {
  UserPlus,
  Store,
  RotateCcw,
  Package,
  CreditCard,
  ArrowLeft,
  Clock,
  Calendar,
  CheckCheck,
  Bell,
  Check
} from 'lucide-react'
import './Notifications.css'

function formatTimestamp(timestampStr) {
  try {
    const date = new Date(timestampStr)
    if (isNaN(date.getTime())) {
      return {
        relative: timestampStr,
        fullFormatted: timestampStr,
        dateFormatted: '',
        timeFormatted: ''
      }
    }

    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHours = Math.floor(diffMin / 60)
    const diffDays = Math.floor(diffHours / 24)

    // Full exact date and time formatting (e.g. "02 Oct 2026, 04:30 PM")
    const dateFormatted = date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
    const timeFormatted = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
    const fullFormatted = `${dateFormatted} • ${timeFormatted}`

    // Clearly defined relative format
    let relative = ''
    if (diffMin < 1) {
      relative = 'Just now'
    } else if (diffMin < 60) {
      relative = `${diffMin}m ago`
    } else if (diffHours < 24) {
      relative = `${diffHours}h ago`
    } else if (diffDays === 1) {
      relative = 'Yesterday'
    } else if (diffDays < 7) {
      relative = `${diffDays} days ago`
    } else {
      relative = dateFormatted
    }

    return {
      relative,
      fullFormatted,
      dateFormatted,
      timeFormatted
    }
  } catch {
    return {
      relative: timestampStr,
      fullFormatted: timestampStr,
      dateFormatted: '',
      timeFormatted: ''
    }
  }
}

function Notifications({ onBack }) {
  // Pre-configured timestamps with recent, yesterday, and earlier dates
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Customer Registered',
      description: 'Customer "Rahul Verma" (rahul.v@gmail.com) created a new verified account.',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8h ago
      category: 'Customer',
      icon: UserPlus,
      unread: true,
    },
    {
      id: 2,
      title: 'New Vendor Arrived',
      description: 'Vendor "Apex Electronics" submitted documents for onboarding verification.',
      timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(), // 9h ago
      category: 'Vendor',
      icon: Store,
      unread: true,
    },
    {
      id: 3,
      title: 'Order Returned',
      description: 'Return request initiated for Order #ORD-8924 due to defective item report.',
      timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), // 10h ago
      category: 'Orders',
      icon: RotateCcw,
      unread: true,
    },
    {
      id: 4,
      title: 'Low Stock Alert',
      description: 'Product "Wireless Noise-Canceling Headphones" inventory is below minimum threshold (4 remaining).',
      timestamp: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(), // Yesterday (~28h ago)
      category: 'Inventory',
      icon: Package,
      unread: false,
    },
    {
      id: 5,
      title: 'Payout Disbursed',
      description: 'Weekly vendor commission payout of ₹45,200 successfully credited to TechWorld Store.',
      timestamp: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(), // 4 days ago
      category: 'Payments',
      icon: CreditCard,
      unread: false,
    },
  ])

  const [filter, setFilter] = useState('all') // 'all' | 'unread'

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, unread: false }))
    )
  }

  const toggleNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    )
  }

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return n.unread
    return true
  })

  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <div className="notifications-panel">
      {/* Header with Back Navigation and Actions */}
      <div className="notifications-header-wrapper">
        <div className="notifications-title-row">
          {onBack && (
            <button
              type="button"
              className="back-circle-btn"
              onClick={onBack}
              title="Back"
              aria-label="Back to previous page"
            >
              <ArrowLeft style={{ width: '18px', height: '18px' }} />
            </button>
          )}
          <div className="notifications-title-text">
            <h1>Notifications</h1>
            <p>Stay updated with live system activities, alerts, and customer interactions</p>
          </div>
        </div>

        <div className="notifications-top-actions">
          <div className="notifications-filters">
            <button
              type="button"
              className={`filter-chip ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              className={`filter-chip ${filter === 'unread' ? 'active' : ''}`}
              onClick={() => setFilter('unread')}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              className="mark-read-btn"
              onClick={markAllAsRead}
              title="Mark all notifications as read"
            >
              <CheckCheck style={{ width: '16px', height: '16px' }} />
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="empty-notifications-state">
            <Bell style={{ width: '40px', height: '40px', color: '#9e9e9e', marginBottom: '12px' }} />
            <h3>No notifications to display</h3>
            <p>You're all caught up! When new activities occur, they will appear here with full timestamps.</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const Icon = notification.icon
            const timeInfo = formatTimestamp(notification.timestamp)

            return (
              <div
                key={notification.id}
                className={`notification-card ${notification.unread ? 'unread' : 'read'}`}
                onClick={() => toggleNotificationRead(notification.id)}
                title="Click to toggle read/unread"
              >
                <div className="notification-left-content">
                  <div className="notification-icon-wrapper">
                    <Icon />
                  </div>
                  <div className="notification-message-block">
                    <div className="notification-msg-header">
                      <span className="notification-msg-title">
                        {notification.title}
                      </span>
                      {notification.category && (
                        <span className="notification-category-tag">
                          {notification.category}
                        </span>
                      )}
                      {notification.unread && (
                        <span className="unread-dot-badge" title="Unread" />
                      )}
                    </div>
                    <div className="notification-msg-desc">
                      {notification.description}
                    </div>
                  </div>
                </div>

                <div className="notification-right-content">
                  <div className="timestamp-badge-group">
                    <span className="notification-relative-badge" title={`Relative time: ${timeInfo.relative}`}>
                      <Clock style={{ width: '13px', height: '13px' }} />
                      {timeInfo.relative}
                    </span>
                    <span className="notification-exact-time" title={`Exact timestamp: ${timeInfo.fullFormatted}`}>
                      <Calendar style={{ width: '13px', height: '13px' }} />
                      {timeInfo.fullFormatted}
                    </span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Notifications
