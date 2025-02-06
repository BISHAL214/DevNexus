"use client"

import { IconBrandGithub, IconUsersGroup } from "@tabler/icons-react"
import { motion } from "framer-motion"
import {
  ChartLine,
  MessageSquareText,
  Pin,
  SearchIcon,
  TerminalIcon,
  Zap
} from "lucide-react"
import type React from "react";

export function LandingPageFeaturesSection() {
  const features = [
    {
      title: "Built for developers",
      description: "Built for engineers, developers, dreamers, thinkers and doers",
      icon: <TerminalIcon className="size-6" />,
    },
    {
      title: "AI-Powered Collaboration",
      description: "Intelligent suggestions based on skills and project history",
      icon: <SearchIcon className="size-6" />,
    },
    {
      title: "Seamless Conversations",
      description:
        "Engage in real-time conversations with developers to connect, collaborate, and build together seamlessly",
      icon: <MessageSquareText className="size-6" />,
    },
    {
      title: "GitHub Integration",
      description: "Showcase your open-source contributions and coding activity",
      icon: <IconBrandGithub className="size-6" />,
    },
    {
      title: "Advanced Talent Discovery",
      description: "Find the perfect collaborator with our powerful search tools",
      icon: <ChartLine className="size-6" />,
    },
    {
      title: "Save & Follow Developers",
      description:
        "Follow developers you're interested in and get updates about their work, collaborations, and new projects",
      icon: <Pin className="size-6 rotate-45" />,
    },
    {
      title: "Community Engagement",
      description: "Leaderboards and recognition for top contributors",
      icon: <IconUsersGroup className="size-6" />,
    },
    {
      title: "Fast & Scalable Architecture",
      description: "Built with Next.js, Prisma, PostgreSQL, and WebSockets, ensuring fast performance and scalability",
      icon: <Zap className="size-6 rotate-[10deg]" />,
    },
  ]

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/[0.03] to-transparent" />

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="inline-block text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
            Key Features
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-transparent rounded-2xl overflow-hidden">
          {features.map((feature, index) => (
            <Feature key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string
  description: string
  icon: React.ReactNode
  index: number
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-[#030303] p-6 transition-colors hover:bg-white/[0.02]"
    >
      <div className="absolute inset-px rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-transparent to-rose-500/20 rounded-lg blur-xl" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center justify-center size-12 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/80 group-hover:text-white group-hover:border-white/[0.12] transition-colors">
            {icon}
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-white/[0.08] to-transparent" />
        </div>

        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-white/90 transition-colors">{title}</h3>

        <p className="text-sm text-white/40 group-hover:text-white/50 transition-colors">{description}</p>
      </div>
    </motion.div>
  )
}

