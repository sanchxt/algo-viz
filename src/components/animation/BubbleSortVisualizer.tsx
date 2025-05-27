import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import type { AlgorithmStep } from "../../types/algorithm";
import { generateBubbleSortSteps } from "../../algorithms/sorting/bubbleSort";

interface BubbleSortVisualizerProps {
  initialArray?: number[];
  speed?: number;
}

const DEFAULT_INITIAL_ARRAY = [64, 34, 25];
const DEFAULT_SPEED = 1000;

const BubbleSortVisualizer: React.FC<BubbleSortVisualizerProps> = ({
  initialArray = DEFAULT_INITIAL_ARRAY,
  speed = DEFAULT_SPEED,
}) => {
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [arrayForSort, setArrayForSort] = useState<number[]>([]);

  useEffect(() => {
    setArrayForSort([...initialArray]);
  }, [initialArray]);

  useEffect(() => {
    if (arrayForSort.length === 0 && initialArray.length > 0) {
      // This handles the case where initialArray is provided but arrayForSort hasn't been set yet
      // (e.g. if initialArray was empty then populated by parent)
      // However, with the current setup, the above useEffect should handle it.
      // For safety or if arrayForSort could be cleared, this might be relevant.
      // For now, let's assume arrayForSort is correctly initialized by the above effect.
    }
    if (arrayForSort.length > 0) {
      const bubbleSortSteps = generateBubbleSortSteps(arrayForSort);
      setSteps(bubbleSortSteps);
      setCurrentStepIndex(0);
      setIsAnimating(false);
    } else {
      setSteps([]);
      setCurrentStepIndex(0);
      setIsAnimating(false);
    }
  }, [arrayForSort]);

  useEffect(() => {
    if (steps.length === 0 || currentStepIndex >= steps.length) {
      setIsAnimating(false);
      return;
    }

    if (currentStepIndex >= steps.length - 1) {
      setIsAnimating(false);
      const lastStep = steps[steps.length - 1];
      if (
        lastStep &&
        lastStep.highlightedIndices.length !== lastStep.arrayState.length &&
        lastStep.arrayState.length > 0
      ) {
        const finalStep = {
          ...lastStep,
          highlightedIndices: lastStep.arrayState.map((_, i) => i),
          explanation:
            "Sort complete! All elements are in their final positions.",
        };
        if (
          JSON.stringify(steps[steps.length - 1]) !== JSON.stringify(finalStep)
        ) {
          setSteps((prevSteps) => [...prevSteps.slice(0, -1), finalStep]);
        }
      }
      return;
    }

    setIsAnimating(true);
    const timer = setTimeout(() => {
      setCurrentStepIndex((prev) => prev + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [currentStepIndex, steps, speed]);

  // loading state or if steps are not yet ready
  if (steps.length === 0 || !steps[currentStepIndex]) {
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
              className="w-3 h-3 bg-gradient-to-r from-[rgb(var(--color-primary-400))] to-[rgb(var(--color-primary-500))] rounded-full"
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
  const maxValue = Math.max(
    ...(arrayForSort.length > 0 ? arrayForSort : [1]),
    1
  );

  const getBarGradient = (index: number, isSorted: boolean): string => {
    if (currentStep.swapIndices?.includes(index)) {
      return "from-[rgb(var(--color-danger-400))] via-[rgb(var(--color-danger-500))] to-[rgb(var(--color-danger-600))]";
    }
    if (currentStep.compareIndices?.includes(index)) {
      return "from-[rgb(var(--color-warning-400))] via-[rgb(var(--color-warning-500))] to-[rgb(var(--color-warning-600))]";
    }
    if (isSorted) {
      return "from-[rgb(var(--color-accent-400))] via-[rgb(var(--color-accent-500))] to-[rgb(var(--color-accent-600))]";
    }
    return "from-[rgb(var(--color-primary-400))] via-[rgb(var(--color-primary-500))] to-[rgb(var(--color-primary-600))]";
  };

  const getBarHeight = (value: number): number => {
    return Math.max(10, (value / maxValue) * 280);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  // bar width calculation
  const numBars = currentStep.arrayState.length;
  const gap = 12;
  const containerPadding = 64;
  const estimatedContainerWidth =
    typeof window !== "undefined"
      ? Math.min(window.innerWidth * 0.8, 1152 - containerPadding)
      : 1152 - containerPadding;
  const barWidth =
    numBars > 0
      ? Math.max(16, (estimatedContainerWidth - (numBars - 1) * gap) / numBars)
      : 16;

  return (
    <div className="w-full max-w-6xl mx-auto">
      <motion.div
        className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[rgb(var(--color-primary-400)/0.3)] to-[rgb(var(--color-primary-600)/0.3)] rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-[rgb(var(--color-secondary-400)/0.3)] to-[rgb(var(--color-secondary-600)/0.3)] rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <motion.div
          className="text-center mb-8 relative z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-white mb-3">
            Bubble Sort Visualization
          </h2>
          <p className="text-gray-300 text-lg font-medium">
            Watch the elegant dance of comparison and swapping
          </p>
        </motion.div>

        <motion.div
          className="flex items-end justify-center gap-3 mb-8 h-80 relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          layout
        >
          {currentStep.arrayState.map((value, index) => {
            const isComparing = currentStep.compareIndices?.includes(index);
            const isSwapping = currentStep.swapIndices?.includes(index);
            const isSorted = currentStep.highlightedIndices?.includes(index);

            return (
              <motion.div
                key={value}
                layout
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.9 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { type: "spring", stiffness: 120, damping: 12 },
                  },
                }}
                custom={index}
                // animate={{
                //   // Overwrite or extend variant animations
                //   y: isSwapping ? -15 : 0,
                //   scale: isComparing || isSwapping ? 1.08 : 1.0,
                //   zIndex: isSwapping ? 10 : isComparing ? 5 : 0,
                // }}
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 25,
                  zIndex: {
                    delay: isSwapping || isComparing ? 0 : speed / 2000,
                    duration: 0.01,
                  },
                }}
                whileHover={{
                  scale: 1.12,
                  y: -8,
                  zIndex: 20,
                  transition: { type: "spring", stiffness: 400, damping: 10 },
                }}
                className="relative group"
              >
                {(isComparing || isSwapping) && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent rounded-xl blur-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                )}
                <motion.div
                  className={`
                    relative flex flex-col items-center justify-end rounded-xl shadow-lg
                    bg-gradient-to-t ${getBarGradient(index, isSorted)}
                    border border-white/20 backdrop-blur-sm
                  `}
                  style={{
                    width: `${barWidth}px`,
                    height: `${getBarHeight(value)}px`,
                  }}
                >
                  {isSwapping && (
                    <motion.div
                      className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 text-xl"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: [0, 1.5, 0], rotate: [0, 180, 360] }}
                      transition={{
                        duration: Math.min(0.6, (speed * 0.5) / 1000),
                        ease: "easeInOut",
                      }}
                    >
                      ✨
                    </motion.div>
                  )}
                  <motion.span
                    className="text-white font-semibold text-sm mb-1.5 drop-shadow-md"
                    animate={{ scale: isComparing || isSwapping ? 1.05 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {value}
                  </motion.span>
                  <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-white/10 to-transparent rounded-b-xl" />
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 mb-6 relative z-10"
          key={`step-info-${currentStepIndex}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="flex justify-between items-center mb-4">
            <motion.span
              className="text-sm font-bold text-gray-200 px-3 py-1 bg-white/20 rounded-full"
              key={`step-counter-${currentStepIndex}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              Step {currentStepIndex + 1} of {steps.length}
            </motion.span>
            <motion.div
              className="flex items-center gap-2"
              animate={{ opacity: isAnimating ? [1, 0.6, 1] : 1 }}
              transition={{ duration: 1, repeat: isAnimating ? Infinity : 0 }}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  isAnimating ? "bg-green-400" : "bg-gray-400"
                }`}
              />
              <span className="text-sm text-gray-200 font-medium">
                {isAnimating
                  ? "Animating"
                  : currentStepIndex >= steps.length - 1 && steps.length > 0
                  ? "Completed"
                  : "Paused"}
              </span>
            </motion.div>
          </div>
          <motion.p
            className="text-gray-100 mb-4 text-lg font-medium leading-relaxed min-h-[3em]"
            key={`explanation-${currentStepIndex}`}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {currentStep?.explanation || "Processing..."}
          </motion.p>
          {currentStep.variables && (
            <motion.div
              className="flex flex-wrap gap-4 text-sm"
              key={`variables-${currentStepIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 rounded-xl border border-blue-400/30">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <span className="text-blue-200 font-semibold">
                  Pass: {(currentStep.variables.outerLoop || 0) + 1}
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/20 rounded-xl border border-emerald-400/30">
                <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                <span className="text-emerald-200 font-semibold">
                  Swaps in pass:{" "}
                  {currentStep.variables.swapsInPass ||
                    currentStep.variables.swaps ||
                    0}
                </span>
              </div>
            </motion.div>
          )}
        </motion.div>
        <motion.div
          className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {[
            {
              color:
                "from-[rgb(var(--color-primary-400))] to-[rgb(var(--color-primary-600))]",
              label: "Default",
              icon: "▪",
            },
            {
              color:
                "from-[rgb(var(--color-warning-400))] to-[rgb(var(--color-warning-600))]",
              label: "Comparing",
              icon: "⚡",
            },
            {
              color:
                "from-[rgb(var(--color-danger-400))] to-[rgb(var(--color-danger-600))]",
              label: "Swapping",
              icon: "⇆",
            },
            {
              color:
                "from-[rgb(var(--color-accent-400))] to-[rgb(var(--color-accent-600))]",
              label: "Sorted",
              icon: "✓",
            },
          ].map((item) => (
            <motion.div
              key={item.label}
              className="flex items-center gap-2.5 px-3.5 py-1.5 backdrop-blur-sm bg-white/10 rounded-lg border border-white/20"
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div
                className={`w-4 h-4 bg-gradient-to-br ${item.color} rounded-md shadow flex items-center justify-center text-white text-xs`}
              >
                {item.icon}
              </div>
              <span className="text-gray-200 font-medium">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BubbleSortVisualizer;
