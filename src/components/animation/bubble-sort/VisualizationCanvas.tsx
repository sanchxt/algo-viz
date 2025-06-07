// components/animation/bubble-sort/VisualizationCanvas.tsx
import { motion } from "framer-motion";

import type { EnhancedAlgorithmStep } from "@/types/algorithm";

interface VisualizationCanvasProps {
  currentStep: EnhancedAlgorithmStep;
  arrayForSort: number[];
  speed: number;
}

const VisualizationCanvas = ({
  currentStep,
  arrayForSort,
  speed,
}: VisualizationCanvasProps) => {
  // Extract array data from the new structure
  const arrayData = currentStep.dataStructures.sortArray?.data || arrayForSort;
  const maxValue = Math.max(...(arrayData.length > 0 ? arrayData : [1]), 1);

  // Helper functions to extract highlighting information
  const getHighlightsByStyle = (style: string): number[] => {
    const highlights = currentStep.highlights.sortArray || [];
    const matching = highlights.find((h) => h.style === style);
    return matching?.values || [];
  };

  const getComparingIndices = (): number[] => getHighlightsByStyle("compare");
  const getSwappingIndices = (): number[] => getHighlightsByStyle("swap");
  const getSortedIndices = (): number[] => getHighlightsByStyle("match");
  const getHighlightedIndices = (): number[] =>
    getHighlightsByStyle("highlight");

  const getBarGradient = (index: number): string => {
    const swappingIndices = getSwappingIndices();
    const comparingIndices = getComparingIndices();
    const sortedIndices = getSortedIndices();

    if (swappingIndices.includes(index)) {
      return "from-[rgb(var(--color-danger-400))] via-[rgb(var(--color-danger-500))] to-[rgb(var(--color-danger-600))]";
    }
    if (comparingIndices.includes(index)) {
      return "from-[rgb(var(--color-warning-400))] via-[rgb(var(--color-warning-500))] to-[rgb(var(--color-warning-600))]";
    }
    if (sortedIndices.includes(index)) {
      return "from-[rgb(var(--color-accent-400))] via-[rgb(var(--color-accent-500))] to-[rgb(var(--color-accent-600))]";
    }
    return "from-[rgb(var(--color-primary-400))] via-[rgb(var(--color-primary-500))] to-[rgb(var(--color-primary-600))]";
  };

  const getBarHeight = (value: number): number => {
    return Math.max(10, (value / maxValue) * 280);
  };

  const isSwapping = (index: number): boolean => {
    return getSwappingIndices().includes(index);
  };

  const isComparing = (index: number): boolean => {
    return getComparingIndices().includes(index);
  };

  const isSorted = (index: number): boolean => {
    return getSortedIndices().includes(index);
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
  const numBars = arrayData.length;
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
    <motion.div
      className="flex items-end justify-center gap-3 mb-8 h-80 relative z-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      layout
    >
      {arrayData.map((value: number, index: number) => {
        const comparing = isComparing(index);
        const swapping = isSwapping(index);
        const sorted = isSorted(index);

        return (
          <motion.div
            key={`${value}-${index}`}
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
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 25,
              zIndex: {
                delay: swapping || comparing ? 0 : speed / 2000,
                duration: 0.01,
              },
            }}
            className="relative group"
          >
            {(comparing || swapping) && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent rounded-xl blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            )}

            {/* Sorted element celebration effect */}
            {sorted && (
              <motion.div
                className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-xl"
                initial={{ scale: 0, rotate: -90 }}
                animate={{
                  scale: [0, 1.5, 1],
                  rotate: [0, 180, 360],
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeInOut",
                }}
              >
                ✅
              </motion.div>
            )}

            <motion.div
              className={`
                relative flex flex-col items-center justify-end rounded-xl shadow-lg
                bg-gradient-to-t ${getBarGradient(index)}
                border border-white/20 backdrop-blur-sm
              `}
              style={{
                width: `${barWidth}px`,
                height: `${getBarHeight(value)}px`,
              }}
              animate={{
                scale: comparing || swapping ? 1.05 : sorted ? 1.02 : 1,
                y: comparing || swapping ? -5 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              {swapping && (
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
                className={`text-white font-semibold text-sm mb-1.5 drop-shadow-md ${
                  comparing || swapping ? "text-lg" : ""
                }`}
                animate={{
                  scale: comparing || swapping ? 1.05 : 1,
                  fontWeight: comparing || swapping ? 700 : 600,
                }}
                transition={{ duration: 0.2 }}
              >
                {value}
              </motion.span>

              {/* Index label */}
              <motion.span
                className="absolute -bottom-6 text-xs text-gray-300 font-medium"
                animate={{ opacity: 1 }}
              >
                {index}
              </motion.span>

              {/* Status labels */}
              {comparing && !swapping && (
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                  <div className="text-yellow-400 text-sm font-bold bg-white/20 rounded-lg px-2 py-1 border border-yellow-400/30">
                    COMPARE
                  </div>
                </div>
              )}

              {swapping && (
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                  <div className="text-red-400 text-sm font-bold bg-white/20 rounded-lg px-2 py-1 border border-red-400/30">
                    SWAP
                  </div>
                </div>
              )}

              {sorted && (
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                  <div className="text-green-400 text-sm font-bold bg-white/20 rounded-lg px-2 py-1 border border-green-400/30">
                    SORTED
                  </div>
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-white/10 to-transparent rounded-b-xl" />
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default VisualizationCanvas;
