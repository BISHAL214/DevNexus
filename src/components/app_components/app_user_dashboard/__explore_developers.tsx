import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ExploreDevelopers() {
  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input className="flex-1 text-white" placeholder="Search developers..." />
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px] text-white">
            <SelectValue placeholder="Filter by skill" />
          </SelectTrigger>
          <SelectContent className="bg-black">
            <SelectItem className="text-white" value="all">All Skills</SelectItem>
            <SelectItem className="text-white" value="react">React</SelectItem>
            <SelectItem className="text-white" value="node">Node.js</SelectItem>
            <SelectItem className="text-white" value="python">Python</SelectItem>
            <SelectItem className="text-white" value="ai">AI/ML</SelectItem>
          </SelectContent>
        </Select>
        <Button>Search</Button>
      </div>
      <p className="text-sm text-gray-400">
        Use the search bar and filters to find developers matching your criteria.
      </p>
    </div>
  )
}

