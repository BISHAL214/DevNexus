import { NotificationTypes } from "@/hooks/use-notifications"
import { Bell, MessageSquare, Users2Icon } from "lucide-react"
import { Dispatch, SetStateAction } from "react"

interface NotificationTabsProps {
  activeTab: string
  setActiveTab: Dispatch<SetStateAction<NotificationTypes>>
}

export function NotificationTabs({ activeTab, setActiveTab }: NotificationTabsProps) {
  const tabs = [
    { id: "all", label: "All", icon: Bell },
    { id: "connection_request", label: "Connections", icon: Users2Icon },
    { id: "messages", label: "Messages", icon: MessageSquare },
  ]

  return (
    <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
      {tabs.map((tab) => {
        const Icon = tab.icon
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as NotificationTypes)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
              activeTab === tab.id ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"
            }`}
          >
            <Icon size={18} />
            <span>{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}

