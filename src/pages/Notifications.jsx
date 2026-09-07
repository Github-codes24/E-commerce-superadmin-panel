import React from 'react'
import { UserPlus, Store, RotateCcw } from 'lucide-react'
import './Notifications.css'


function Notifications() {
  const notificationsList = [
    {
      id: 1,
      title: 'New Customer Registered',
      description: 'Lorem ipsum dolor sit amet consectetur. Lacus commodo in elementum facilisis amet..',
      time: '8h ago',
      icon: UserPlus,
    },
    {
      id: 2,
      title: 'New Vendor Arrived',
      description: 'Lorem ipsum dolor sit amet consectetur. Lacus commodo in elementum facilisis amet..',
      time: '9h ago',
      icon: Store,
    },
    {
      id: 3,
      title: 'Order Returned',
      description: 'Lorem ipsum dolor sit amet consectetur. Lacus commodo in elementum facilisis amet..',
      time: '10h ago',
      icon: RotateCcw,
    },
  ]

  return (
    <div className="notifications-panel">
      <div className="notifications-title-row">
        <h1>Notifications</h1>
      </div>

      <div className="notifications-list">
        {notificationsList.map((notification) => {
          const Icon = notification.icon
          return (
            <div key={notification.id} className="notification-card">
              <div className="notification-left-content">
                <div className="notification-icon-wrapper">
                  <Icon />
                </div>
                <div className="notification-message-block">
                  <div className="notification-msg-title">
                    {notification.title}
                  </div>
                  <div className="notification-msg-desc">
                    {notification.description}
                  </div>
                </div>
              </div>
              <div className="notification-right-content">
                {notification.time}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Notifications
