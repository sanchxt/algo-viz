import { motion } from "framer-motion";
import type { EnhancedAlgorithmStep } from "@/types/algorithm";

interface TwoPointersCanvasProps {
  currentStep: EnhancedAlgorithmStep;
  initialArray: number[];
  target: number;
  speed?: number;
}

const TwoPointersCanvas = ({
  currentStep,
  initialArray,
  target,
}: TwoPointersCanvasProps) => {
  const arrayData =
    currentStep.dataStructures.searchArray?.data || initialArray;
  const maxValue = Math.max(...(arrayData.length > 0 ? arrayData : [1]), 1);

  // helper functions to extract highlighting information
  const getHighlightsByStyle = (style: string): number[] => {
    const highlights = currentStep.highlights.searchArray || [];
    const matching = highlights.find((h) => h.style === style);
    return matching?.values || [];
  };

  const getLeftPointerIndices = (): number[] =>
    getHighlightsByStyle("highlight");
  const getRightPointerIndices = (): number[] =>
    getHighlightsByStyle("visited");
  const getCurrentComparisonIndices = (): number[] =>
    getHighlightsByStyle("current");
  const getMatchedIndices = (): number[] => getHighlightsByStyle("match");

  const getBarGradient = (index: number): string => {
    const leftPointerIndices = getLeftPointerIndices();
    const rightPointerIndices = getRightPointerIndices();
    const currentComparisonIndices = getCurrentComparisonIndices();
    const matchedIndices = getMatchedIndices();

    // check if solution is found and this element is part of the solution
    if (matchedIndices.includes(index)) {
      return "from-[rgb(var(--color-accent-400))] via-[rgb(var(--color-accent-500))] to-[rgb(var(--color-accent-600))]";
    }

    // left pointer
    if (leftPointerIndices.includes(index)) {
      return "from-blue-400 via-blue-500 to-blue-600";
    }

    // right pointer
    if (rightPointerIndices.includes(index)) {
      return "from-purple-400 via-purple-500 to-purple-600";
    }

    // elements being compared
    if (
      currentComparisonIndices.includes(index) &&
      !leftPointerIndices.includes(index) &&
      !rightPointerIndices.includes(index)
    ) {
      return "from-[rgb(var(--color-danger-400))] via-[rgb(var(--color-danger-500))] to-[rgb(var(--color-danger-600))]";
    }

    // default elements
    return "from-[rgb(var(--color-warning-400))] via-[rgb(var(--color-warning-500))] to-[rgb(var(--color-warning-600))]";
  };

  const getBarHeight = (value: number): number => {
    return Math.max(10, (value / maxValue) * 280);
  };

  const isLeftPointer = (index: number): boolean => {
    const leftPointerIndices = getLeftPointerIndices();
    return leftPointerIndices.includes(index);
  };

  const isRightPointer = (index: number): boolean => {
    const rightPointerIndices = getRightPointerIndices();
    return rightPointerIndices.includes(index);
  };

  const isPartOfSolution = (index: number): boolean => {
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
      {/* target display */}
      <div className="flex gap-4">
        <motion.div
          className="z-20"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <p className="backdrop-blur-md bg-white/20 border border-white/30 rounded-lg px-4 py-1 text-white text-center text-xs font-bold">
            Target Sum: {target}
          </p>
        </motion.div>

        {/* current sum display */}
        {currentStep.variables?.currentSum !== undefined && (
          <motion.div
            className="z-20"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <p className="backdrop-blur-md bg-amber-500/20 border border-amber-400/30 rounded-lg px-4 py-1 text-amber-200 text-center text-xs font-bold">
              Current Sum: {currentStep.variables.currentSum}
            </p>
          </motion.div>
        )}
      </div>

      {/* array visualization */}
      <motion.div
        className="flex items-end justify-center gap-3 h-80 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        layout
      >
        {arrayData.map((value: number, index: number) => {
          const isLeft = isLeftPointer(index);
          const isRight = isRightPointer(index);
          const isSolution = isPartOfSolution(index);

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
                opacity: { duration: 0.3 },
              }}
              className="relative group"
            >
              {/* pointer glow effects */}
              {isLeft && (
                <div className="absolute -inset-2 bg-gradient-to-t from-blue-400/40 to-transparent rounded-xl blur-md" />
              )}
              {isRight && (
                <div className="absolute -inset-2 bg-gradient-to-t from-purple-400/40 to-transparent rounded-xl blur-md" />
              )}

              {/* solution sparkle effect */}
              {isSolution && (
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
                `}
                style={{
                  width: `${barWidth}px`,
                  height: `${getBarHeight(value)}px`,
                }}
                animate={{
                  scale: isLeft || isRight ? 1.05 : 1,
                  y: isLeft || isRight ? -5 : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.span
                  className={`text-white font-semibold text-sm mb-1.5 drop-shadow-md ${
                    isLeft || isRight ? "text-lg" : ""
                  }`}
                  animate={{
                    scale: isLeft || isRight ? 1.2 : 1,
                    fontWeight: isLeft || isRight ? 700 : 600,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {value}
                </motion.span>

                {/* index label */}
                <motion.span className="absolute -bottom-6 text-xs text-gray-300 font-medium">
                  {index}
                </motion.span>

                {/* pointer labels - below bars */}
                {isLeft && (
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                    <div className="text-blue-400 text-xs font-medium">
                      Left
                    </div>
                  </div>
                )}

                {isRight && (
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                    <div className="text-purple-400 text-xs font-medium">
                      Right
                    </div>
                  </div>
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

export default TwoPointersCanvas;
