import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

export interface TagInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string
  tags: string[]
  setTags: (tags: string[]) => void
  className?: string
  maxTags?: number
}

export function TagInput({ tags, setTags, className, maxTags = 10, id, ...props }: TagInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [inputValue, setInputValue] = React.useState("")

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim()
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < maxTags) {
      setTags([...tags, trimmedTag])
    }
    setInputValue("")
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === "," || e.key === "Tab") && inputValue.trim()) {
      e.preventDefault()
      addTag(inputValue)
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1])
    }
  }

  const handleBlur = () => {
    if (inputValue.trim()) {
      addTag(inputValue)
    }
  }

  return (
    <div className={cn("flex w-full flex-wrap gap-2 rounded-md border-none bg-transparent text-sm pb-2", className)}>
      <Input
        id={id}
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className="bg-white/5 backdrop-blur-lg h-[4rem] text-xl text-white border-gray-700"
        disabled={tags.length >= maxTags}
        {...props}
      />
      {tags.map((tag) => (
        <Badge key={tag} variant="secondary" className="gap-1 pr-0.5 rounded-full">
          {tag}
          <button
            type="button"
            className="ml-1 rounded-full p-0.5 hover:bg-secondary-foreground/20"
            onClick={(e) => {
              e.stopPropagation()
              removeTag(tag)
            }}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
    </div>
  )
}

