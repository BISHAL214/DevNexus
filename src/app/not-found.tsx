"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import GeometricBackground from "@/components/app_components/app_background_pattern/app_geometric_background";

export default function NotFound() {
  return (
    <GeometricBackground>
      <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden">
        <div className="w-full max-w-3xl text-center relative">
          {/* Animated background circles */}
          {/* <div className="absolute inset-0 -z-10">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full mix-blend-multiply filter blur-xl opacity-70"
                animate={{
                  scale: [1, 2, 1],
                  x: [0, 100, 0],
                  y: [0, -100, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  delay: i * 2,
                  ease: "easeInOut",
                }}
                style={{
                  width: "300px",
                  height: "300px",
                  left: `${i * 30}%`,
                  top: `${i * 20}%`,
                  backgroundColor:
                    i === 0 ? "#fee2e2" : i === 1 ? "#e2e8f0" : "#ddd6fe",
                }}
              />
            ))}
          </div> */}

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <motion.h1
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              className="text-[150px] font-playwrite font-bold leading-none tracking-tight md:text-[200px] p-5 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300"
            >
              404
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Page not found
              </h2>
              <p className="mx-auto max-w-xs text-muted-foreground sm:max-w-md">
                Sorry, we couldn't find the page you're looking for. The page
                might have been removed or the link might be broken.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 mt-4"
                >
                  <HomeIcon className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </GeometricBackground>
  );
}
