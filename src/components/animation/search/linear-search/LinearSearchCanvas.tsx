import { motion } from "framer-motion";
import type { EnhancedAlgorithmStep } from "@/types/algorithm";

interface LinearSearchCanvasProps {
  currentStep: EnhancedAlgorithmStep;
  initialArray: number[];
  target: number;
  speed?: number;
}

const LinearSearchCanvas = ({
  currentStep,
  initialArray,
  target,
}: LinearSearchCanvasProps) => {
  const arrayData =
    currentStep.dataStructures.searchArray?.data || initialArray;
  const maxValue = Math.max(...(arrayData.length > 0 ? arrayData : [1]), 1);

  // helper functions to extract highlighting information
  const getHighlightsByStyle = (style: string): number[] => {
    const highlights = currentStep.highlights.searchArray || [];
    const matching = highlights.find((h) => h.style === style);
    return matching?.values || [];
  };

  const getCurrentIndices = (): number[] => getHighlightsByStyle("current");
  const getCompareIndices = (): number[] => getHighlightsByStyle("compare");
  const getVisitedIndices = (): number[] => getHighlightsByStyle("visited");
  const getMatchedIndices = (): number[] => getHighlightsByStyle("match");

  const getBarGradient = (index: number): string => {
    const currentIndices = getCurrentIndices();
    const compareIndices = getCompareIndices();
    const visitedIndices = getVisitedIndices();
    const matchedIndices = getMatchedIndices();

    // check if this is the target value and found
    if (matchedIndices.includes(index)) {
      return "from-[rgb(var(--color-accent-400))] via-[rgb(var(--color-accent-500))] to-[rgb(var(--color-accent-600))]";
    }

    // check if this is the current element being examined
    if (currentIndices.includes(index)) {
      return "from-[rgb(var(--color-danger-400))] via-[rgb(var(--color-danger-500))] to-[rgb(var(--color-danger-600))]";
    }

    // check if this element is being compared
    if (compareIndices.includes(index)) {
      return "from-[rgb(var(--color-warning-400))] via-[rgb(var(--color-warning-500))] to-[rgb(var(--color-warning-600))]";
    }

    // check if this element has been processed (visited)
    if (visitedIndices.includes(index)) {
      return "from-gray-400 via-gray-500 to-gray-600";
    }

    // unprocessed elements (neutral/default)
    return "from-[rgb(var(--color-warning-400))] via-[rgb(var(--color-warning-500))] to-[rgb(var(--color-warning-600))]";
  };

  const getBarHeight = (value: number): number => {
    return Math.max(10, (value / maxValue) * 280);
  };

  const isCurrentElement = (index: number): boolean => {
    const currentIndices = getCurrentIndices();
    return currentIndices.includes(index);
  };

  const isCompareElement = (index: number): boolean => {
    const compareIndices = getCompareIndices();
    return compareIndices.includes(index);
  };

  const isProcessed = (index: number): boolean => {
    const visitedIndices = getVisitedIndices();
    return visitedIndices.includes(index);
  };

  const isFound = (index: number): boolean => {
    const matchedIndices = getMatchedIndices();
    return matchedIndices.includes(index);
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
    <div className="relative pb-16">
      <motion.div
        className="absolute top-0 left-0 z-20"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <p className="backdrop-blur-md bg-white/20 border border-white/30 rounded-lg px-4 py-1 text-white text-center text-xs font-bold">
          Searching for: {target}
        </p>
      </motion.div>

      {/* array visualization */}
      <motion.div
        className="flex items-end justify-center gap-3 h-80 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        layout
      >
        {arrayData.map((value: number, index: number) => {
          const isCurrent = isCurrentElement(index);
          const isComparing = isCompareElement(index);
          const isProcessedElement = isProcessed(index);
          const isFoundElement = isFound(index);

          return (
            <motion.div
              key={`${value}-${index}`}
              layout
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.9 },
                visible: {
                  opacity: isProcessedElement && !isFoundElement ? 0.6 : 1,
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
                opacity: { duration: 0.3 },
              }}
              className="relative group"
            >
              {/* current element glow effect */}
              {(isCurrent || isComparing) && (
                <div className="absolute -inset-2 bg-gradient-to-t from-red-400/55 to-transparent rounded-xl blur-md" />
              )}

              {/* found target sparkle effect */}
              {isFoundElement && (
                <motion.div
                  className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-2xl"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{
                    scale: [0, 1.5, 1],
                    rotate: [0, 180, 360],
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 0.8,
                    ease: "easeInOut",
                  }}
                >
                  ⭐
                </motion.div>
              )}

              <motion.div
                className={`
                  relative flex flex-col items-center justify-end rounded-xl shadow-lg
                  bg-gradient-to-t ${getBarGradient(index)}
                  border border-white/20 backdrop-blur-sm
                  ${isProcessedElement && !isFoundElement ? "opacity-60" : ""}
                `}
                style={{
                  width: `${barWidth}px`,
                  height: `${getBarHeight(value)}px`,
                }}
                animate={{
                  scale: isCurrent || isComparing ? 1.05 : 1,
                  y: isCurrent || isComparing ? -5 : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.span
                  className={`text-white font-semibold text-sm mb-1.5 drop-shadow-md ${
                    isCurrent || isComparing ? "text-lg" : ""
                  }`}
                  animate={{
                    scale: isCurrent || isComparing ? 1.2 : 1,
                    fontWeight: isCurrent || isComparing ? 700 : 600,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {value}
                </motion.span>

                {/* index label */}
                <motion.span
                  className="absolute -bottom-6 text-xs text-gray-300 font-medium"
                  animate={{
                    opacity: isProcessedElement && !isFoundElement ? 0.4 : 1,
                  }}
                >
                  {index}
                </motion.span>

                {/* CURRENT label for current element */}
                {isCurrent && (
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                    <div className="text-red-400 text-sm font-bold bg-white/20 rounded-lg px-3 py-1.5 border border-red-400/30">
                      CURRENT
                    </div>
                  </div>
                )}

                {/* COMPARING label for compare step */}
                {isComparing && !isCurrent && (
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                    <div className="text-orange-400 text-sm font-bold bg-white/20 rounded-lg px-3 py-1.5 border border-orange-400/30">
                      COMPARE
                    </div>
                  </div>
                )}

                {/* processing indicator arrow */}
                {(isCurrent || isComparing) && (
                  <motion.div
                    className="absolute -top-16 left-1/2 transform -translate-x-1/2 text-red-400 text-xl"
                    animate={{
                      y: [0, -5, 0],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    ↓
                  </motion.div>
                )}

                <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-white/10 to-transparent rounded-b-xl" />
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default LinearSearchCanvas;
