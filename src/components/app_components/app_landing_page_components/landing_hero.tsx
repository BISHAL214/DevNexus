"use client";

import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { cn } from "@/lib/utils";
import { useFirebaseStore } from "@/store/firebase_firestore";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Pacifico } from "next/font/google";
import Link from "next/link";
import AppLogo from "../app_header/app_logo";

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
});

const LandingPageHeroSection = () => {
  const { user, user_loading } = useFirebaseStore();

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8 md:mb-12"
          >
            <AppLogo />
            <span className="text-sm text-white/60 tracking-wide">
              AI-Driven Developer Connections
            </span>
          </motion.div>

          <motion.div
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 md:mb-8 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                Revolutionize Your
              </span>
              <br />
              <span
                className={cn(
                  "bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300",
                  pacifico.className
                )}
              >
                Team Building
              </span>
            </h1>
          </motion.div>

          <motion.div
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <p className="text-base sm:text-lg md:text-xl text-white/40 mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
              Connect with developers who share your skills, interests, and
              vision. Let AI find your ideal teammates for hackathons, projects,
              and startups.
            </p>
          </motion.div>

          <motion.div
            custom={3}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="flex justify-center"
          >
            <HoverBorderGradient
              containerClassName="rounded-full bg-blue-800"
              as="button"
            >
              <Link
                href={user ? "/user/dashboard" : "/auth/signin"}
                className="flex items-center gap-2 px-4 py-1 text-white"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
            </HoverBorderGradient>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LandingPageHeroSection;
