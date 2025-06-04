import { motion } from "framer-motion";
import type { AlgorithmStep } from "@/types/algorithm";

interface VariableDisplayConfig {
  key: string;
  label: string;
  color: "blue" | "emerald" | "purple" | "amber" | "red" | "cyan";
  getValue: (variables: Record<string, any>) => string | number;
  condition?: (variables: Record<string, any>) => boolean;
}

interface StepInformationProps {
  currentStep: AlgorithmStep;
  currentStepIndex: number;
  totalSteps: number;
  isAutoPlaying: boolean;
  variableConfig?: VariableDisplayConfig[];
}

const colorClasses = {
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-400/30",
    text: "text-blue-200",
    dot: "bg-blue-400",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-400/30",
    text: "text-emerald-200",
    dot: "bg-emerald-400",
  },
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-400/30",
    text: "text-purple-200",
    dot: "bg-purple-400",
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-400/30",
    text: "text-amber-200",
    dot: "bg-amber-400",
  },
  red: {
    bg: "bg-red-500/10",
    border: "border-red-400/30",
    text: "text-red-200",
    dot: "bg-red-400",
  },
  cyan: {
    bg: "bg-cyan-500/10",
    border: "border-cyan-400/30",
    text: "text-cyan-200",
    dot: "bg-cyan-400",
  },
};

const StepInformation = ({
  currentStep,
  currentStepIndex,
  totalSteps,
  isAutoPlaying,
  variableConfig = [],
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

      {currentStep.variables && variableConfig.length > 0 && (
        <motion.div
          className="flex flex-wrap gap-4 text-sm"
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {variableConfig.map((config) => {
            // check if this variable should be displayed
            if (config.condition && !config.condition(currentStep.variables!)) {
              return null;
            }

            const value = config.getValue(currentStep.variables!);
            const colors = colorClasses[config.color];

            return (
              <div
                key={config.key}
                className={`flex items-center gap-2 px-3 py-2 ${colors.bg} rounded-xl border ${colors.border}`}
              >
                <div className={`w-2 h-2 ${colors.dot} rounded-full`} />
                <span className={`${colors.text} font-semibold text-xs`}>
                  {config.label}: {value}
                </span>
              </div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default StepInformation;
