import { motion } from "framer-motion";
import type { AlgorithmStep } from "@/types/algorithm";

interface BinarySearchCanvasProps {
  currentStep: AlgorithmStep;
  initialArray: number[];
  target: number;
  speed?: number;
}

const BinarySearchCanvas = ({
  currentStep,
  initialArray,
  target,
}: BinarySearchCanvasProps) => {
  const maxValue = Math.max(
    ...(initialArray.length > 0 ? initialArray : [1]),
    1
  );

  const getBarGradient = (index: number, value: number): string => {
    const variables = currentStep.variables;
    const left = variables?.left ?? 0;
    const right = variables?.right ?? initialArray.length - 1;
    const mid = variables?.mid;

    // check if this is the middle element being compared
    if (mid !== undefined && index === mid) {
      return "from-[rgb(var(--color-danger-400))] via-[rgb(var(--color-danger-500))] to-[rgb(var(--color-danger-600))]";
    }

    // check if this is the target value
    if (value === target && variables?.found) {
      return "from-[rgb(var(--color-accent-400))] via-[rgb(var(--color-accent-500))] to-[rgb(var(--color-accent-600))]";
    }

    // check if this element is within the current search range
    if (index >= left && index <= right) {
      // left boundary marker
      if (index === left) {
        return "from-blue-400 via-blue-500 to-blue-600";
      }
      // right boundary marker
      if (index === right) {
        return "from-purple-400 via-purple-500 to-purple-600";
      }
      // regular search range
      return "from-[rgb(var(--color-warning-400))] via-[rgb(var(--color-warning-500))] to-[rgb(var(--color-warning-600))]";
    }

    // outside search range - grayed out
    return "from-gray-400 via-gray-500 to-gray-600";
  };

  const getBarHeight = (value: number): number => {
    return Math.max(10, (value / maxValue) * 280);
  };

  const isInSearchRange = (index: number): boolean => {
    const variables = currentStep.variables;
    const left = variables?.left ?? 0;
    const right = variables?.right ?? initialArray.length - 1;
    return index >= left && index <= right;
  };

  const isMiddleElement = (index: number): boolean => {
    const mid = currentStep.variables?.mid;
    return mid !== undefined && index === mid;
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
  const numBars = initialArray.length;
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
        {initialArray.map((value, index) => {
          const inSearchRange = isInSearchRange(index);
          const isMidElement = isMiddleElement(index);
          const isFound = value === target && currentStep.variables?.found;

          return (
            <motion.div
              key={`${value}-${index}`}
              layout
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.9 },
                visible: {
                  opacity: inSearchRange ? 1 : 0.4,
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
              {/* search range indicators */}
              {inSearchRange && (
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-t from-yellow-400/20 to-transparent rounded-xl blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}

              {/* middle element glow effect */}
              {isMidElement && (
                <motion.div
                  className="absolute -inset-2 bg-gradient-to-t from-red-400/30 to-transparent rounded-xl blur-md"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.8, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}

              {/* found target sparkle effect */}
              {isFound && (
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
                  bg-gradient-to-t ${getBarGradient(index, value)}
                  border border-white/20 backdrop-blur-sm
                  ${!inSearchRange ? "opacity-40" : ""}
                `}
                style={{
                  width: `${barWidth}px`,
                  height: `${getBarHeight(value)}px`,
                }}
                animate={{
                  scale: isMidElement ? 1.05 : 1,
                  y: isMidElement ? -5 : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.span
                  className={`text-white font-semibold text-sm mb-1.5 drop-shadow-md ${
                    isMidElement ? "text-lg" : ""
                  }`}
                  animate={{
                    scale: isMidElement ? 1.2 : 1,
                    fontWeight: isMidElement ? 700 : 600,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {value}
                </motion.span>

                {/* index label */}
                <motion.span
                  className="absolute -bottom-6 text-xs text-gray-300 font-medium"
                  animate={{ opacity: inSearchRange ? 1 : 0.3 }}
                >
                  {index}
                </motion.span>

                {/* MID label for middle element */}
                {currentStep.variables &&
                  index === currentStep.variables.mid && (
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                      <div className="text-red-400 text-sm font-bold bg-white/20 rounded-lg px-3 py-1.5 border border-red-400/30">
                        MID
                      </div>
                    </div>
                  )}

                <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-white/10 to-transparent rounded-b-xl" />
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
      {/* search range visualization */}
      {/* {currentStep.variables && (
        <motion.div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex items-center gap-4 text-sm text-gray-300 mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <span>
              Search Range: [{currentStep.variables.left},{" "}
              {currentStep.variables.right}]
            </span>
          </div>
          {currentStep.variables.mid !== undefined && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <span>Mid: {currentStep.variables.mid}</span>
            </div>
          )}
        </motion.div>
      )} */}
    </div>
  );
};

export default BinarySearchCanvas;
