"use client";

import { useAnimation } from "framer-motion";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Props = {};

const LandingPageFaqSection = (props: Props) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

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
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const faqItems = [
    {
        question: "What is DevNexus?",
        answer:
            "DevNexus is a developer collaboration platform that connects developers around the world to work on projects, share knowledge, and build innovative solutions together. Whether you're looking for a co-founder for your startup, a teammate for a hackathon, or a mentor to help you grow your skills, DevNexus has you covered.",
    },
    {
      question:
        "What makes DevNexus unique?",
      answer:
        "DevNexus leverages advanced AI algorithms to analyze developers' skills, project history, and coding styles, creating more meaningful and productive collaborations. Unlike traditional platforms, we focus on synergy and complementary abilities, not just skill matching.",
    },
    {
      question: "How does AI suggest collaborators?",
      answer:
        "Our AI analyzes various factors including your GitHub activity, LinkedIn profile, past projects, and stated preferences. It then suggests potential collaborators whose skills and interests complement yours, increasing the likelihood of successful and innovative partnerships.",
    },
    {
      question: "Is DevNexus only for experienced developers?",
      answer:
        "Not at all! DevNexus caters to developers at all stages of their careers. Whether you're a beginner looking to gain experience, a mid-level developer seeking to expand your network, or a senior developer aiming to mentor others or find co-founders, DevNexus has something for everyone.",
    },
    {
      question:
        "Is DevNexus for personal or professional projects?",
      answer:
        "DevNexus is designed to facilitate collaborations for a wide range of purposes. You can use it to find teammates for hackathons, partners for side projects, co-founders for startups, or even to explore job opportunities and freelance gigs.",
    },
    {
      question:
        "How does DevNexus ensure the privacy and security of user data?",
      answer:
        "At DevNexus, we take data privacy and security very seriously. We employ industry-standard encryption methods, regular security audits, and strict data handling policies. Users have full control over what information they share, and we never sell personal data to third parties. Our AI algorithms are designed to provide suggestions without compromising individual privacy.",
    },
  ];


  return (
    <motion.section
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={containerVariants}
      className="py-20 bg-transparent px-5"
    >
      <motion.h2
        variants={itemVariants}
        className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300"
      >
        Frequently Asked Questions
      </motion.h2>
      <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
        {faqItems.map((item, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="bg-transparent"
          >
            <AccordionTrigger className="text-left text-white hover:no-underline text-md tracking-wide">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-white tracking-wide">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </motion.section>
  );
};

export default LandingPageFaqSection;
