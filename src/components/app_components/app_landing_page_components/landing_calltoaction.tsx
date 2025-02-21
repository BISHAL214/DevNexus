"use client"

import { motion, useAnimation } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useInView } from "react-intersection-observer"
import { useEffect } from "react"
import { useFirebaseStore } from "@/store/firebase_firestore"

export const LandingPageCallToActionSection = () => {
  const { user } = useFirebaseStore()
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section ref={ref} className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div
          className="bg-gradient-to-r from-indigo-600 via-white/80 to-rose-200 rounded-2xl p-12 text-center"
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          <motion.h2 className="text-3xl font-bold mb-4 text-white" variants={itemVariants}>
            Ready to Elevate Your Developer Journey?
          </motion.h2>
          <motion.p className="text-xl mb-8 text-white/80" variants={itemVariants}>
            Join our community of passionate developers and start building amazing projects today.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link
              href={user ? "/dashboard" : "/auth/signin"}
              className="inline-flex items-center px-6 py-3 rounded-full bg-white text-black font-semibold hover:bg-white/90 transition-colors"
            >
              Get Started <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

