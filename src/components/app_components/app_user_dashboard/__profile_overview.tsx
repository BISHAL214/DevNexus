import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function ProfileOverview() {
  return (
    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src="/avatars/01.png" alt="John Doe" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <div className="space-y-2 text-center sm:text-left">
        <h2 className="text-2xl text-white font-bold">John Doe</h2>
        <p className="text-sm text-gray-400">Full Stack Developer</p>
        <div className="flex flex-wrap justify-center sm:justify-start gap-2">
          <Badge>React</Badge>
          <Badge>Node.js</Badge>
          <Badge>TypeScript</Badge>
          <Badge>GraphQL</Badge>
        </div>
        <Button variant="outline" size="sm">
          Available for hire
        </Button>
      </div>
    </div>
  )
}

