import { motion } from "framer-motion";
import { useState, useEffect, useCallback, useMemo } from "react";

import KLargestElementsCanvas from "./KLargestElementsCanvas";
import KLargestElementsLegend from "./KLargestElementsLegend";
import StepInformation from "@components/animation/StepInformation";
import { algorithmLineResolver } from "@utils/AlgorithmLineResolver";
import PlaybackControls from "@components/animation/PlaybackControls";
import type { EnhancedAlgorithmStep, Language } from "@/types/algorithm";
import {
  K_LARGEST_ELEMENTS_ALGORITHM_ID,
  kLargestElementsLineMapping,
} from "@constants/heaps/k-largest-elements/kLargestElementsLineMapping";
import { generateKLargestElementsSteps } from "@/algorithms/heaps/kLargestElements";

interface KLargestElementsVisualizerProps {
  initialArray?: number[];
  initialK?: number;
  speed?: number;
  onStepChange?: (
    highlightedLines: number[],
    stepData?: EnhancedAlgorithmStep
  ) => void;
  selectedLanguage?: Language;
}

// default input for demonstration
const DEFAULT_ARRAY = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3];
const DEFAULT_K = 4;
const DEFAULT_SPEED = 1000;

// debounce hook for performance
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

const KLargestElementsVisualizer = ({
  initialArray = DEFAULT_ARRAY,
  initialK = DEFAULT_K,
  speed = DEFAULT_SPEED,
  onStepChange,
  selectedLanguage = "javascript",
}: KLargestElementsVisualizerProps) => {
  const [steps, setSteps] = useState<EnhancedAlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  const debouncedArray = useDebounce(initialArray, 300);
  const debouncedK = useDebounce(initialK, 300);

  // register line mapping once on mount
  useEffect(() => {
    algorithmLineResolver.registerAlgorithm(
      K_LARGEST_ELEMENTS_ALGORITHM_ID,
      kLargestElementsLineMapping
    );
  }, []);

  // generate steps when debounced inputs change
  const generatedSteps = useMemo(() => {
    if (!debouncedArray || debouncedArray.length === 0 || debouncedK <= 0) {
      return [];
    }

    try {
      return generateKLargestElementsSteps(debouncedArray, debouncedK);
    } catch (error) {
      console.error("Error generating steps:", error);
      return [];
    }
  }, [debouncedArray, debouncedK]);

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
      case "heap_push":
      case "heap_pop":
      case "heap_peek":
      case "heap_compare":
      case "heap_maintain_size":
      case "heap_size_check":
      case "heap_result_found":
        stepKey = currentStep.stepType;
        break;
      case "comparison":
      case "loop_start":
      case "no_swap":
        stepKey = currentStep.stepType;
        break;
      case "heap_initialization":
        stepKey = "heap_initialization";
        break;
      case "return":
        stepKey = "return";
        break;
    }

    return algorithmLineResolver.getHighlightedLines(
      K_LARGEST_ELEMENTS_ALGORITHM_ID,
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

  // auto-play functionality
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

  // variable configuration for step information
  const variableConfig = useMemo(
    () => [
      {
        key: "input",
        label: "Input",
        color: "purple" as const,
        getValue: () =>
          `[${debouncedArray.slice(0, 5).join(", ")}${
            debouncedArray.length > 5 ? "..." : ""
          }]`,
      },
      {
        key: "k",
        label: "K Value",
        color: "emerald" as const,
        getValue: () => `${debouncedK}`,
      },
      {
        key: "currentElement",
        label: "Current Element",
        color: "blue" as const,
        getValue: (vars: any) => vars.currentElement || "None",
        condition: (vars: any) => vars.currentElement !== undefined,
      },
      {
        key: "heapSize",
        label: "Heap Size",
        color: "amber" as const,
        getValue: (vars: any) => `${vars.heapSize || 0}/${debouncedK}`,
      },
      {
        key: "operation",
        label: "Operation",
        color: "cyan" as const,
        getValue: (vars: any) => {
          if (vars.operation === "push") return "➕ Push";
          if (vars.operation === "replace_min") return "🔄 Replace Min";
          if (vars.operation === "skip") return "⏭️ Skip";
          if (vars.efficiency) return `⚡ ${vars.efficiency}`;
          return "🔍 Processing";
        },
      },
    ],
    [debouncedArray, debouncedK]
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
              className="w-3 h-3 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full"
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
            K Largest Elements Visualization
          </h2>
          <p className="text-gray-300 text-lg font-medium">
            Find the {debouncedK} largest elements using a min-heap of size{" "}
            {debouncedK}
          </p>
        </motion.div>

        {/* algorithm info display */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="backdrop-blur-md bg-purple-500/20 border border-purple-400/30 rounded-lg px-4 py-2">
            <span className="text-purple-200 text-sm font-bold">
              Input: [{debouncedArray.slice(0, 6).join(", ")}
              {debouncedArray.length > 6 ? "..." : ""}]
            </span>
          </div>
          <div className="backdrop-blur-md bg-emerald-500/20 border border-emerald-400/30 rounded-lg px-4 py-2">
            <span className="text-emerald-200 text-sm font-bold">
              Find: {debouncedK} largest
            </span>
          </div>
          {currentStep?.variables?.result && (
            <div className="backdrop-blur-md bg-amber-500/20 border border-amber-400/30 rounded-lg px-4 py-2 animate-pulse">
              <span className="text-amber-200 text-sm font-bold">
                ✅ Result Found!
              </span>
            </div>
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
          <KLargestElementsCanvas
            currentStep={currentStep}
            initialArray={debouncedArray}
            initialK={debouncedK}
          />
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
        <KLargestElementsLegend />
      </motion.div>
    </div>
  );
};

export default KLargestElementsVisualizer;
