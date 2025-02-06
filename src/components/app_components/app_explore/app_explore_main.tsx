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

export default function ExplorePageMain() {
  const [developers, setDevelopers] = useState<
    { id: number; name: string; role: string }[]
  >([]);
  const [hasMore, setHasMore] = useState(true);

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

  return (
    <div className="min-h-screen bg-transparent text-gray-100 py-24">
      <div className="xl:mx-[10rem] px-4">
        <h1 className="text-4xl font-bold mb-8 py-5 text-center gradient-text">
          Explore Developers <span className={pacifico}>Globally</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ExplorePageSearchFilters />
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-2xl font-semibold mb-4">
              AI Recommended Developers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, index) => (
                <DeveloperCard key={index} featured />
              ))}
            </div>

            <h2 className="text-2xl font-semibold mb-4">All Developers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* {developers.map((dev, index) => (
                <div
                  key={dev.id}
                  ref={index === developers.length - 1 ? lastElementRef : null}
                >
                  <DeveloperCard name={dev.name} role={dev.role} />
                </div>
              ))} */}
            </div>
            {/* {loading && (
              <div className="flex justify-center items-center h-[200px]">
                <Loader className="text-white" />
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}

function DeveloperCard({
  featured = false,
  name = "John Doe",
  role = "Full Stack Developer",
}) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
      <Card className="bg-white/5 backdrop-blur-md border-none cursor-pointer shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gray-700"></div>
              <div>
                <CardTitle className="text-lg text-white">{name}</CardTitle>
                <p className="text-sm text-gray-500">{role}</p>
              </div>
            </div>
            <Button>Connect</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between"></div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
