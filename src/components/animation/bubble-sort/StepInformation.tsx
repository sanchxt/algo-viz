import { motion } from "framer-motion";
import type { AlgorithmStep } from "../../../types/algorithm";

interface StepInformationProps {
  currentStep: AlgorithmStep;
  currentStepIndex: number;
  totalSteps: number;
  isAutoPlaying: boolean;
}

const StepInformation = ({
  currentStep,
  currentStepIndex,
  totalSteps,
  isAutoPlaying,
}: StepInformationProps) => {
  const isAtEnd = currentStepIndex >= totalSteps - 1;

  return (
    <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 mb-6 relative z-10">
      <div className="flex justify-between items-center mb-4">
        <motion.span
          className="text-sm font-bold text-gray-200 px-3 py-1 bg-white/20 rounded-full"
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          Step {currentStepIndex + 1} of {totalSteps}
        </motion.span>

        <motion.div
          className="flex items-center gap-2"
          animate={{ opacity: isAutoPlaying ? [1, 0.6, 1] : 1 }}
          transition={{ duration: 1, repeat: isAutoPlaying ? Infinity : 0 }}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              isAutoPlaying ? "bg-green-400" : "bg-gray-400"
            }`}
          />
          <span className="text-sm text-gray-200 font-medium">
            {isAutoPlaying
              ? "Auto-playing"
              : isAtEnd && totalSteps > 0
              ? "Completed"
              : "Manual"}
          </span>
        </motion.div>
      </div>

      <motion.p
        className="text-gray-100 mb-4 font-medium leading-relaxed min-h-[3em]"
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {currentStep?.explanation || "Processing..."}
      </motion.p>

      {currentStep.variables && (
        <motion.div
          className="flex flex-wrap gap-4 text-sm"
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 rounded-xl border border-blue-400/30">
            <div className="w-2 h-2 bg-blue-400 rounded-full" />
            <span className="text-blue-200 font-semibold text-xs">
              Pass: {(currentStep.variables.outerLoop || 0) + 1}
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 rounded-xl border border-emerald-400/30">
            <div className="w-2 h-2 bg-emerald-400 rounded-full" />
            <span className="text-emerald-200 font-semibold text-xs">
              Total Swaps: {currentStep.variables.swaps || 0}
            </span>
          </div>
          {currentStep.variables.swapsInPass !== undefined && (
            <div className="flex items-center gap-2 px-3 py-2 bg-purple-500/10 rounded-xl border border-purple-400/30">
              <div className="w-2 h-2 bg-purple-400 rounded-full" />
              <span className="text-purple-200 font-semibold text-xs">
                Swaps in Pass: {currentStep.variables.swapsInPass}
              </span>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default StepInformation;
