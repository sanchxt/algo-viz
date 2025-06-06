import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

import type { AlgorithmCategory } from "@/constants/algorithmCategories";

interface AlgorithmCardProps {
  category: AlgorithmCategory;
  index: number;
}

export const AlgorithmCard = ({ category, index }: AlgorithmCardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 200, damping: 30, bounce: 0 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  const rotateX = useTransform(mouseYSpring, [-150, 150], [15, -15]);
  const rotateY = useTransform(mouseXSpring, [-150, 150], [-15, 15]);

  const glareX = useTransform(mouseXSpring, [-150, 150], [250, -50]);
  const glareY = useTransform(mouseYSpring, [-150, 150], [150, -150]);
  const glareOpacity = useTransform(
    [mouseXSpring, mouseYSpring],
    (latest: number[]) => {
      const [currentX, currentY] = latest;
      return Math.abs(currentX) > 5 || Math.abs(currentY) > 5 ? 1 : 0;
    }
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const hasAlgorithms = category.algorithms.length > 0;
  const isClickable = hasAlgorithms;

  const cardContent = (
    <div
      className={`relative backdrop-blur-xl bg-gradient-to-br ${
        isClickable ? category.color.gradient : "from-slate-800 to-slate-900"
      } border ${
        isClickable ? category.color.border : "border-white/10"
      } rounded-2xl p-6 transition-all duration-300 shadow-xl h-full flex flex-col ${
        !isClickable && "opacity-60"
      } group-hover:border-white/20`}
      style={{
        transform: "translateZ(50px)",
        transformStyle: "preserve-3d",
      }}
    >
      {/* glare effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${glareX}px ${glareY}px, rgba(255,255,255,0.15), transparent 40%)`,
          opacity: glareOpacity,
          transition: "opacity 0.2s",
        }}
      />

      {/* card inner content */}
      <div
        className="flex flex-col flex-grow"
        style={{ transform: "translateZ(25px)" }}
      >
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-4">
            <div className={`text-3xl ${!isClickable && "grayscale"}`}>
              {category.icon}
            </div>
            {isClickable ? (
              <div
                className={`px-2 py-1 bg-white/10 ${category.color.text} rounded-full text-xs font-medium border border-white/20`}
              >
                {category.algorithms.length} algorithm
                {category.algorithms.length !== 1 ? "s" : ""}
              </div>
            ) : (
              <div className="px-2 py-1 bg-white/5 text-gray-500 rounded-full text-xs font-medium border border-white/10">
                Coming Soon
              </div>
            )}
          </div>
          <h3
            className={`text-lg font-semibold mb-3 ${
              isClickable ? "text-white" : "text-gray-400"
            }`}
          >
            {category.name}
          </h3>
          <p
            className={`text-sm leading-relaxed mb-4 line-clamp-3 ${
              isClickable ? "text-gray-300" : "text-gray-500"
            }`}
          >
            {category.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          {isClickable ? (
            <>
              <span className="text-xs text-gray-400 font-medium">
                Ready to explore
              </span>
              <motion.div className="text-white group-hover:translate-x-1 transition-transform">
                →
              </motion.div>
            </>
          ) : (
            <>
              <span className="text-xs text-gray-500 font-medium">
                Under development
              </span>
              <span className="text-gray-500">⏳</span>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
      whileHover={{ scale: 1.03 }}
      style={{
        transformStyle: "preserve-3d",
        perspective: "800px",
        rotateX,
        rotateY,
      }}
      className="group h-full"
    >
      {isClickable ? (
        <Link to={`/categories/${category.id}`} className="block h-full">
          {cardContent}
        </Link>
      ) : (
        <div className="cursor-not-allowed h-full">{cardContent}</div>
      )}
    </motion.div>
  );
};
