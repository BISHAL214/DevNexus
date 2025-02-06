import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const recommendations = [
  {
    name: "Alice Johnson",
    role: "Frontend Developer",
    avatar: "/avatars/02.png",
    skills: ["React", "Vue.js", "CSS"],
  },
  {
    name: "Bob Smith",
    role: "Backend Developer",
    avatar: "/avatars/03.png",
    skills: ["Node.js", "Python", "MongoDB"],
  },
  {
    name: "Carol Williams",
    role: "Full Stack Developer",
    avatar: "/avatars/04.png",
    skills: ["JavaScript", "Ruby on Rails", "PostgreSQL"],
  },
]

export function DeveloperRecommendations() {
  return (
    <div className="space-y-4">
      {recommendations.map((dev) => (
        <div key={dev.name} className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <Avatar className="h-9 w-9">
            <AvatarImage src={dev.avatar} alt={dev.name} />
            <AvatarFallback>{dev.name[0]}</AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex-grow">
            <p className="text-sm text-white font-medium leading-none">{dev.name}</p>
            <p className="text-sm text-muted-foreground">{dev.role}</p>
          </div>
          <Button variant="outline" size="sm">
            Connect
          </Button>
        </div>
      ))}
    </div>
  )
}

