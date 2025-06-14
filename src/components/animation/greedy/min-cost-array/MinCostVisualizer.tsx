import { motion } from "framer-motion";
import { useState, useEffect, useCallback, useMemo } from "react";

import MinCostCanvas from "./MinCostCanvas";
import MinCostLegend from "./MinCostLegend";
import StepInformation from "@components/animation/StepInformation";
import { algorithmLineResolver } from "@utils/AlgorithmLineResolver";
import PlaybackControls from "@components/animation/PlaybackControls";
import type { EnhancedAlgorithmStep, Language } from "@/types/algorithm";
import {
  MIN_COST_ALGORITHM_ID,
  minCostLineMapping,
} from "@constants/greedy/min-cost-array/minCostLineMapping";
import { generateMinCostSteps } from "@/algorithms/greedy/minCostToMakeArraySizeOne";

interface MinCostVisualizerProps {
  initialArray?: number[];
  speed?: number;
  onStepChange?: (
    highlightedLines: number[],
    stepData?: EnhancedAlgorithmStep
  ) => void;
  selectedLanguage?: Language;
}

const DEFAULT_ARRAY = [3, 1, 4, 2];
const DEFAULT_SPEED = 1500;

const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const MinCostVisualizer = ({
  initialArray = DEFAULT_ARRAY,
  speed = DEFAULT_SPEED,
  onStepChange,
  selectedLanguage = "javascript",
}: MinCostVisualizerProps) => {
  const [steps, setSteps] = useState<EnhancedAlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  const debouncedArray = useDebounce(initialArray, 300);

  // register line mapping once on mount
  useEffect(() => {
    algorithmLineResolver.registerAlgorithm(
      MIN_COST_ALGORITHM_ID,
      minCostLineMapping
    );
  }, []);

  // generate steps when debounced array changes
  const generatedSteps = useMemo(() => {
    if (!debouncedArray || debouncedArray.length === 0) {
      return [];
    }

    // generate enhanced steps with better visualization
    return generateMinCostSteps(debouncedArray);
  }, [debouncedArray]);

  // update steps when generated steps change
  useEffect(() => {
    setIsGenerating(true);

    const updateSteps = () => {
      setSteps(generatedSteps);
      setCurrentStepIndex(0);
      setIsAutoPlaying(false);
      setIsGenerating(false);
    };

    const frameId = requestAnimationFrame(updateSteps);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [generatedSteps]);

  const currentStep = useMemo(() => {
    return steps[currentStepIndex];
  }, [steps, currentStepIndex]);

  const highlightedLines = useMemo(() => {
    if (!currentStep) return [];

    let stepKey: string = currentStep.stepType;

    // handle enhanced step types with appropriate mapping
    switch (currentStep.stepType) {
      case "initialization":
      case "greedy_insight":
      case "formula_derivation":
      case "decision_tree":
      case "greedy_selection":
      case "cost_calculation":
      case "pair_comparison":
      case "element_removal":
      case "optimality_proof":
      case "return":
        stepKey = currentStep.stepType;
        break;
      default:
        // fallback for any unmapped step types
        stepKey = "greedy_selection";
    }

    return algorithmLineResolver.getHighlightedLines(
      MIN_COST_ALGORITHM_ID,
      stepKey as any,
      selectedLanguage,
      currentStep.stepContext
    );
  }, [currentStep, selectedLanguage]);

  // trigger step change callback when relevant data changes
  useEffect(() => {
    if (currentStep && onStepChange) {
      onStepChange(highlightedLines, currentStep);
    }
  }, [currentStep, highlightedLines, onStepChange]);

  // auto-play logic with enhanced timing
  useEffect(() => {
    if (
      !isAutoPlaying ||
      steps.length === 0 ||
      currentStepIndex >= steps.length - 1
    ) {
      return;
    }

    const currentStepData = steps[currentStepIndex];
    const baseDuration = currentStepData?.timing?.duration || speed;
    const baseDelay = currentStepData?.timing?.delay || 0;

    // longer duration for key insight and formula steps
    let adjustedDuration = baseDuration;
    if (currentStepData.stepType === "greedy_insight") {
      adjustedDuration = Math.max(3000, baseDuration);
    } else if (currentStepData.stepType === "formula_derivation") {
      adjustedDuration = Math.max(2500, baseDuration);
    } else if (currentStepData.stepType === "optimality_proof") {
      adjustedDuration = Math.max(3000, baseDuration);
    }

    const finalDuration = Math.max(200, adjustedDuration / playbackSpeed);
    const finalDelay = baseDelay / playbackSpeed;

    const timer = setTimeout(() => {
      setCurrentStepIndex((prev) => prev + 1);
    }, finalDuration + finalDelay);

    return () => clearTimeout(timer);
  }, [currentStepIndex, steps, speed, isAutoPlaying, playbackSpeed]);

  // control functions
  const goToPreviousStep = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
    setIsAutoPlaying(false);
  }, []);

  const goToNextStep = useCallback(() => {
    setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1));
  }, [steps.length]);

  const toggleAutoPlay = useCallback(() => {
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
      setIsAutoPlaying(true);
    } else {
      setIsAutoPlaying((prev) => !prev);
    }
  }, [currentStepIndex, steps.length]);

  const resetAnimation = useCallback(() => {
    setCurrentStepIndex(0);
    setIsAutoPlaying(false);
  }, []);

  const handleSpeedChange = useCallback((newSpeed: number) => {
    setPlaybackSpeed(newSpeed);
  }, []);

  // enhanced variable configuration for greedy algorithm
  const variableConfig = useMemo(
    () => [
      {
        key: "input",
        label: "Array",
        color: "blue" as const,
        getValue: () => `[${debouncedArray.join(", ")}]`,
      },
      {
        key: "minElement",
        label: "Greedy Anchor",
        color: "emerald" as const,
        getValue: (vars: any) => `${vars.minElement}`,
        condition: (vars: any) => vars.minElement !== undefined,
      },
      {
        key: "strategy",
        label: "Strategy",
        color: "purple" as const,
        getValue: (vars: any) => {
          if (vars.keyInsight) return "Greedy Insight";
          if (vars.formula) return "Formula Derived";
          if (vars.greedyPrinciple) return "Optimality Proven";
          return "Processing...";
        },
      },
      {
        key: "cost",
        label: "Cost",
        color: "amber" as const,
        getValue: (vars: any) => {
          if (vars.operationCost !== undefined) return `+${vars.operationCost}`;
          if (vars.predictedCost !== undefined)
            return `Predicted: ${vars.predictedCost}`;
          return `Total: ${vars.totalCost || 0}`;
        },
      },
      {
        key: "progress",
        label: "Progress",
        color: "cyan" as const,
        getValue: (vars: any) => {
          if (
            vars.operationNumber !== undefined &&
            vars.operationsNeeded !== undefined
          ) {
            return `${vars.operationNumber}/${vars.operationsNeeded}`;
          }
          if (vars.operationsNeeded !== undefined)
            return `${vars.operationsNeeded} needed`;
          return "Starting...";
        },
      },
      {
        key: "insight",
        label: "Insight",
        color: "red" as const,
        getValue: (vars: any) => {
          if (vars.isComplete) return "✓ Optimal Achieved";
          if (vars.whyOptimal) return "Greedy = Optimal";
          if (vars.keyInsight) return "Min Element Strategy";
          return "Discovering...";
        },
      },
    ],
    [debouncedArray]
  );

  // loading state
  const isLoading = isGenerating || steps.length === 0 || !currentStep;

  if (isLoading) {
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
              className="w-3 h-3 bg-gradient-to-r from-violet-400 to-purple-500 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
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

  return (
    <div className="w-full max-w-6xl mx-auto">
      <motion.div
        className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* enhanced header */}
        <motion.div
          className="text-center mb-8 relative z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h2 className="text-4xl font-bold text-white mb-3">
            Greedy Algorithm Deep Dive
          </h2>
          <p className="text-gray-300 text-lg font-medium">
            Understanding the strategic decision-making process
          </p>

          {/* step type indicator */}
          {currentStep && (
            <motion.div
              className="mt-4 inline-block px-4 py-2 bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-400/30 rounded-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className="text-violet-200 text-sm font-semibold capitalize">
                {currentStep.stepType.replace("_", " ")} Phase
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* input display with enhanced visualization */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="backdrop-blur-md bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-lg px-4 py-2">
            <span className="text-blue-200 text-sm font-bold">
              Input Array: [{debouncedArray.join(", ")}]
            </span>
          </div>

          {currentStep.variables?.minElement !== undefined && (
            <motion.div
              className="backdrop-blur-md bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-lg px-4 py-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-green-200 text-sm font-bold">
                Greedy Anchor: {currentStep.variables.minElement}
              </span>
            </motion.div>
          )}

          {currentStep.variables?.totalCost !== undefined &&
            currentStep.variables.totalCost > 0 && (
              <motion.div
                className="backdrop-blur-md bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 rounded-lg px-4 py-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <span className="text-amber-200 text-sm font-bold">
                  Total Cost: {currentStep.variables.totalCost}
                </span>
              </motion.div>
            )}
        </motion.div>

        {/* playback controls */}
        <PlaybackControls
          currentStepIndex={currentStepIndex}
          totalSteps={steps.length}
          isAutoPlaying={isAutoPlaying}
          playbackSpeed={playbackSpeed}
          onPreviousStep={goToPreviousStep}
          onNextStep={goToNextStep}
          onToggleAutoPlay={toggleAutoPlay}
          onReset={resetAnimation}
          onSpeedChange={handleSpeedChange}
        />

        {/* enhanced visualization canvas */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <MinCostCanvas
            currentStep={currentStep}
            initialArray={debouncedArray}
          />
        </motion.div>

        {/* enhanced step information */}
        <StepInformation
          currentStep={currentStep}
          currentStepIndex={currentStepIndex}
          totalSteps={steps.length}
          isAutoPlaying={isAutoPlaying}
          variableConfig={variableConfig}
        />

        {/* enhanced legend */}
        <MinCostLegend />
      </motion.div>
    </div>
  );
};

export default MinCostVisualizer;
