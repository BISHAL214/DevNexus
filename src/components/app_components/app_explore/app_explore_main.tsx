"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import pacifico from "@/constants/font_pacifico"
import { motion } from "framer-motion"
import { useEffect, useState, useCallback } from "react"
import ExplorePageSearchFilters from "./app_search_filters"
import { Loader } from "../app_loader/__loader"
import { useFirebaseStore } from "@/store/firebase_firestore"
import { type RecommendDevsType, useRecommendDevs } from "@/hooks/use-recommend_devs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, UserPlus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { type Developer, useAllDevs } from "@/hooks/use-all-devs"
import { toast } from "sonner"
import { filter_all_devs } from "@/lib/filter_all_devs"
import { Separator } from "@/components/ui/separator"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import { useInfiniteScroll } from "@/hooks/use-infinite_scroll"
import { forwardRef } from "react"

export default function ExplorePageMain() {
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [filteredAllDevs, setFilteredAllDevs] = useState<Developer[]>([])
  const [displayedDevs, setDisplayedDevs] = useState<Developer[]>([])

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(8)
  const [isMobile, setIsMobile] = useState<boolean>(false)

  const { user_loading, user } = useFirebaseStore()
  const { devs, devsLoading, devsError } = useRecommendDevs()
  const { all_developers, all_devs_loading, all_devs_error } = useAllDevs()

  const totalPages = Math.ceil(filteredAllDevs.length / itemsPerPage)

  const loadMoreDevs = useCallback(() => {
    const nextDevs = filteredAllDevs.slice(displayedDevs.length, displayedDevs.length + itemsPerPage)
    setDisplayedDevs((prev) => [...prev, ...nextDevs])
    setHasMore(displayedDevs.length + nextDevs.length < filteredAllDevs.length)
  }, [filteredAllDevs, displayedDevs, itemsPerPage])

  const { lastElementRef, loading, setLoading } = useInfiniteScroll(loadMoreDevs, hasMore)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768 // md breakpoint
      setIsMobile(mobile)
      if (window.innerWidth >= 1280) {
        setItemsPerPage(8) // 2x4 grid
      } else if (window.innerWidth >= 1024) {
        setItemsPerPage(6) // 2x3 grid
      } else if (window.innerWidth >= 768) {
        setItemsPerPage(4) // 2x2 grid
      } else {
        setItemsPerPage(6) // 6x1 grid for small and extra small devices (infinite scroll)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if(!user && all_developers.length > 0) {
      setFilteredAllDevs(all_developers)
      setDisplayedDevs(all_developers.slice(0, itemsPerPage))
      setHasMore(all_developers.length > itemsPerPage)
    }
    if (devs.length > 0) {
      const filtered_all_devs = filter_all_devs(all_developers, devs, user ? user?.id : "")
      setFilteredAllDevs(filtered_all_devs)
      setDisplayedDevs(filtered_all_devs.slice(0, itemsPerPage))
      setHasMore(filtered_all_devs.length > itemsPerPage)
    }
  }, [devs, all_developers, user, itemsPerPage])

  useEffect(() => {
    if (!isMobile) {
      const startIndex = (currentPage - 1) * itemsPerPage
      setDisplayedDevs(filteredAllDevs.slice(startIndex, startIndex + itemsPerPage))
    }
  }, [currentPage, itemsPerPage, filteredAllDevs, isMobile])

  if (devsError) {
    toast.error(devsError || "Error fetching recommended developers")
  }

  if (all_devs_error) {
    toast.error(all_devs_error || "Error fetching all developers")
  }

  return (
    <div className="min-h-screen bg-transparent text-gray-100 py-20">
      <div className="container mx-auto px-1 md:px-4">
        <h1 className="text-4xl font-bold mb-5 py-3 text-center gradient-text">
          Explore Developers <span className={pacifico}>Globally</span>
        </h1>

        <div className="flex flex-col gap-10">
          <ExplorePageSearchFilters />
          <main className="space-y-10">
            <section>
              {(devsLoading || user_loading || all_devs_loading) && (
                <div className="w-full h-[80vh] flex justify-center items-center">
                  <Loader className="text-white" />
                </div>
              )}
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full mb-5"
              >
                <CarouselContent className="-ml-4">
                  {devs?.map((dev, index) => (
                    <CarouselItem key={dev.id} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                      <DeveloperCard featured index={index} dev={dev} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="hidden lg:flex absolute left-8 xl:left-0 top-[50%] justify-start gap-2 mt-4">
                  <CarouselPrevious className="relative text-white bg-transprent border-none bg-white/10 hover:bg-white/10 hover:text-white" />
                </div>
                <div className="hidden lg:flex absolute right-8 xl:right-0 top-[50%] justify-end mt-4">
                  <CarouselNext className="relative text-white bg-white/20 border-none hover:bg-white/10 hover:text-white" />
                </div>
              </Carousel>
            </section>
            {(!all_devs_loading && user) && <Separator />}
            <section>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayedDevs.map((dev, index) => (
                  <DeveloperCard
                    key={dev.id}
                    index={index}
                    dev={dev}
                    featured={false}
                    ref={index === displayedDevs.length - 1 ? lastElementRef : null}
                  />
                ))}
              </div>
              {loading && (
                <div className="w-full flex justify-center items-center mt-4">
                  <Loader className="text-white" />
                </div>
              )}
              {!isMobile && (
                <div className="mt-8 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          isActive={currentPage > 1}
                          className={`bg-transparent ${
                            currentPage > 1
                              ? "cursor-pointer text-white hover:bg-gray-700 hover:text-white"
                              : "cursor-default text-gray-600 hover:bg-transparent hover:text-gray-600"
                          } `}
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        />
                      </PaginationItem>
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        let pageNumber
                        if (totalPages <= 5) {
                          pageNumber = i + 1
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i
                        } else {
                          pageNumber = currentPage - 2 + i
                        }
                        return (
                          <PaginationItem key={i}>
                            <PaginationLink
                              onClick={() => setCurrentPage(pageNumber)}
                              isActive={currentPage === pageNumber}
                              className="bg-transparent cursor-pointer text-white hover:bg-gray-700 hover:text-white"
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      })}
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationNext
                          className={`bg-transparent ${
                            currentPage < totalPages
                              ? "cursor-pointer text-white hover:bg-gray-700 hover:text-white"
                              : "cursor-default text-gray-600 hover:bg-transparent hover:text-gray-600"
                          } `}
                          isActive={currentPage < totalPages}
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}

const DeveloperCard = forwardRef(
  (
    {
      featured = false,
      dev,
      index,
    }: {
      featured?: boolean
      dev: RecommendDevsType | Developer
      index: number
    },
    ref: React.Ref<HTMLDivElement>,
  ) => {
    const router = useRouter()
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2, delay: index * 0.2 }}
        className="shadow-xl cursor-pointer"
        onClick={() => router.push(`/user/profile/${dev?.slug}`)}
      >
        <Card
          key={index}
          className="overflow-hidden bg-white/5 backdrop-blur-md shadow-lg transition-shadow border-none"
        >
          <div className="h-32 relative">
            <img src={dev.cover_image || ""} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40" />
          </div>
          <div className="p-6 relative">
            <Avatar className="w-20 h-20 border-4 border-black absolute -top-10 left-6 ring-4 ring-white/10">
              <AvatarImage src={dev.avatar || ""} alt={dev.name || ""} />
              <AvatarFallback>
                {dev?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            {featured && dev?.score && (
              <div className="rounded-full p-1 flex justify-center items-center h-9 absolute right-4 border border-yellow-600">
                <span className="text-yellow-500 text-[0.78em]">{`${Math.ceil(dev?.score * 100)}%`}</span>
              </div>
            )}
            <div className="mt-10">
              <h3 className="text-lg font-semibold text-white capitalize line-clamp-1">{dev.name}</h3>
              <p className="text-sm text-gray-400 capitalize line-clamp-1">{dev.headline}</p>
              <div className="flex flex-wrap gap-2 mt-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  <span className="text-gray-500 line-clamp-1">
                    {dev?.location?.city + ", " + dev?.location?.country}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {dev?.skills?.slice(0, 3).map((skill: any, i: number) => (
                  <Badge key={skill?.id} variant="secondary" className="capitalize">
                    {skill?.name}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2 mt-6">
                <Button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    console.log("clicked")
                  }}
                  className="flex-1"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Connect
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    )
  },
)

DeveloperCard.displayName = "DeveloperCard"

