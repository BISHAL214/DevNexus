"use client"

import { motion, useAnimation } from "framer-motion"
import { Code, Rocket, Users, Zap } from "lucide-react"
import { useEffect } from "react"
import { useInView } from "react-intersection-observer"

export const LandingPageCollaborationsSection = () => {
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

  const steps = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Connect",
      description: "Find developers with matching skills and interests",
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "Collaborate",
      description: "Work together on exciting projects using our platform",
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Launch",
      description: "Showcase your work and gain recognition in the community",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Grow",
      description: "Expand your network and enhance your skills",
    },
  ]

  return (
    <section ref={ref} className="py-20 relative z-10">
      <motion.div className="container mx-auto px-4" initial="hidden" animate={controls} variants={containerVariants}>
        <motion.h2
          className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300"
          variants={itemVariants}
        >
          Your Journey to Successful Collaboration
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div key={step.title} className="text-center" variants={itemVariants}>
              <div className="bg-white/5 rounded-full p-4 inline-block mb-4 text-white">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-white">{step.title}</h3>
              <p className="text-white/60">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

