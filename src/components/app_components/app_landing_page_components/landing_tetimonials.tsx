"use client";

import { motion, useAnimation } from "framer-motion";
import { fadeInUp } from "./landing_page_main";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Pacifico } from "next/font/google";

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
});


export const LandingPageTestimonialSection = () => {
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

  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Full Stack Developer",
      quote:
        "This platform has revolutionized how I collaborate on projects. The AI-driven matching is spot on!",
    },
    {
      name: "Samantha Lee",
      role: "UX Designer",
      quote:
        "I've met incredible developers here and launched my dream project. The community support is unmatched.",
    },
    {
      name: "Michael Chen",
      role: "Data Scientist",
      quote:
        "As someone looking to break into tech, this platform provided the perfect launchpad for my career.",
    },
  ];

  return (
    <section ref={ref} className="py-20 relative z-10">
      <motion.div
        className="container mx-auto px-4"
        initial="hidden"
        animate={controls}
        variants={containerVariants}
      >
        <motion.h2
          className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300"
          variants={itemVariants}
        >
          What <span className={`${pacifico.className} text-4xl`}>Developers</span> Are Saying
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              className="bg-white/5 rounded-lg p-6 hover:bg-white/10 transition-colors"
              variants={itemVariants}
            >
              <p className="text-white/80 mb-4">"{testimonial.quote}"</p>
              <div>
                <p className="font-semibold text-white">{testimonial.name}</p>
                <p className="text-white/60">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};
