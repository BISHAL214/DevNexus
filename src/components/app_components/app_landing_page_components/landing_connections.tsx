"use client";
import { motion, useAnimation } from "framer-motion";
import { Globe, Network, Users } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

const LandingPageGlobalConnectionsSection = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (inView) {
      controls.start("visible");
      setIsVisible(true);
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

  return (
    <section ref={ref} className="py-20 relative z-10">
      <motion.div
        className="container mx-auto px-4"
        initial="hidden"
        animate={controls}
        variants={containerVariants}
      >
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
            Global Developer Network
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Our platform connects developers across the world, fostering
            collaboration and innovation on a global scale.
          </p>
        </motion.div>

        <motion.div
          className="mb-16 h-[400px] md:h-[500px] lg:h-[600px]"
          variants={itemVariants}
        >
          <ConnectionsGraph isVisible={isVisible} />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <motion.div
            variants={itemVariants}
            className="bg-white/5 rounded-lg p-6"
          >
            <div className="flex items-center mb-4">
              <Globe className="w-8 h-8 mr-4 text-indigo-400" />
              <h3 className="text-2xl font-semibold text-white">
                Worldwide Reach
              </h3>
            </div>
            <p className="text-white/70">
              Our platform spans across continents, allowing developers from
              diverse backgrounds to collaborate on groundbreaking projects.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white/5 rounded-lg p-6"
          >
            <div className="flex items-center mb-4">
              <Users className="w-8 h-8 mr-4 text-indigo-400" />
              <h3 className="text-2xl font-semibold text-white">
                Cross-Cultural Teams
              </h3>
            </div>
            <p className="text-white/70">
              Build diverse teams that bring unique perspectives and skills to
              your projects, enhancing creativity and problem-solving.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white/5 rounded-lg p-6"
          >
            <div className="flex items-center mb-4">
              <Network className="w-8 h-8 mr-4 text-indigo-400" />
              <h3 className="text-2xl font-semibold text-white">
                Global Connections
              </h3>
            </div>
            <p className="text-white/70">
              Our network connects major tech hubs worldwide, facilitating
              knowledge sharing and collaborative innovation across borders.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default LandingPageGlobalConnectionsSection;

interface ConnectionsGraphProps {
  isVisible: boolean;
}

const ConnectionsGraph: React.FC<ConnectionsGraphProps> = ({ isVisible }) => {
  const controls = useAnimation();

  // Function to convert lat/long to SVG coordinates
  const latLongToCoord = (lat: number, long: number): [number, number] => {
    const x = (long + 180) * (100 / 360);
    const y = (90 - lat) * (100 / 180);
    return [x, y];
  };

  const nodes = [
    { id: 1, label: "New York", lat: 40.7128, long: -74.006 },
    { id: 2, label: "London", lat: 51.5074, long: -0.1278 },
    { id: 3, label: "Tokyo", lat: 35.6762, long: 139.6503 },
    { id: 4, label: "Sydney", lat: -33.8688, long: 151.2093 },
    { id: 5, label: "São Paulo", lat: -23.5505, long: -46.6333 },
    { id: 6, label: "Cape Town", lat: -33.9249, long: 18.4241 },
  ];

  const edges = [
    { from: 1, to: 2 },
    { from: 1, to: 3 },
    { from: 2, to: 4 },
    { from: 3, to: 5 },
    { from: 4, to: 6 },
    { from: 5, to: 1 },
  ];

  useEffect(() => {
    if (isVisible) {
      controls.start((i) => ({
        pathLength: 1,
        opacity: 1,
        transition: { duration: 1.5, delay: i * 0.2 },
      }));
    }
  }, [isVisible, controls]);

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#9333EA" />
        </linearGradient>
      </defs>

      {/* Connections */}
      {edges.map((edge, index) => {
        const fromNode = nodes.find((n) => n.id === edge.from);
        const toNode = nodes.find((n) => n.id === edge.to);
        const [fromX, fromY] = latLongToCoord(fromNode!.lat, fromNode!.long);
        const [toX, toY] = latLongToCoord(toNode!.lat, toNode!.long);
        return (
          <motion.path
            key={`edge-${index}`}
            d={`M ${fromX} ${fromY} Q ${(fromX + toX) / 2} ${
              Math.min(fromY, toY) - 10
            }, ${toX} ${toY}`}
            stroke="url(#edgeGradient)"
            strokeWidth="0.5"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={controls}
            custom={index}
            filter="url(#glow)"
          />
        );
      })}

      {/* Nodes */}
      {nodes.map((node) => {
        const [x, y] = latLongToCoord(node.lat, node.long);
        return (
          <React.Fragment key={`node-${node.id}`}>
            <motion.circle
              cx={x}
              cy={y}
              r="1.5"
              fill="#4F46E5"
              initial={{ scale: 0, opacity: 0 }}
              animate={
                isVisible ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }
              }
              transition={{ duration: 0.5, delay: node.id * 0.1 }}
              filter="url(#glow)"
            />
            <motion.text
              x={x}
              y={y + 3}
              fontSize="2"
              textAnchor="middle"
              fill="#FFFFFF"
              opacity={0.9}
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 0.9 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: node.id * 0.1 }}
            >
              {node.label}
            </motion.text>
          </React.Fragment>
        );
      })}
    </svg>
  );
};
