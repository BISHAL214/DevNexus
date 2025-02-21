"use client";

import { IconFriends, IconRobot } from "@tabler/icons-react";
import { useAnimation } from "framer-motion";
import { Rocket, User } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

type Props = {};

const LandingPageHowItworksSection = (props: Props) => {
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

  const steps = [
    {
      icon: User,
      title: "Create Your Profile",
      description:
        "Sign in and build your comprehensive developer profile. Showcase your skills, experience, and project history.",
    },
    {
      icon: IconRobot,
      title: "AI Analysis",
      description:
        "Our advanced AI analyzes your profile, understanding your unique skills, coding style, and project preferences.",
    },
    {
      icon: IconFriends,
      title: "Discover Collaborators",
      description:
        "Receive AI-powered suggestions for ideal collaborators based on complementary skills and shared interests.",
    },
    {
      icon: Rocket,
      title: "Start Collaborating",
      description:
        "Connect with your new teammates and begin working on exciting projects that match your expertise.",
    },
  ];

  return (
    <section ref={ref} className="py-20 bg-transparent">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="container mx-auto px-4"
      >
        <motion.h2
          variants={itemVariants}
          className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300 text-center mb-12"
        >
          How It Works
        </motion.h2>
        <div className="relative">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex flex-col items-center text-center"
              >
                <div className="relative mb-4">
                  <motion.div
                    className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center"
                    variants={itemVariants}
                  >
                    <step.icon className="text-2xl text-white" />
                  </motion.div>
                </div>
                <h3 className="text-xl text-white font-semibold mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default LandingPageHowItworksSection;
