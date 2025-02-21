import { AnimatePresence } from "framer-motion"
import { NotificationItem } from "./app_notifications_items"

export interface Notification {
  id: string
  type: string
  typeId: string
  message: string
  createdAt: string
  sender: {
    id: string
    name: string
    avatar: string
    slug: string
  }
  reciever: {
    id: string
    name: string
    avatar: string
  }
  isRead: boolean
}

interface NotificationListProps {
  notifications: Notification[]
}

export function NotificationList({ notifications }: NotificationListProps) {

  // console.log("🔔 Notifications:", notifications)

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {notifications.map((notification) => (
          <NotificationItem
            id={notification.id}
            key={notification.id}
            type={notification.type}
            message={notification.message}
            createdAt={notification.createdAt}
            sender={notification.sender}
            reciever={notification.reciever}
            isRead={notification.isRead}
            typeId={notification.typeId}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

