import { motion } from "framer-motion";
import { useState, useEffect, useCallback, useMemo } from "react";

import FactorialCanvas from "./FactorialCanvas";
import FactorialLegend from "./FactorialLegend";
import StepInformation from "@components/animation/StepInformation";
import { algorithmLineResolver } from "@utils/AlgorithmLineResolver";
import PlaybackControls from "@components/animation/PlaybackControls";
import type { EnhancedAlgorithmStep, Language } from "@/types/algorithm";
import {
  FACTORIAL_ALGORITHM_ID,
  factorialLineMapping,
} from "@constants/recursion/factorial/factorialLineMapping";
import { generateFactorialSteps } from "@/algorithms/recursion/factorial";

interface FactorialVisualizerProps {
  initialN?: number;
  speed?: number;
  onStepChange?: (
    highlightedLines: number[],
    stepData?: EnhancedAlgorithmStep
  ) => void;
  selectedLanguage?: Language;
}

const DEFAULT_N = 5;
const DEFAULT_SPEED = 1200;

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

const FactorialVisualizer = ({
  initialN = DEFAULT_N,
  speed = DEFAULT_SPEED,
  onStepChange,
  selectedLanguage = "javascript",
}: FactorialVisualizerProps) => {
  const [steps, setSteps] = useState<EnhancedAlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  const debouncedN = useDebounce(initialN, 300);

  // register line mapping once on mount
  useEffect(() => {
    algorithmLineResolver.registerAlgorithm(
      FACTORIAL_ALGORITHM_ID,
      factorialLineMapping
    );
  }, []);

  // generate steps when debounced N changes
  const generatedSteps = useMemo(() => {
    if (debouncedN < 0 || debouncedN > 8) {
      return [];
    }

    // generate fresh steps each time input changes
    return generateFactorialSteps(debouncedN);
  }, [debouncedN]);

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

    // handle specific step types that might need context
    switch (currentStep.stepType) {
      case "base_case_check":
      case "base_case_reached":
      case "recursive_call":
      case "recursive_return":
      case "call_stack_pop":
        stepKey = currentStep.stepType;
        break;
    }

    return algorithmLineResolver.getHighlightedLines(
      FACTORIAL_ALGORITHM_ID,
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

  // auto-play
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

    const adjustedDuration = Math.max(200, baseDuration / playbackSpeed);
    const adjustedDelay = baseDelay / playbackSpeed;

    const timer = setTimeout(() => {
      setCurrentStepIndex((prev) => prev + 1);
    }, adjustedDuration + adjustedDelay);

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

  // variable configuration
  const variableConfig = useMemo(
    () => [
      {
        key: "input",
        label: "Input",
        color: "blue" as const,
        getValue: () => `factorial(${debouncedN})`,
      },
      {
        key: "currentCall",
        label: "Current Call",
        color: "purple" as const,
        getValue: (vars: any) => `factorial(${vars.currentN || "?"})`,
        condition: (vars: any) => vars.currentN !== undefined,
      },
      {
        key: "recursionLevel",
        label: "Depth",
        color: "amber" as const,
        getValue: (vars: any) => `Level ${vars.recursionLevel || 0}`,
        condition: (vars: any) => vars.recursionLevel !== undefined,
      },
      {
        key: "callStackSize",
        label: "Stack Size",
        color: "cyan" as const,
        getValue: (vars: any) => `${vars.callStackSize || 0} calls`,
        condition: (vars: any) => vars.callStackSize !== undefined,
      },
      {
        key: "result",
        label: "Status",
        color: "emerald" as const,
        getValue: (vars: any) => {
          if (vars.finalResult !== undefined)
            return `✓ Result: ${vars.finalResult}`;
          if (vars.returnValue !== undefined)
            return `Returning: ${vars.returnValue}`;
          if (vars.baseCaseReached) return "Base case reached!";
          if (vars.calculation) return vars.calculation;
          return "Processing...";
        },
      },
    ],
    [debouncedN]
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

  return (
    <div className="w-full max-w-6xl mx-auto">
      <motion.div
        className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* header */}
        <motion.div
          className="text-center mb-8 relative z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h2 className="text-4xl font-bold text-white mb-3">
            Factorial Recursion Visualization
          </h2>
          <p className="text-gray-300 text-lg font-medium">
            Watch the call stack and recursion tree in action
          </p>
        </motion.div>

        {/* input display */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="backdrop-blur-md bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-lg px-4 py-2">
            <span className="text-blue-200 text-sm font-bold">
              factorial({debouncedN})
            </span>
          </div>
          {currentStep.variables?.finalResult !== undefined && (
            <motion.div
              className="backdrop-blur-md bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-400/30 rounded-lg px-4 py-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-emerald-200 text-sm font-bold">
                = {currentStep.variables.finalResult}
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

        {/* visualization canvas */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <FactorialCanvas currentStep={currentStep} initialN={debouncedN} />
        </motion.div>

        {/* step information */}
        <StepInformation
          currentStep={currentStep}
          currentStepIndex={currentStepIndex}
          totalSteps={steps.length}
          isAutoPlaying={isAutoPlaying}
          variableConfig={variableConfig}
        />

        {/* legend */}
        <FactorialLegend />
      </motion.div>
    </div>
  );
};

export default FactorialVisualizer;
