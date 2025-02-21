import { useCallback, useRef, useState } from "react"

type UseInfiniteScrollReturn = {
  lastElementRef: (node: HTMLDivElement | null) => void
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export const useInfiniteScroll = (fetchData: () => void, hasMore: boolean): UseInfiniteScrollReturn => {
  const [loading, setLoading] = useState(false)
  const observer = useRef<IntersectionObserver | null>(null)

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchData()
        }
      })
      if (node) observer.current.observe(node)
    },
    [loading, hasMore, fetchData],
  )

  return { lastElementRef, loading, setLoading }
}

