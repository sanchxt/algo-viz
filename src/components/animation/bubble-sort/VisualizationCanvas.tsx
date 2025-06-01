import { motion } from "framer-motion";

import type { AlgorithmStep } from "../../../types/algorithm";

interface VisualizationCanvasProps {
  currentStep: AlgorithmStep;
  arrayForSort: number[];
  speed: number;
}

const VisualizationCanvas = ({
  currentStep,
  arrayForSort,
  speed,
}: VisualizationCanvasProps) => {
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
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 25,
              zIndex: {
                delay: isSwapping || isComparing ? 0 : speed / 2000,
                duration: 0.01,
              },
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
  );
};

export default VisualizationCanvas;
