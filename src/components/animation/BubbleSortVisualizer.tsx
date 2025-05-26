import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import type { AlgorithmStep } from "../../types/algorithm";
import { generateBubbleSortSteps } from "../../algorithms/sorting/bubbleSort";

interface BubbleSortVisualizerProps {
  initialArray?: number[];
  speed?: number;
}

const BubbleSortVisualizer: React.FC<BubbleSortVisualizerProps> = ({
  initialArray = [64, 34, 25, 12, 22, 11, 90],
  speed = 1200,
}) => {
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const bubbleSortSteps = generateBubbleSortSteps(initialArray);
    setSteps(bubbleSortSteps);
  }, [initialArray]);

  useEffect(() => {
    if (steps.length === 0) return;

    const timer = setTimeout(() => {
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex((prev) => prev + 1);
        setIsAnimating(true);
      } else {
        setIsAnimating(false);
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [currentStepIndex, steps.length, speed]);

  if (steps.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          className="flex space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>
    );
  }

  const currentStep = steps[currentStepIndex];
  const maxValue = Math.max(...initialArray);

  const getBarGradient = (index: number): string => {
    if (currentStep.swapIndices?.includes(index)) {
      return "from-red-400 via-pink-500 to-red-600";
    }
    if (currentStep.compareIndices?.includes(index)) {
      return "from-yellow-400 via-orange-400 to-yellow-600";
    }
    if (currentStep.highlightedIndices?.includes(index)) {
      return "from-green-400 via-emerald-500 to-green-600";
    }
    return "from-blue-400 via-indigo-500 to-blue-600";
  };

  const getBarHeight = (value: number): number => {
    return (value / maxValue) * 280;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const barVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* modern glass card container */}
      <motion.div
        className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* background gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-purple-600/30 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/30 to-orange-600/30 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        {/* title section */}
        <motion.div
          className="text-center mb-8 relative z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 via-gray-900 to-black bg-clip-text text-transparent mb-3">
            Bubble Sort Visualization
          </h2>
          <p className="text-gray-600 text-lg font-medium">
            Watch the elegant dance of comparison and swapping
          </p>
        </motion.div>

        {/* array visualization */}
        <motion.div
          className="flex items-end justify-center gap-3 mb-8 h-80 relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {currentStep.arrayState.map((value, index) => (
            <motion.div
              key={`bar-${index}`}
              className="relative group"
              variants={barVariants}
              layout
              whileHover={{ scale: 1.05 }}
            >
              {/* glow effect for active bars */}
              {(currentStep.compareIndices?.includes(index) ||
                currentStep.swapIndices?.includes(index)) && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent rounded-2xl blur-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                />
              )}

              <motion.div
                className={`
                    relative flex flex-col items-center justify-end rounded-2xl shadow-2xl
                    bg-gradient-to-t ${getBarGradient(index)}
                    border border-white/30 backdrop-blur-sm
                  `}
                style={{
                  width: "48px",
                  height: `${getBarHeight(value)}px`,
                }}
                animate={{
                  scale:
                    currentStep.compareIndices?.includes(index) ||
                    currentStep.swapIndices?.includes(index)
                      ? [1, 1.15, 1.05]
                      : 1,
                  y: currentStep.swapIndices?.includes(index) ? [-8, 0] : 0,
                  rotateY: currentStep.swapIndices?.includes(index)
                    ? [0, 10, -10, 0]
                    : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  duration: 0.4,
                }}
              >
                {/* sparkle effect for swapping elements */}
                {currentStep.swapIndices?.includes(index) && (
                  <motion.div
                    className="absolute -top-2 left-1/2 transform -translate-x-1/2"
                    initial={{ scale: 0, rotate: 0 }}
                    animate={{ scale: [0, 1, 0], rotate: [0, 180, 360] }}
                    transition={{ duration: 0.6 }}
                  >
                    ✨
                  </motion.div>
                )}

                {/* value label */}
                <motion.span
                  className="text-white font-bold text-lg mb-2 drop-shadow-lg"
                  animate={{
                    scale:
                      currentStep.compareIndices?.includes(index) ||
                      currentStep.swapIndices?.includes(index)
                        ? 1.1
                        : 1,
                  }}
                >
                  {value}
                </motion.span>

                {/* reflection effect */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white/10 to-transparent rounded-b-2xl" />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* step information card */}
        <motion.div
          className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 mb-6 relative z-10"
          layout
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-4">
            <motion.span
              className="text-sm font-bold text-gray-700 px-3 py-1 bg-white/20 rounded-full"
              key={currentStepIndex}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              Step {currentStepIndex + 1} of {steps.length}
            </motion.span>
            <motion.div
              className="flex items-center gap-2"
              animate={{
                opacity: isAnimating ? [1, 0.5, 1] : 1,
              }}
              transition={{ duration: 1, repeat: isAnimating ? Infinity : 0 }}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  isAnimating ? "bg-green-400" : "bg-gray-400"
                }`}
              />
              <span className="text-sm text-gray-600 font-medium">
                {isAnimating ? "Animating" : "Complete"}
              </span>
            </motion.div>
          </div>

          <motion.p
            className="text-gray-800 mb-4 text-lg font-medium leading-relaxed"
            key={currentStep.explanation}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {currentStep.explanation}
          </motion.p>

          {currentStep.variables && (
            <motion.div
              className="flex gap-6 text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 rounded-xl border border-blue-300/30">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-blue-700 font-semibold">
                  Pass: {(currentStep.variables.outerLoop || 0) + 1}
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/20 rounded-xl border border-emerald-300/30">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-emerald-700 font-semibold">
                  Swaps: {currentStep.variables.swaps || 0}
                </span>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* legend */}
        <motion.div
          className="flex justify-center gap-8 text-sm relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {[
            {
              color: "from-blue-400 to-blue-600",
              label: "Unsorted",
              icon: "◯",
            },
            {
              color: "from-yellow-400 to-yellow-600",
              label: "Comparing",
              icon: "⚡",
            },
            { color: "from-red-400 to-red-600", label: "Swapping", icon: "🔄" },
            {
              color: "from-green-400 to-green-600",
              label: "Sorted",
              icon: "✓",
            },
          ].map((item) => (
            <motion.div
              key={item.label}
              className="flex items-center gap-3 px-4 py-2 backdrop-blur-sm bg-white/10 rounded-xl border border-white/20"
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div
                className={`w-5 h-5 bg-gradient-to-br ${item.color} rounded-lg shadow-lg flex items-center justify-center text-white text-xs`}
              >
                {item.icon}
              </div>
              <span className="text-gray-700 font-medium">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BubbleSortVisualizer;
