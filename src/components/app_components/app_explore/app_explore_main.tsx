"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import pacifico from "@/constants/font_pacifico";
import { useInfiniteScroll } from "@/hooks/use-infinite_scroll";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ExplorePageSearchFilters from "./app_search_filters";
import { Loader } from "../app_loader/__loader";
import { getRecommendedDevelopers } from "../../../../actions/user_apis";
import { Value } from "@radix-ui/react-select";
import { useFirebaseStore } from "@/store/firebase_firestore";
import {
  RecommendDevsType,
  useRecommendDevs,
} from "@/hooks/use-recommend_devs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { MapPin, MessageCircle, UserPlus, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export default function ExplorePageMain() {
  const [developers, setDevelopers] = useState<
    { id: number; name: string; role: string }[]
  >([]);
  const [hasMore, setHasMore] = useState(true);
  const { devs, devsLoading, devsError } = useRecommendDevs();
  const { user_loading } = useFirebaseStore();

  return (
    <div className="min-h-screen bg-transparent text-gray-100 py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-5 py-3 text-center gradient-text">
          Explore Developers <span className={pacifico}>Globally</span>
        </h1>

        <div className="flex flex-col gap-8">
          <ExplorePageSearchFilters />
          <main className="space-y-8">
            <section>
              {/* <h2 className="text-2xl font-semibold mb-4">
                AI Recommended Developers
              </h2> */}
              {(devsLoading || user_loading) && (
                <div className="w-full h-[20rem] flex justify-center items-center">
                  <Loader className="text-white" />
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {devs?.length > 0 &&
                  devs?.map((dev, index) => (
                    <DeveloperCard
                      index={index}
                      key={dev?.id}
                      featured
                      dev={dev}
                    />
                  ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">All Developers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 20 }, (_, index) => (
                  <div key={index} className="h-[120px] bg-gray-800" />
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

function DeveloperCard({
  featured = false,
  dev,
  index,
}: {
  featured: boolean;
  dev: RecommendDevsType;
  index: number;
}) {
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2, delay: index * 0.1 }}
    >
      <Card
        key={index}
        className="overflow-hidden bg-white/5 hover:shadow-lg transition-shadow border-none"
      >
        <div className="h-32 relative">
          <img
            src={dev.cover_image || ""}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40" />
        </div>
        <div className="p-6 relative">
          <Avatar className="w-20 h-20 border-4 border-black absolute -top-10 left-6 ring-4 ring-white/10 cursor-pointer">
            <AvatarImage src={dev.avatar || ""} alt={dev.name || ""} />
            <AvatarFallback>
              {dev?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="rounded-full p-1 flex justify-center items-center h-9 absolute right-4 border border-yellow-600">
            <span className="text-yellow-500 text-[0.78em]">
              {dev?.score !== null && dev?.score !== undefined
                ? `${Math.ceil(dev.score * 100)}%`
                : "N/A"}
            </span>
          </div>
          <div className="mt-10">
            <h3 className="text-lg font-semibold text-white">{dev.name}</h3>
            <p className="text-sm text-gray-400">{dev.headline}</p>
            <div className="flex flex-wrap gap-2 mt-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span className="text-gray-500">
                  {dev?.location?.city + ", " + dev?.location?.country}
                </span>
              </div>
              {/* <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{dev?.followers?.length}</span>
                      </div> */}
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {dev?.skills?.slice(0, 4).map((skill: any, i: number) => (
                <Badge
                  key={skill?.id}
                  variant="secondary"
                  className="capitalize"
                >
                  {skill?.name}
                </Badge>
              ))}
            </div>
            <div className="flex gap-2 mt-6">
              <Button className="flex-1">
                <UserPlus className="mr-2 h-4 w-4" />
                Connect
              </Button>
              {/* <Button variant="outline" className="flex-1">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Message
                      </Button> */}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// const fetchDevelopers = async () => {
//   setLoading(true);
//   try {
//     await new Promise((resolve) => setTimeout(resolve, 5000));
//     const fakeData = Array.from({ length: 15 }, (_, index) => ({
//       id: developers.length + index + 1,
//       name: `Developer ${developers.length + index + 1}`,
//       role: "Full Stack Developer",
//     }));

//     setDevelopers((prev) => [...prev, ...fakeData]);
//     if (developers.length + 9 >= 100) setHasMore(false);
//   } catch (error) {
//     console.error("Error fetching developers:", error);
//   } finally {
//     setLoading(false);
//   }
// };

// const { lastElementRef, loading, setLoading } = useInfiniteScroll(
//   fetchDevelopers,
//   hasMore
// );

// useEffect(() => {
//   fetchDevelopers();
// }, []);
