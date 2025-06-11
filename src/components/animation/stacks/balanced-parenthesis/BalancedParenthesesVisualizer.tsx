import { motion } from "framer-motion";
import { useState, useEffect, useCallback, useMemo } from "react";

import BalancedParenthesesCanvas from "./BalancedParenthesesCanvas";
import BalancedParenthesesLegend from "./BalancedParenthesesLegend";
import StepInformation from "@components/animation/StepInformation";
import { algorithmLineResolver } from "@utils/AlgorithmLineResolver";
import PlaybackControls from "@components/animation/PlaybackControls";
import type { EnhancedAlgorithmStep, Language } from "@/types/algorithm";
import {
  BALANCED_PARENTHESES_ALGORITHM_ID,
  balancedParenthesesLineMapping,
} from "@/constants/stacks/balanced-parentheses/balancedParenthesesLineMapping";
import { generateBalancedParenthesesSteps } from "@/algorithms/stacks/balancedParentheses";

interface BalancedParenthesesVisualizerProps {
  initialInput?: string;
  speed?: number;
  onStepChange?: (
    highlightedLines: number[],
    stepData?: EnhancedAlgorithmStep
  ) => void;
  selectedLanguage?: Language;
}

const DEFAULT_INPUT = "()[]{}";
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

const BalancedParenthesesVisualizer = ({
  initialInput = DEFAULT_INPUT,
  speed = DEFAULT_SPEED,
  onStepChange,
  selectedLanguage = "javascript",
}: BalancedParenthesesVisualizerProps) => {
  const [steps, setSteps] = useState<EnhancedAlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  const debouncedInput = useDebounce(initialInput, 300);

  // register line mapping once on mount
  useEffect(() => {
    algorithmLineResolver.registerAlgorithm(
      BALANCED_PARENTHESES_ALGORITHM_ID,
      balancedParenthesesLineMapping
    );
  }, []);

  // generate steps when debounced input changes
  const generatedSteps = useMemo(() => {
    // validate input - only allow valid bracket characters
    const validChars = /^[()[\]{}]*$/;
    if (!validChars.test(debouncedInput) || debouncedInput.length > 20) {
      return [];
    }

    // generate fresh steps each time input changes
    return generateBalancedParenthesesSteps(debouncedInput);
  }, [debouncedInput]);

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
      case "character_access":
      case "character_check":
      case "stack_push":
      case "stack_peek":
      case "stack_pop":
      case "validation_success":
      case "validation_failure":
        stepKey = currentStep.stepType;
        break;
    }

    return algorithmLineResolver.getHighlightedLines(
      BALANCED_PARENTHESES_ALGORITHM_ID,
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
        getValue: () => `"${debouncedInput}"`,
      },
      {
        key: "currentChar",
        label: "Current",
        color: "purple" as const,
        getValue: (vars: any) => `'${vars.currentChar || "?"}'`,
        condition: (vars: any) => vars.currentChar !== undefined,
      },
      {
        key: "currentIndex",
        label: "Position",
        color: "amber" as const,
        getValue: (vars: any) => `${vars.currentIndex ?? "?"}`,
        condition: (vars: any) => vars.currentIndex !== undefined,
      },
      {
        key: "stackSize",
        label: "Stack Size",
        color: "cyan" as const,
        getValue: (vars: any) => `${vars.stackSize ?? 0}`,
        condition: (vars: any) => vars.stackSize !== undefined,
      },
      {
        key: "status",
        label: "Status",
        color: "emerald" as const,
        getValue: (vars: any) => {
          if (vars.finalResult !== undefined) {
            return vars.finalResult ? "✓ Balanced" : "✗ Not Balanced";
          }
          if (vars.isValid === false) {
            return "✗ Invalid";
          }
          if (vars.matchingPairs !== undefined) {
            return `${vars.matchingPairs} pairs matched`;
          }
          if (vars.errorType) {
            return `Error: ${vars.errorType.replace(/_/g, " ")}`;
          }
          return "Processing...";
        },
      },
    ],
    [debouncedInput]
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
            Balanced Parentheses Checker
          </h2>
          <p className="text-gray-300 text-lg font-medium">
            Watch the stack validate bracket matching in real-time
          </p>
        </motion.div>

        {/* input display */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="backdrop-blur-md bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-lg px-4 py-2">
            <span className="text-purple-200 text-sm font-bold">
              Input: "{debouncedInput}"
            </span>
          </div>
          {currentStep.variables?.finalResult !== undefined && (
            <motion.div
              className={`backdrop-blur-md bg-gradient-to-r border rounded-lg px-4 py-2 ${
                currentStep.variables.finalResult
                  ? "from-emerald-500/20 to-green-500/20 border-emerald-400/30"
                  : "from-red-500/20 to-pink-500/20 border-red-400/30"
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span
                className={`text-sm font-bold ${
                  currentStep.variables.finalResult
                    ? "text-emerald-200"
                    : "text-red-200"
                }`}
              >
                {currentStep.variables.finalResult
                  ? "✓ Balanced"
                  : "✗ Not Balanced"}
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
          <BalancedParenthesesCanvas currentStep={currentStep} />
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
        <BalancedParenthesesLegend />
      </motion.div>
    </div>
  );
};

export default BalancedParenthesesVisualizer;
