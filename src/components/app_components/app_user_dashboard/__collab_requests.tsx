import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const requests = [
  {
    name: "David Lee",
    project: "E-commerce Platform",
    avatar: "/avatars/05.png",
  },
  {
    name: "Emma Garcia",
    project: "AI Chatbot",
    avatar: "/avatars/06.png",
  },
  {
    name: "Frank Chen",
    project: "Mobile Game",
    avatar: "/avatars/07.png",
  },
]

export function CollaborationRequests() {
  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div
          key={request.name}
          className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={request.avatar} alt={request.name} />
            <AvatarFallback>{request.name[0]}</AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex-grow">
            <p className="text-sm text-white font-medium leading-none">{request.name}</p>
            <p className="text-sm text-muted-foreground">{request.project}</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              Decline
            </Button>
            <Button size="sm">Accept</Button>
          </div>
        </div>
      ))}
    </div>
  )
}

